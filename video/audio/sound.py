"""Original music + sound effects for the Ashetag vertical ad, synthesised in code.

Everything is generated from oscillators and filtered noise with a fixed random seed, so the
result is identical on every run and there is nothing to license. Event times come from the
video timeline in ../stage.html.

Usage:  python -P sound.py
Outputs:
    audio/out/music.wav, sfx.wav, mix-voice.wav, mix-novoice.wav
    out/ashetag-ad-vertical-final.mp4        (voice + music + sfx)
    out/ashetag-ad-vertical-music-sfx.mp4    (music + sfx, no voice)
"""
import json
import os
import re
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.ndimage import maximum_filter1d
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
DUR = 30.0
N = int(SR * DUR)
HERE = Path(__file__).resolve().parent
VID = HERE.parent
OUT = HERE / "out"
OUT.mkdir(exist_ok=True)
VOICE = VID / "tts" / "out" / "female" / "vo-mix.wav"
SRC_VIDEO = VID / "out" / "ashetag-ad-vertical.mp4"
FFMPEG = os.environ.get("FFMPEG") or str(
    Path(os.environ["LOCALAPPDATA"])
    / "Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.1-full_build/bin/ffmpeg.exe"
)
rng = np.random.default_rng(20261126)


# ---------------------------------------------------------------- helpers
def T(dur):
    return np.arange(int(dur * SR)) / SR


def filt(x, kind, f, order=2):
    return sosfilt(butter(order, f, btype=kind, fs=SR, output="sos"), x, axis=0)


def stereo(x, pan=0.0):
    th = (np.asarray(pan) + 1) * np.pi / 4
    return np.stack([x * np.cos(th), x * np.sin(th)], axis=-1) * np.sqrt(2)


def add(dst, x, t, gain=1.0, pan=0.0):
    if x.ndim == 1:
        x = stereo(x, pan)
    i = int(round(t * SR))
    if i < 0:
        x, i = x[-i:], 0
    j = min(len(dst), i + len(x))
    if j > i:
        dst[i:j] += x[: j - i] * gain


def peak_norm(x, p=1.0):
    m = np.max(np.abs(x))
    return x / m * p if m > 0 else x


def saw(f, t, phase=0.0):
    return 2 * ((f * t + phase) % 1.0) - 1


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def buf():
    return np.zeros((N, 2))


def reverb(x, decay=1.4, wet=0.25, pre=0.018):
    n = int(decay * 1.1 * SR)
    t = np.arange(n) / SR
    out = x.copy()
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-t / (decay / 6.9))
        ir = filt(ir, "low", 5500)
        ir = np.concatenate([np.zeros(int(pre * SR)), ir])
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, ch] += wet * fftconvolve(x[:, ch], ir)[: len(x)]
    return out


# ---------------------------------------------------------------- instruments
def kick(f0=150, f1=48, dur=0.42, decay=0.16, drive=1.6):
    t = T(dur)
    f = f1 + (f0 - f1) * np.exp(-t / 0.035)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / decay)
    click = filt(rng.standard_normal(len(t)), "high", 3000) * np.exp(-t / 0.004) * 0.25
    return np.tanh((body + click) * drive) / np.tanh(drive)


def clap(dur=0.4):
    t = T(dur)
    n = filt(rng.standard_normal(len(t)), "band", [900, 3200])
    e = sum(np.where(t >= d, np.exp(-(t - d) / 0.008), 0) * 0.6 for d in (0, 0.011, 0.022))
    e = e + np.where(t >= 0.03, np.exp(-(t - 0.03) / 0.11), 0)
    return n * e * 0.8


def hat(decay=0.018, dur=0.08):
    t = T(dur)
    return filt(rng.standard_normal(len(t)), "high", 7500) * np.exp(-t / decay) * 0.5


def crash(dur=2.0):
    t = T(dur)
    ch = [filt(rng.standard_normal(len(t)), "high", 4500) * np.exp(-t / 0.65) for _ in range(2)]
    return np.stack(ch, -1) * 0.32


