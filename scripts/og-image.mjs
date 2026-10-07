/* Renders public/og.png (the 1200×630 link-preview image) from content/site.yaml and
   content/home.yaml, using the site's own fonts. Run: npm run og
   Needs Google Chrome or Microsoft Edge installed. */
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL, fileURLToPath } from "node:url";
import YAML from "yaml";

const root = fileURLToPath(new URL("../", import.meta.url));
const site = YAML.parse(readFileSync(join(root, "content/site.yaml"), "utf8"));
const home = YAML.parse(readFileSync(join(root, "content/home.yaml"), "utf8"));

const font = (pkg, file) => pathToFileURL(join(root, "node_modules/@fontsource", pkg, "files", file)).href;
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const md = (s) => esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>");
const name = (home.intro?.name ?? [site.person.name]).map(md).join("<br>");
const mark = readFileSync(join(root, "public/favicon.svg"), "utf8");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: C; src: url(${font("cormorant-garamond", "cormorant-garamond-latin-400-normal.woff2")}); }
@font-face { font-family: C; font-style: italic; src: url(${font("cormorant-garamond", "cormorant-garamond-latin-400-italic.woff2")}); }
@font-face { font-family: M; src: url(${font("jetbrains-mono", "jetbrains-mono-latin-400-normal.woff2")}); }
html, body { margin: 0; width: 1200px; height: 630px; background: #000; overflow: hidden; }
body { position: relative; color: #e8e2d1; font-family: C, serif;
  background: radial-gradient(ellipse 60% 70% at 78% 45%, rgba(201,169,110,0.18), transparent 70%), #000; }
.mark { position: absolute; left: 72px; top: 64px; width: 64px; height: 64px; }
.mark svg { width: 100%; height: 100%; }
h1 { position: absolute; left: 72px; bottom: 150px; margin: 0; font-weight: 400; font-size: 148px; line-height: 0.86; letter-spacing: -0.02em; }
em { color: #c9a96e; }
.role { position: absolute; left: 76px; bottom: 92px; font-family: M, monospace; font-size: 20px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a96e; }
.band { position: absolute; left: 0; right: 0; bottom: 0; height: 14px; opacity: 0.8;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='14' viewBox='0 0 48 14'><path d='M0 13h10V5h8v4h-4v4h14V1h-8v4h4V1H0z' fill='none' stroke='%23c9a96e' stroke-width='0.7'/></svg>") repeat-x; background-size: 48px 14px; }
</style></head><body>
<div class="mark">${mark}</div>
<h1>${name}</h1>
<div class="role">${esc(site.person.role)}</div>
<div class="band"></div>
</body></html>`;

const browsers = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
];
const browser = browsers.find(existsSync);
if (!browser) throw new Error("No Chrome or Edge found; install one, or add its path to scripts/og-image.mjs");

const dir = mkdtempSync(join(tmpdir(), "og-"));
const page = join(dir, "og.html");
writeFileSync(page, html);
const out = join(root, "public/og.png");
execFileSync(browser, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
  "--allow-file-access-from-files", "--virtual-time-budget=3000",
  `--window-size=1200,630`, `--screenshot=${out}`, pathToFileURL(page).href,
], { stdio: "ignore" });
rmSync(dir, { recursive: true, force: true });
console.log("wrote public/og.png");
