/* Checks every link in the built site (dist/). Run after `npm run build`:
     npm run check:links              internal links, files and #anchors
     npm run check:links -- --external   also asks every outside site whether its link still works */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
if (!existsSync(dist)) { console.error("No dist/ folder. Run `npm run build` first."); process.exit(1); }
const external = process.argv.includes("--external");
// Builds for a GitHub Pages project site prefix root links with /<repo>/ (see astro.config.mjs).
const base = (process.env.BASE_PATH || "").replace(/\/+$/, "");

const pages = readdirSync(dist).filter((f) => f.endsWith(".html"));
const html = Object.fromEntries(pages.map((p) => [p, readFileSync(join(dist, p), "utf8")]));
const ids = Object.fromEntries(pages.map((p) => [p, new Set([...html[p].matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));

const problems = [];
const notes = [];
const outside = new Map(); // url -> pages using it
const attr = /<(a|link|script|img|source|form)\b[^>]*?\s(href|src|action)="([^"]*)"/g;

for (const page of pages) {
  for (const [, tag, , raw] of html[page].matchAll(attr)) {
    const url = raw.replace(/&amp;/g, "&");
    if (!url) { problems.push(`${page}: empty ${tag} link`); continue; }
    if (/^(mailto:|tel:|data:|javascript:)/.test(url)) continue;
    if (/^https?:\/\//.test(url)) { if (!outside.has(url)) outside.set(url, new Set()); outside.get(url).add(page); continue; }
    const [pathAndQuery, hash] = url.split("#");
    let path = pathAndQuery.split("?")[0];
    if (base && path.startsWith(`${base}/`)) path = path.slice(base.length);
    path = path.replace(/^\.?\//, "");
    const target = path === "" ? page : path;
    if (!existsSync(join(dist, target))) { problems.push(`${page}: ${tag} → ${url} (no such file)`); continue; }
    if (hash && target.endsWith(".html") && !ids[target]?.has(hash)) problems.push(`${page}: ${url} (no element with id "${hash}")`);
  }
}

if (external) {
  const check = async (url) => {
    for (const method of ["HEAD", "GET"]) {
      try {
        const r = await fetch(url, { method, redirect: "follow", signal: AbortSignal.timeout(12000), headers: { "User-Agent": "Mozilla/5.0 link-check" } });
        if (r.ok) return null;
        if (method === "GET") return r.status;
      } catch (e) {
        if (method === "GET") return e.name === "TimeoutError" ? "timeout" : e.message;
      }
    }
  };
  const results = await Promise.all([...outside.keys()].map(async (u) => [u, await check(u)]));
  for (const [u, status] of results) {
    if (status === null) continue;
    // LinkedIn answers bots with 999 even when the page exists: worth a look, not a failure
    if (status === 999) { notes.push(`${u} can't be checked automatically (LinkedIn blocks bots); open it by hand once`); continue; }
    problems.push(`external ${u} → ${status}  [on ${[...outside.get(u)].join(", ")}]`);
  }
}

console.log(`Checked ${pages.length} pages${external ? ` and ${outside.size} outside links` : ` (${outside.size} outside links skipped; add --external)`}.`);
if (notes.length) console.log(`\nNote:\n  ${notes.join("\n  ")}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log("No broken links.");