def supersaw(freq, dur, detune_c=14, voices=5):
    t = T(dur)
    L = np.zeros(len(t))
    R = np.zeros(len(t))
    for v in range(voices):
        c = (v - (voices - 1) / 2) / ((voices - 1) / 2) * detune_c
        s = saw(freq * 2 ** (c / 1200), t, rng.random())
        if v == voices // 2:
            L += s * 0.7
            R += s * 0.7
        elif v % 2:
            L += s
        else:
            R += s
    return np.stack([L, R], -1) / voices


def pad_chord(notes, dur, cutoff, attack=0.05, release=0.18):
    x = sum(supersaw(midi(m), dur) for m in notes) / len(notes)
    x = filt(x, "low", cutoff, order=2)
    t = T(dur)
    env = np.minimum(1, t / attack) * np.clip((dur - t) / release, 0, 1)
    return x * env[:, None]


def pluck(freq, dur=0.32):
    t = T(dur)
    x = saw(freq, t) * 0.55 + np.sin(2 * np.pi * freq * t) * 0.5
    return filt(x, "low", 2400) * np.exp(-t / 0.085) * np.minimum(1, t / 0.002)


def bass_note(freq, dur=0.23, decay=0.18):
    t = T(dur)
    x = saw(freq, t) * 0.7 + np.sin(2 * np.pi * freq * t)
    x = filt(x, "low", 650)
    env = np.minimum(1, t / 0.005) * np.exp(-t / decay) * np.clip((dur - t) / 0.02, 0, 1)
    return np.tanh(x * env * 1.6)


# ---------------------------------------------------------------- sound effects
def whoosh(dur, f0, f1, peak=0.6, width=0.2):
    n = int(dur * SR)
    u = np.linspace(0, 1, n)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    bands = np.geomspace(f0, f1, 9)
    for k, fc in enumerate(bands):
        lo, hi = max(30, fc / 1.6), min(SR / 2 - 500, fc * 1.6)
        out += filt(noise, "band", [lo, hi]) * np.exp(-((u - k / (len(bands) - 1)) / width) ** 2)
    env = np.where(u < peak, (u / peak) ** 2.2, ((1 - u) / (1 - peak)) ** 1.6)
    return peak_norm(out * env)


def pop(f=600, dur=0.16):
    t = T(dur)
    fr = f * (1 + 0.9 * np.exp(-t / 0.012))
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / 0.045)
    x += filt(rng.standard_normal(len(t)), "high", 2500) * np.exp(-t / 0.002) * 0.3
    return x * 0.9


def bell(f, dur=1.3, decay=0.42, index=2.0, ratio=3.5):
    t = T(dur)
    idx = index * np.exp(-t / 0.15)
    x = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * ratio * t)) * np.exp(-t / decay)
    x += 0.3 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / (decay * 0.5))
    return x * np.minimum(1, t / 0.002)


def tick(f=3000, dur=0.03):
    t = T(dur)
    return np.sin(2 * np.pi * f * t) * np.exp(-t / 0.004)


def keyclick():
    t = T(0.035)
    n = filt(rng.standard_normal(len(t)), "band", [1800, 6000]) * np.exp(-t / 0.0035)
    th = np.sin(2 * np.pi * (170 + rng.random() * 70) * t) * np.exp(-t / 0.008) * 0.5
    return (n + th) * 0.7


def thump(f0=170, f1=60, dur=0.35, decay=0.1):
    return kick(f0, f1, dur, decay, drive=1.2) * 0.8


def impact(dur=1.5):
    t = T(dur)
    f = 38 + (120 - 38) * np.exp(-t / 0.05)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.45)
    noise = filt(rng.standard_normal(len(t)), "low", 2500) * np.exp(-t / 0.12) * 0.6
    crack = filt(rng.standard_normal(len(t)), "high", 2000) * np.exp(-t / 0.01) * 0.45
    return np.tanh((body + noise + crack) * 1.4)


