// @ts-check
import { defineConfig } from "astro/config";
import { readFileSync, rmSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const root = new URL("./", import.meta.url);
const readSite = () => YAML.parse(readFileSync(new URL("content/site.yaml", root), "utf8"));

/* Third-party scripts are served from this site (no CDN requests, so no visitor
   data leaves for another company and no consent banner is needed). */
const VENDOR = {
  "vendor/three/three.module.min.js": "node_modules/three/build/three.module.min.js",
  "vendor/three/addons/environments/RoomEnvironment.js": "node_modules/three/examples/jsm/environments/RoomEnvironment.js",
  "vendor/three/addons/geometries/RoundedBoxGeometry.js": "node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js",
  "vendor/three/addons/utils/BufferGeometryUtils.js": "node_modules/three/examples/jsm/utils/BufferGeometryUtils.js",
  "vendor/lenis.min.js": "node_modules/lenis/dist/lenis.min.js",
};

function site() {
  return {
    name: "site-files",
    hooks: {
      "astro:config:setup": () => {
        for (const [to, from] of Object.entries(VENDOR)) {
          const dest = fileURLToPath(new URL(`public/${to}`, root));
          mkdirSync(dirname(dest), { recursive: true });
          copyFileSync(fileURLToPath(new URL(from, root)), dest);
        }
      },
      "astro:build:done": ({ dir, logger }) => {
        const s = readSite();
        const out = (name, text) => writeFileSync(fileURLToPath(new URL(name, dir)), text);

        // Pages switched off in content/site.yaml are not shipped.
        for (const p of s.pages) {
          if (p.enabled !== false || p.key === "home") continue;
          rmSync(fileURLToPath(new URL(p.href, dir)), { force: true });
          logger.info(`skipped ${p.href} (disabled in content/site.yaml)`);
        }

        const pages = s.pages.filter((p) => p.enabled !== false);
        if (s.url) {
          const today = new Date().toISOString().slice(0, 10);
          const urls = pages.map((p) => `  <url><loc>${s.url}/${p.href === "index.html" ? "" : p.href}</loc><lastmod>${today}</lastmod></url>`);
          out("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
        } else {
          logger.warn("content/site.yaml has no url yet: sitemap.xml and canonical links are skipped");
        }
        out("robots.txt", `User-agent: *\nAllow: /\n${s.url ? `\nSitemap: ${s.url}/sitemap.xml\n` : ""}`);
        out("site.webmanifest", JSON.stringify({
          name: s.person.name, short_name: s.person.name.split(" ")[0],
          start_url: "./", display: "browser", background_color: "#000000", theme_color: "#000000",
          icons: [
            { src: "apple-touch-icon.png", sizes: "180x180", type: "image/png" },
            { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          ],
        }, null, 2));
      },
    },
  };
}

export default defineConfig({
  // GitHub Pages serves a project repo under /<repo>/; the deploy workflow passes that prefix.
  // A custom domain (or local builds) leaves it at the root.
  base: process.env.BASE_PATH || "/",
  // Keep the existing addresses: work.html, publishings.html, …
  build: { format: "file", inlineStylesheets: "auto" },
  integrations: [site()],
});
