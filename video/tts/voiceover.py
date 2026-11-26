"""Generate the Ashetag ad voiceover with Kokoro (local, Apache-2.0) and mux it into the video.

Usage (from anywhere):
    python -I voiceover.py <voice> <label>
    e.g. python -I voiceover.py af_heart female
         python -I voiceover.py am_michael male

Outputs:
    video/tts/out/<label>/line1..7.wav, vo-mix.wav
    video/out/ashetag-ad-vertical-vo-<label>.mp4
"""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = Path(__file__).resolve().parent
VIDEO_DIR = HERE.parent
MODEL = HERE / "models" / "kokoro-v1.0.onnx"
VOICES = HERE / "models" / "voices-v1.0.bin"
SRC_VIDEO = VIDEO_DIR / "out" / "ashetag-ad-vertical.mp4"
FFMPEG = os.environ.get("FFMPEG") or str(
    Path(os.environ["LOCALAPPDATA"])
    / "Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.1-full_build/bin/ffmpeg.exe"
)

# (start, hard_end, text spoken). hard_end = 0.2 s before the next line starts, so lines may carry
# a little into the next shot (J-cut) but never overlap. "Ashetag" is spelled "Ashtag" -> said ASH-tag.
LINES = [
    (0.30, 3.00, "Busywork? ... Put it on autopilot."),
    (3.20, 8.25, "Ashtag builds the AI agents, automations and websites that run your operations."),
    (8.45, 13.10, "Workflows that never sleep. Leads routed. Invoices synced. Reports done."),
    (13.30, 18.15, "Agents that answer, qualify and book your customers, in seconds, twenty-four seven."),
    (18.35, 23.05, "Real results: hours back every week, and more revenue from the same team."),
    (23.25, 26.40, "Built on the AI tools you already trust."),
    (26.95, 29.88, "Book your free AI audit... at Ashtag dot com."),
]
TOTAL = 30.0
MAX_SPEED = 1.12


def trim(x: np.ndarray, sr: int, thr: float = 0.012, pad: float = 0.04) -> np.ndarray:
    idx = np.where(np.abs(x) > thr)[0]
    if idx.size == 0:
        return x
    a = max(0, idx[0] - int(pad * sr))
    b = min(len(x), idx[-1] + int(pad * sr))
    return x[a:b]


def fade(x: np.ndarray, sr: int, ms: float = 10) -> np.ndarray:
    n = min(int(sr * ms / 1000), len(x) // 2)
    if n > 0:
        ramp = np.linspace(0, 1, n, dtype=np.float32)
        x = x.copy()
        x[:n] *= ramp
        x[-n:] *= ramp[::-1]
    return x


def run(args):
    return subprocess.run(args, capture_output=True, text=True, check=True)


def main():
    voice = sys.argv[1] if len(sys.argv) > 1 else "af_heart"
    label = sys.argv[2] if len(sys.argv) > 2 else voice
    out_dir = HERE / "out" / label
    out_dir.mkdir(parents=True, exist_ok=True)

    kokoro = Kokoro(str(MODEL), str(VOICES))
    sr = 24000
    track = np.zeros(int(TOTAL * sr), dtype=np.float32)
    report = []

    for i, (start, end, text) in enumerate(LINES, 1):
        window = end - start
        speed = 1.0
        samples, sr = kokoro.create(text, voice=voice, speed=speed, lang="en-us")
        clip = trim(np.asarray(samples, dtype=np.float32), sr)
        dur = len(clip) / sr
        for _ in range(4):  # refine speed until the line fits its window (or hits MAX_SPEED)
            if dur <= window or speed >= MAX_SPEED:
                break
            speed = min(MAX_SPEED, round(speed * dur / window * 1.01, 3))
            samples, sr = kokoro.create(text, voice=voice, speed=speed, lang="en-us")
            clip = trim(np.asarray(samples, dtype=np.float32), sr)
            dur = len(clip) / sr
        clip = fade(clip, sr)
        sf.write(out_dir / f"line{i}.wav", clip, sr)
        a = int(start * sr)
        b = min(len(track), a + len(clip))
        track[a:b] += clip[: b - a]
        report.append((i, start, round(start + dur, 2), end, speed, start + dur <= end + 1e-3))

    # Refuse to build a video where a line overlaps the next one or gets cut off at the end.
    problems = []
    for k, (i, s, e, lim, spd, ok) in enumerate(report):
        nxt = LINES[k + 1][0] if k + 1 < len(LINES) else TOTAL
        if e > nxt - 0.08:
            problems.append(f"line {i} ends at {e:.2f}s but must finish before {nxt - 0.08:.2f}s (speed {spd})")
    if problems:
        print(f"voice={voice}: does not fit the 30 s cut without rushing past {MAX_SPEED}x:")
        print("\n".join("  - " + p for p in problems))
        sys.exit(2)

    raw = out_dir / "vo-raw.wav"
    sf.write(raw, track, sr)

    # Two-pass loudness normalisation to -14 LUFS / -1 dBTP after cleanup and gentle compression.
    pre = "aresample=48000,highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=5:release=120:makeup=2"
    p1 = run([FFMPEG, "-hide_banner", "-i", str(raw), "-af", f"{pre},loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"])
    m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", p1.stderr, re.S).group(0))
    ln = (
        f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
        f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true:print_format=json"
    )
    mix = out_dir / "vo-mix.wav"
    p2 = run([FFMPEG, "-hide_banner", "-y", "-i", str(raw), "-af", f"{pre},{ln}", "-ar", "48000", "-ac", "2", "-t", str(TOTAL), str(mix)])
    final = json.loads(re.search(r"\{[^{}]*\"output_i\"[^{}]*\}", p2.stderr, re.S).group(0))

    out_mp4 = VIDEO_DIR / "out" / f"ashetag-ad-vertical-vo-{label}.mp4"
    run([FFMPEG, "-hide_banner", "-y", "-i", str(SRC_VIDEO), "-i", str(mix), "-map", "0:v:0", "-map", "1:a:0",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-t", str(TOTAL),
         "-movflags", "+faststart", str(out_mp4)])

    print(f"voice={voice}  output={out_mp4}")
    print(f"loudness: {final['output_i']} LUFS, true peak {final['output_tp']} dBTP")
    print("line  start   end   limit  speed  fits")
    for i, s, e, lim, spd, ok in report:
        print(f"  {i}   {s:5.2f}  {e:5.2f}  {lim:5.2f}  {spd:4.2f}   {'yes' if ok else 'NO'}")


if __name__ == "__main__":
    main()