def shimmer(dur=1.2, n=12, lo=2500, hi=9000):
    t = T(dur)
    x = np.zeros(len(t))
    for _ in range(n):
        f = np.exp(rng.uniform(np.log(lo), np.log(hi)))
        d = rng.uniform(0, 0.25)
        x += np.where(t >= d, np.sin(2 * np.pi * f * (t - d)) * np.exp(-(t - d) / rng.uniform(0.15, 0.45)), 0)
    return x / n * 2


def riser(dur, f0=180, f1=1800):
    t = T(dur)
    u = t / dur
    f = f0 * (f1 / f0) ** u
    s = filt(2 * ((np.cumsum(f) / SR) % 1) - 1, "low", 4000) * 0.35
    nz = whoosh(dur, 400, 9000, peak=0.985, width=0.25) * 0.6
    return (s + nz) * u ** 2.5


def chime(base=1046.5):
    x = np.zeros(int(1.8 * SR))
    for k, r in enumerate([1, 1.26, 1.5, 2.0]):
        b = bell(base * r, dur=1.5, decay=0.5, index=1.4)
        i = int(k * 0.085 * SR)
        x[i:i + len(b)] += b[: len(x) - i] * (0.9 if k < 3 else 0.6)
    return x / 3


# ---------------------------------------------------------------- music
def build_music():
    E = lambda t: t  # noqa: E731  (readability alias for event times)
    G0, BEAT = 3.0, 0.5
    CH = [(45, [57, 60, 64]), (41, [53, 57, 60]), (48, [55, 60, 64]), (43, [55, 59, 62])]  # Am F C G
    chord_at = lambda t: CH[int((t - G0) // 2) % 4]  # noqa: E731

    drums, bass, pad, arp, fx = buf(), buf(), buf(), buf(), buf()

    kicks = [G0 + BEAT * k for k in range(int((25.5 - G0) / BEAT) + 1)]
    for kt in kicks:
        add(drums, kick(), kt, 0.9)
    for kt in (27.85,):
        add(drums, kick(dur=0.5, decay=0.2), kt, 0.55)
    add(drums, kick(dur=0.7, decay=0.3), 29.0, 0.8)

    # sidechain pump from kicks
    last = np.full(N, -10.0)
    for kt in kicks + [27.85, 29.0]:
        last[int(kt * SR):] = kt
    tt = np.arange(N) / SR
    pump = 1 - 0.62 * np.exp(-(tt - last) / 0.1)

    for k, kt in enumerate(kicks):
        if kt >= 5.0 and k % 2 == 1:
            add(drums, clap(), kt, 0.55, pan=0.05)
        add(drums, hat(), kt + 0.25, 0.32, pan=0.25)
        if 18.0 <= kt < 22.4 or 23.0 <= kt < 25.8:
            add(drums, hat(0.012), kt + 0.125, 0.16, pan=-0.3)
            add(drums, hat(0.012), kt + 0.375, 0.16, pan=-0.3)
        if 23.0 <= kt < 25.8 and k % 4 == 3:
            add(drums, hat(0.12, 0.3), kt + 0.25, 0.22, pan=0.3)
        root, _ = chord_at(kt + 0.25)
        add(bass, bass_note(midi(root)), kt + 0.25, 0.55)

    for c in (3.0, 13.0, 18.15, 23.0):
        add(fx, crash(), c, 0.5)
    add(fx, crash(2.6), 26.85, 0.6)
    add(fx, crash(2.0), 29.0, 0.45)
    add(fx, riser(1.4), 1.6, 0.42)
    r2 = riser(1.82)
    add(fx, r2, 24.9, 0.5)

    # pads: intro, groove, end card
    intro = pad_chord([45, 57, 60, 64], 3.25, 900, attack=1.4, release=0.4)
    add(pad, intro, 0.0, 0.9)
    for b0 in np.arange(G0, 25.9, 2.0):
        _, notes = chord_at(b0 + 0.01)
        cut = 1800 if b0 < 8 else (2600 if b0 < 22.5 else 3200)
        dur = min(2.15, 26.6 - b0)
        add(pad, pad_chord(notes, dur, cut), b0, 0.8)
    endF = pad_chord([41, 53, 57, 60, 65], 2.2, 3400, attack=0.02, release=0.3)
    endC = pad_chord([36, 55, 60, 64, 67, 72], 1.3, 3800, attack=0.02, release=0.5)
    add(pad, endF, 26.85, 1.0)
    add(pad, endC, 28.75, 1.0)
    add(bass, bass_note(midi(41), dur=2.0, decay=1.2), 26.85, 0.6)
    add(bass, bass_note(midi(36), dur=1.25, decay=0.9), 28.75, 0.6)

    # 16th-note pluck arpeggio with ping-pong echo
    pattern = [0, 1, 2, 1, 2, 0, 1, 2]
    t = 8.5
    while t < 25.8:
        if not (22.4 <= t < 23.0):
            _, notes = chord_at(t)
            step = int(round((t - 8.5) / 0.125))
            m = notes[pattern[step % 8]] + 12 + (12 if step % 16 == 13 else 0)
            p = pluck(midi(m))
            add(arp, p, t, 0.3, pan=-0.15)
            add(arp, p, t + 0.375, 0.12, pan=-0.75)
            add(arp, p, t + 0.75, 0.06, pan=0.75)
        t += 0.125

    groove_mask = (tt >= 3.0) & (tt < 26.7)
    pad[groove_mask] *= pump[groove_mask, None]
    bass[groove_mask] *= (0.4 + 0.6 * pump[groove_mask])[:, None]

    # "suck" into black: everything but the riser fades out 25.9 -> 26.7, silence until the 26.85 impact
    fade = np.ones(N)
    a, b = int(25.9 * SR), int(26.7 * SR)
    fade[a:b] = np.linspace(1, 0, b - a) ** 2
    fade[b:int(26.85 * SR)] = 0
    for tr in (drums, bass, pad, arp):
        tr *= fade[:, None]
    fx[int(26.72 * SR):int(26.85 * SR)] = 0

    wet = reverb(pad * 0.55 + arp, decay=1.8, wet=0.32)
    music = drums * 0.95 + bass * 0.75 + wet * 0.7 + fx
    music = filt(music, "high", 30)
    # gentle fade-in at the very start and fade-out on the last half second
    music[: int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))[:, None]
    tail = int(0.55 * SR)
    music[-tail:] *= np.linspace(1, 0, tail)[:, None] ** 1.5
    return music


def build_sfx():
    s = buf()
    # S1 cold open: words land, AUTOPILOT impact, fly-through
    add(s, thump(), 0.25, 0.5)
    add(s, tick(2600), 0.25, 0.15)
    add(s, thump(), 0.59, 0.55)
    add(s, impact(), 0.93, 0.85)
    add(s, shimmer(1.3), 0.96, 0.35, pan=0.2)
    add(s, whoosh(0.45, 1500, 6000, 0.4), 1.45, 0.12)
    add(s, whoosh(0.95, 250, 6500, 0.85, 0.22), 2.42, 0.9)
    add(s, shimmer(1.0, lo=3500, hi=10000), 2.78, 0.3, pan=-0.2)
    # S2 hero phones
    add(s, whoosh(1.2, 180, 1600, 0.3, 0.25), 2.95, 0.35)
    add(s, tick(2200), 3.4, 0.1)
    for k, (t, f, p) in enumerate([(4.2, 520, -0.5), (4.5, 620, 0.5), (4.8, 740, -0.5), (5.1, 880, 0.5)]):
        add(s, pop(f), t, 0.42, pan=p)
    add(s, shimmer(1.1, lo=4000, hi=11000), 5.55, 0.32, pan=0.3)
    add(s, whoosh(0.85, 400, 7500, 0.9, 0.2), 7.72, 0.85)
    # S3 automations: a ding per row, chip pop, whip pan out
    for t, f, p in [(8.55, 880, -0.3), (9.25, 1046.5, 0.3), (9.95, 1318.5, -0.3), (10.65, 1174.7, 0.3), (11.35, 1046.5, -0.3), (12.05, 1318.5, 0.3)]:
        add(s, bell(f, decay=0.32, index=1.6), t, 0.2, pan=p)
        add(s, pop(f / 2), t, 0.18, pan=p)
    add(s, pop(700), 9.6, 0.35, pan=0.4)
    w = whoosh(0.75, 700, 6000, 0.72, 0.2)
    add(s, stereo(w, np.linspace(0.8, -0.8, len(w))), 12.62, 1.0)
    # S4 chat agent
    add(s, pop(600), 13.7, 0.4, pan=-0.35)
    for t in (14.45, 16.5):
        add(s, whoosh(0.22, 1500, 7000, 0.5), t - 0.08, 0.2, pan=0.35)
        add(s, pop(900), t, 0.4, pan=0.35)
    add(s, pop(760), 14.7, 0.3, pan=-0.5)
    for t in (15.0, 16.85):
        add(s, tick(1800), t, 0.08, pan=-0.35)
    add(s, pop(620), 15.75, 0.4, pan=-0.35)
    add(s, pop(640), 17.35, 0.4, pan=-0.35)
    add(s, bell(1318.5, decay=0.35), 17.55, 0.2, pan=0.2)
    add(s, bell(1568.0, decay=0.45), 17.63, 0.18, pan=0.2)
    add(s, whoosh(0.65, 3500, 300, 0.4, 0.2), 17.92, 0.6)
    # S5 results: tiles fly in, land, numbers tick up
    for i in range(4):
        s0 = 18.15 + i * 0.3
        p = -0.45 if i % 2 == 0 else 0.45
        add(s, whoosh(0.55, 500, 4500, 0.75, 0.2), s0 - 0.05, 0.42, pan=p)
        add(s, thump(220, 110, 0.18, 0.05), s0 + 0.45, 0.35, pan=p)
        a, b = s0 + 0.35, s0 + 1.7
        for k in range(1, 12):
            x = -np.log2(1 - k / 12) / 10
            add(s, tick(2700 + i * 220), a + x * (b - a), 0.1, pan=p * 0.6)
    w = whoosh(0.65, 300, 6500, 0.75, 0.2)
    add(s, w, 22.42, 0.9)
    # S6 tool floor
    add(s, tick(2200), 23.0, 0.1)
    for t, f, p in [(23.5, 500, -0.4), (23.66, 600, 0.4), (23.82, 700, -0.4), (23.98, 840, 0.4)]:
        add(s, pop(f), t, 0.38, pan=p)
    add(s, whoosh(0.82, 200, 8500, 0.95, 0.22), 25.93, 0.9)
    # S7 end card
    add(s, impact(1.8), 26.85, 1.0)
    add(s, impact(1.2), 27.05, 0.6)
    add(s, shimmer(1.5), 27.06, 0.38, pan=-0.2)
    add(s, thump(), 27.25, 0.4)
    add(s, thump(), 27.45, 0.45)
    add(s, whoosh(0.5, 800, 5000, 0.6), 27.7, 0.25)
    for k in range(1, 16):
        add(s, keyclick(), 28.0 + k * 0.65 / 15, 0.33, pan=rng.uniform(-0.2, 0.2))
    add(s, keyclick(), 28.81, 0.55)
    add(s, thump(300, 140, 0.12, 0.03), 28.81, 0.3)
    add(s, keyclick(), 28.95, 0.35)
    add(s, chime(), 29.0, 0.55)
    add(s, shimmer(1.0, lo=3000, hi=9000), 29.05, 0.3, pan=0.25)
    s = reverb(s, decay=1.2, wet=0.2)
    s[-int(0.3 * SR):] *= np.linspace(1, 0.2, int(0.3 * SR))[:, None]
    return s


# ---------------------------------------------------------------- mix + loudness + mux
def voice_activity(v):
    mono = np.abs(v).mean(axis=1)
    win = int(0.05 * SR)
    rms = np.sqrt(np.convolve(mono ** 2, np.ones(win) / win, mode="same"))
    held = maximum_filter1d(rms, int(0.25 * SR))
    held = filt(held, "low", 6, order=1)
    db = 20 * np.log10(held + 1e-9)
    return np.clip((db + 42) / 14, 0, 1)


def rms(x, mask=None):
    y = x if mask is None else x[mask]
    return float(np.sqrt(np.mean(y ** 2)) + 1e-12)


def run(args):
    return subprocess.run(args, capture_output=True, text=True, check=True)


def loudnorm(src, dst):
    a = run([FFMPEG, "-hide_banner", "-i", str(src), "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"])
    m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", a.stderr, re.S).group(0))
    ln = (f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
          f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true:print_format=json")
    b = run([FFMPEG, "-hide_banner", "-y", "-i", str(src), "-af", ln, "-ar", str(SR), "-ac", "2", "-t", str(DUR), str(dst)])
    o = json.loads(re.search(r"\{[^{}]*\"output_i\"[^{}]*\}", b.stderr, re.S).group(0))
    return o["output_i"], o["output_tp"]


def mux(audio, out_mp4):
    run([FFMPEG, "-hide_banner", "-y", "-i", str(SRC_VIDEO), "-i", str(audio), "-map", "0:v:0", "-map", "1:a:0",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", str(SR), "-ac", "2", "-t", str(DUR),
         "-movflags", "+faststart", str(out_mp4)])


def main():
    music = build_music()
    sfx = build_sfx()
    voice, vsr = sf.read(VOICE, always_2d=True)
    assert vsr == SR, f"voice sample rate {vsr} != {SR}"
    voice = np.pad(voice, ((0, max(0, N - len(voice))), (0, 0)))[:N]

    act = voice_activity(voice)
    talking = act > 0.5
    # balance: music bed sits 6 dB under the voice before ducking (about 11-12 dB under while she speaks)
    v_rms = rms(voice, talking)
    music *= v_rms / rms(music, (np.arange(N) / SR >= 3.0) & (np.arange(N) / SR < 25.9)) * 10 ** (-6 / 20)
    sfx = peak_norm(sfx, np.max(np.abs(voice)) * 0.9)

    duck_m = 10 ** (-5.5 * act / 20)
    duck_s = 10 ** (-3 * act / 20)
    mix_v = voice + music * duck_m[:, None] + sfx * duck_s[:, None]
    mix_nv = music + sfx

    sf.write(OUT / "music.wav", peak_norm(music, 0.9), SR, subtype="FLOAT")
    sf.write(OUT / "sfx.wav", peak_norm(sfx, 0.9), SR, subtype="FLOAT")
    raw_v, raw_nv = OUT / "_mix-voice-raw.wav", OUT / "_mix-novoice-raw.wav"
    sf.write(raw_v, mix_v / max(1.0, np.max(np.abs(mix_v))), SR, subtype="FLOAT")
    sf.write(raw_nv, mix_nv / max(1.0, np.max(np.abs(mix_nv))), SR, subtype="FLOAT")

    lv = loudnorm(raw_v, OUT / "mix-voice.wav")
    lnv = loudnorm(raw_nv, OUT / "mix-novoice.wav")
    raw_v.unlink()
    raw_nv.unlink()

    mux(OUT / "mix-voice.wav", VID / "out" / "ashetag-ad-vertical-final.mp4")
    mux(OUT / "mix-novoice.wav", VID / "out" / "ashetag-ad-vertical-music-sfx.mp4")

    # report: how far music sits under the voice while she is talking
    under = 20 * np.log10(rms(voice, talking) / rms(music * duck_m[:, None], talking))
    print(f"final (voice+music+sfx): {lv[0]} LUFS, true peak {lv[1]} dBTP")
    print(f"music+sfx only:          {lnv[0]} LUFS, true peak {lnv[1]} dBTP")
    print(f"voice is {under:.1f} dB above the music while speaking; speech active {talking.mean() * 100:.0f}% of the ad")


if __name__ == "__main__":
    main()
