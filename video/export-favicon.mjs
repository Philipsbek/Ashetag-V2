// Renders assets/favicon.svg to crisp transparent PNGs with Edge (exact SVG rendering).
// Usage: node export-favicon.mjs
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const svg = readFileSync(join(ROOT, "assets", "favicon.svg"), "utf8");
const browser = await chromium.launch({ channel: "msedge" });

const clean = svg.replace(/\s*stroke="[^"]*"\s*stroke-width="[^"]*"/, "").replace('r="15.5"', 'r="16"');
const jobs = [[1024, svg, ""], [512, svg, ""], [1024, clean, "-no-outline"]];
for (const [size, src, suffix] of jobs) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0;background:transparent">
    <img src="data:image/svg+xml;base64,${Buffer.from(src).toString("base64")}" width="${size}" height="${size}" style="display:block"></body></html>`);
  await page.waitForTimeout(200);
  const out = join(ROOT, "assets", `favicon-${size}${suffix}.png`);
  await page.screenshot({ path: out, omitBackground: true });
  console.log("saved", out);
  await page.close();
}
await browser.close();
