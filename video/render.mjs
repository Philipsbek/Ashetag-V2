// Renders stage.html frame by frame into an MP4 (1080x1920), or exports review stills.
//   node render.mjs                       -> out/ashetag-ad-vertical.mp4 (60 fps)
//   node render.mjs --fps 30              -> faster draft render
//   node render.mjs --stills 1.5,5,9.8    -> PNG stills in out/stills/
// The local site must be served at BASE (python -m http.server 8765 from the project root).
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const BASE = process.env.BASE || "http://localhost:8765";
const HERE = fileURLToPath(new URL(".", import.meta.url));
const OUT = join(HERE, "out");
mkdirSync(join(OUT, "stills"), { recursive: true });

const arg = (name, def) => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : def; };
const FPS = +arg("--fps", 60);
const stills = arg("--stills", null);
const outFile = join(OUT, arg("--out", "ashetag-ad-vertical.mp4"));

const FFMPEG = process.env.FFMPEG || (() => {
  const guess = join(process.env.LOCALAPPDATA || "", "Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.1-full_build/bin/ffmpeg.exe");
  return existsSync(guess) ? guess : "ffmpeg";
})();

const browser = await chromium.launch({ channel: "msedge" });
const ctx = await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(`${BASE}/video/stage.html?render=1`, { waitUntil: "networkidle" });
await page.evaluate(() => window.stageReady);
const DUR = await page.evaluate(() => window.DURATION);

const frameAt = async (t) => {
  await page.evaluate((tt) => window.seek(tt), t);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
};

if (stills) {
  for (const s of stills.split(",").map(Number)) {
    await frameAt(s);
    const p = join(OUT, "stills", `t${s.toFixed(2).padStart(5, "0")}.png`);
    await page.screenshot({ path: p });
    console.log("still", p);
  }
  await browser.close();
  process.exit(0);
}

const total = Math.round(DUR * FPS);
const ff = spawn(FFMPEG, [
  "-y", "-hide_banner", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
  "-vf", "scale=in_range=pc:out_range=tv,format=yuv420p", "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
  "-c:v", "libx264", "-preset", "slow", "-crf", "16",
  "-movflags", "+faststart", "-r", String(FPS), outFile,
], { stdio: ["pipe", "inherit", "inherit"] });

const started = Date.now();
for (let i = 0; i < total; i++) {
  await frameAt(i / FPS);
  const buf = await page.screenshot({ type: "jpeg", quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (i % FPS === 0) console.log(`frame ${i}/${total}  (${((Date.now() - started) / 1000).toFixed(0)}s)`);
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();
console.log("done", outFile, `${((Date.now() - started) / 1000).toFixed(0)}s`);
