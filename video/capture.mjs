// Captures full-page mobile screenshots of the site for use inside the video's phone mockups.
// Usage: node capture.mjs   (the local site must be served at BASE)
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const BASE = process.env.BASE || "http://localhost:8765";
const OUT = fileURLToPath(new URL("./shots/", import.meta.url));
mkdirSync(OUT, { recursive: true });

const pages = [
  { name: "home", path: "/index.html" },
  { name: "product", path: "/product.html" },
  { name: "blog", path: "/blog.html" },
  { name: "about", path: "/about.html" },
];

const browser = await chromium.launch({ channel: "msedge" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, reducedMotion: "no-preference" });
const page = await ctx.newPage();

for (const p of pages) {
  await page.goto(BASE + p.path, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.documentElement.style.scrollBehavior = "auto";
    // Show everything that normally animates in on scroll, in its finished state.
    document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-in"));
    document.querySelectorAll(".doodle.draw").forEach((d) => d.classList.add("is-in"));
    document.querySelectorAll("[data-count]").forEach((el) => {
      const v = el.dataset.count; el.textContent = (el.dataset.prefix || "") + v + (el.dataset.suffix || "");
    });
    document.querySelectorAll(".orbs, .toast, .progress").forEach((e) => (e.style.display = "none"));
    const s = document.createElement("style");
    s.textContent = "*,*::before,*::after{transition:none!important} .hero-in>*{animation:none!important} .hero__lines path{animation:none!important;stroke-dashoffset:0!important}";
    document.head.appendChild(s);
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(OUT, `${p.name}.png`), fullPage: true });
  console.log("captured", p.name);
}
await browser.close();
