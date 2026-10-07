/* Loads and validates everything in content/. A mistake in a content file stops
   the build with the file, the field and what was expected. */
import { z } from "astro/zod";
import YAML from "yaml";
import { parseBib, bibAuthors, texToText, toBibtex, BibError } from "./bibtex";
import { VISUALS } from "../components/curio/visuals";

// Imported as raw text so the dev server reloads when a content file changes.
const FILES = import.meta.glob("/content/*.{yaml,bib}", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export class ContentError extends Error {}

function read(name: string): string {
  const text = FILES[`/content/${name}`];
  if (text === undefined) throw new ContentError(`content/${name} is missing`);
  return text;
}

function load<T extends z.ZodType>(name: string, schema: T): z.infer<T> {
  let data: unknown;
  try {
    data = YAML.parse(read(name));
  } catch (e) {
    throw new ContentError(`content/${name}: ${(e as Error).message}`);
  }
  const res = schema.safeParse(data);
  if (!res.success) {
    const lines = res.error.issues.map((iss) => `  • ${iss.path.join(".") || "(top)"}: ${iss.message}`);
    throw new ContentError(`content/${name} has problems:\n${lines.join("\n")}`);
  }
  return res.data;
}

/* ── Schemas ─────────────────────────────────────────────────────────────── */

export const STAGE_PRESETS = ["home", "about", "work", "publishings", "projects", "curiosities", "contact"] as const;

const text = z.string().min(1);
const lines = z.array(text).min(1);
const link = z.strictObject({ label: text, href: text });
const stage = z.strictObject({ preset: z.enum(STAGE_PRESETS), seed: z.number().int() });
const section = <T extends z.ZodRawShape>(shape: T) => z.strictObject({ show: z.boolean().default(true), ...shape });

const pageMeta = { title: text, description: text };
const hero = z.strictObject({ eyebrow: text, title: lines, sub: text, caption: text, stage });

const siteSchema = z.strictObject({
  url: z.url().refine((u) => !u.endsWith("/"), "no trailing slash").nullable().default(null),
  web3formsKey: z.string().regex(/^[0-9a-f-]{36}$/i, "looks like a Web3Forms key: 8-4-4-4-12 hex digits").nullable().default(null),
  mobileCta: link,
  person: z.strictObject({
    name: text, role: text, email: z.email(),
    cv: text.optional(), cvDownloadName: text.optional(),
  }),
  links: z.array(z.strictObject({ label: text, handle: text, url: z.url().nullable() })),
  pages: z.array(z.strictObject({
    key: z.enum(["home", "about", "work", "publications", "projects", "curiosities", "contact"]),
    label: text, href: text, enabled: z.boolean().default(true), blurb: text.optional(),
  })),
  footer: z.strictObject({ cta: text, read: z.array(text), wander: z.array(text), base: text }),
});

const homeSchema = z.strictObject({
  ...pageMeta,
  intro: section({ statement: text, name: lines, cta: link, tagline: text, caption: text, stage }),
  now: section({
    label: text, lede: text, small: text.optional(),
    figures: z.array(z.strictObject({ k: text, v: text })).default([]),
  }),
  recent: section({
    title: text, more: link.optional(),
    cards: z.array(z.strictObject({
      link: z.string().regex(/^[\w-]+\.html#[\w-]+$/, "must look like page.html#id"),
      chip: text, title: text, sub: text, date: text,
      still: stage,
    })),
  }),
  finale: section({ statement: lines, eyebrow: text, title: lines, cta: link }),
});

const aboutSchema = z.strictObject({
  ...pageMeta, hero,
  portrait: text.nullable().default(null), portraitAlt: text.optional(),
  facts: z.array(z.strictObject({ k: text, v: text })),
  bio: z.strictObject({ lede: text, paragraphs: z.array(text).default([]) }),
  elsewhere: section({ title: text, pages: z.array(text) }),
});

const systemSchema = z.strictObject({
  notFound: z.strictObject({ ...pageMeta, eyebrow: text, heading: lines, sub: text }),
  thanks: z.strictObject({ ...pageMeta, eyebrow: text, heading: lines, sub: text, back: link }),
});

const listingItem = z.strictObject({
  id: z.string().regex(/^[\w-]+$/, "letters, digits, - and _ only"),
  title: text, org: text, date: text, rowDate: text.optional(),
  tags: z.array(text).default([]),
  summary: text,
  bullets: z.array(text).optional(),
  embed: text.optional(),
  close: text.optional(),
  hidden: z.boolean().default(false),
});
const listingSchema = z.strictObject({ ...pageMeta, hero, items: z.array(listingItem) });

const publicationsSchema = z.strictObject({ ...pageMeta, hero });

const contactSchema = z.strictObject({
  ...pageMeta, hero,
  lines: z.array(z.strictObject({ k: text, v: text })).default([]),
  quote: section({ text, aside: text.optional() }),
  form: section({ button: text, sendButton: text, hint: text, privacy: text }),
});

const cardBase = {
  size: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(12)]).default(6),
  tone: z.enum(["light", "dark", "blue"]).default("light"),
  tag: text.optional(), ref: text.optional(),
  hidden: z.boolean().default(false),
};
const visual = z.string().refine((v) => v in VISUALS, { message: `unknown visual; use one of: ${Object.keys(VISUALS).join(", ")}` });
const curioItem = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("note"), ...cardBase, title: text, body: text, visual }),
  z.strictObject({ kind: z.literal("image"), ...cardBase, title: text, body: text.optional(), src: text, alt: text }),
  z.strictObject({ kind: z.literal("link"), ...cardBase, title: text, body: text, url: z.url(), visual: visual.optional() }),
  z.strictObject({ kind: z.literal("quote"), text, by: text.optional(), hidden: z.boolean().default(false) }),
]);
const curiositiesSchema = z.strictObject({ ...pageMeta, hero, items: z.array(curioItem) });

/* ── Loaded content ──────────────────────────────────────────────────────── */

const GREEK = "ΑΒΓΔΕΖΗΘΙΚΛΜ";

export const site = load("site.yaml", siteSchema);
export const pages = site.pages
  .filter((p) => p.enabled)
  .map((p, i) => ({ ...p, greek: GREEK[i] }));
export type PageKey = (typeof site.pages)[number]["key"];
export const page = (key: string) => pages.find((p) => p.key === key);

export const home = load("home.yaml", homeSchema);
export const system = load("system.yaml", systemSchema);
export const about = load("about.yaml", aboutSchema);
export const contact = load("contact.yaml", contactSchema);
export const curiosities = (() => {
  const c = load("curiosities.yaml", curiositiesSchema);
  return { ...c, items: c.items.filter((it) => !it.hidden) };
})();

function listing(name: string) {
  const l = load(name, listingSchema);
  const seen = new Set<string>();
  for (const it of l.items) {
    if (seen.has(it.id)) throw new ContentError(`content/${name}: id "${it.id}" is used twice`);
    seen.add(it.id);
  }
  return { ...l, items: l.items.filter((it) => !it.hidden) };
}
export const work = listing("work.yaml");
export const projects = listing("projects.yaml");

/* Publications: page text from YAML, entries from BibTeX */
const SITE_FIELDS = new Set(["venue", "summary", "keywords", "date", "hidden", "abstract"]);
export interface Publication {
  id: string; title: string; org: string; date: string; tags: string[];
  authors?: string[]; summary?: string; abstract?: string;
  arxiv?: string; doi?: string; url?: string; bibtex?: string;
}
export const publications = (() => {
  const meta = load("publications.yaml", publicationsSchema);
  let entries;
  try {
    entries = parseBib(read("publications.bib"), "content/publications.bib");
  } catch (e) {
    if (e instanceof BibError) throw new ContentError(e.message);
    throw e;
  }
  const seen = new Set<string>();
  const items: Publication[] = [];
  for (const e of entries) {
    const where = `content/publications.bib:${e.line} (${e.key})`;
    if (seen.has(e.key)) throw new ContentError(`${where}: key used twice`);
    seen.add(e.key);
    if (!/^[\w-]+$/.test(e.key)) throw new ContentError(`${where}: keys may only use letters, digits, - and _ (it becomes the page link)`);
    const f = (n: string) => (e.raw[n] !== undefined ? texToText(e.raw[n]) : undefined);
    if (f("hidden") === "true") continue;
    if (!f("title")) throw new ContentError(`${where}: needs a title`);
    const arxiv = e.raw.eprint && (/arxiv/i.test(e.raw.archiveprefix || "") || /^\d{4}\.\d{4,5}/.test(e.raw.eprint)) ? f("eprint") : undefined;
    const citable = !!(e.raw.author && e.raw.year);
    items.push({
      id: e.key,
      title: f("title")!,
      org: f("venue") || f("journal") || f("booktitle") || (arxiv ? "arXiv preprint" : ""),
      date: f("date") || f("year") || "",
      tags: (f("keywords") || "").split(",").map((t) => t.trim()).filter(Boolean),
      authors: e.raw.author ? bibAuthors(e.raw.author) : undefined,
      summary: f("summary"),
      abstract: f("abstract"),
      arxiv,
      doi: f("doi"),
      url: f("url"),
      bibtex: citable ? toBibtex(e, SITE_FIELDS) : undefined,
    });
  }
  return { ...meta, items };
})();

/* ── Cross-checks ────────────────────────────────────────────────────────── */

const LISTINGS: Record<string, { key: PageKey; ids: Set<string> }> = {
  "work.html": { key: "work", ids: new Set(work.items.map((i) => i.id)) },
  "projects.html": { key: "projects", ids: new Set(projects.items.map((i) => i.id)) },
  "publishings.html": { key: "publications", ids: new Set(publications.items.map((i) => i.id)) },
};
const enabledHrefs = new Set(pages.map((p) => p.href));
const allHrefs = new Set(site.pages.map((p) => p.href));

// Featured cards on home must point at something that is actually shown.
if (home.recent.show) {
  for (const card of home.recent.cards) {
    const [href, id] = card.link.split("#");
    const target = LISTINGS[href];
    if (!target) throw new ContentError(`content/home.yaml: recent card "${card.title}" links to ${href}, which has no items`);
    if (!enabledHrefs.has(href)) throw new ContentError(`content/home.yaml: recent card "${card.title}" links to ${href}, which is disabled in site.yaml`);
    if (!target.ids.has(id)) throw new ContentError(`content/home.yaml: recent card "${card.title}" links to #${id}, which doesn't exist (or is hidden) on ${href}`);
  }
}

// Any link to a disabled page, anywhere in the page files, is an error.
function walk(v: unknown, file: string, path: string) {
  if (typeof v === "string") {
    for (const m of v.matchAll(/([\w-]+\.html)/g)) {
      if (allHrefs.has(m[1]) && !enabledHrefs.has(m[1])) {
        throw new ContentError(`${file} → ${path} links to ${m[1]}, which is disabled in site.yaml`);
      }
    }
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, file, `${path}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, file, path ? `${path}.${k}` : k);
}
walk(home, "content/home.yaml", "");
walk(about, "content/about.yaml", "");
walk(contact, "content/contact.yaml", "");
walk(curiosities, "content/curiosities.yaml", "");
walk(system, "content/system.yaml", "");

// Search engines want every page to have its own title and description, of a readable length.
{
  const metas: [string, { title: string; description: string }][] = [
    ["home.yaml", home], ["about.yaml", about], ["work.yaml", work], ["projects.yaml", projects],
    ["publications.yaml", publications], ["curiosities.yaml", curiosities], ["contact.yaml", contact],
    ["system.yaml notFound", system.notFound], ["system.yaml thanks", system.thanks],
  ];
  for (const field of ["title", "description"] as const) {
    const seen = new Map<string, string>();
    for (const [file, m] of metas) {
      const other = seen.get(m[field]);
      if (other) throw new ContentError(`content/${file}: same ${field} as content/${other} — each page needs its own`);
      seen.set(m[field], file);
    }
  }
  for (const [file, m] of metas) {
    if (m.title.length > 65) console.warn(`[content] content/${file}: title is ${m.title.length} characters; search results cut off around 60`);
    if (m.description.length < 50 || m.description.length > 160) console.warn(`[content] content/${file}: description is ${m.description.length} characters; aim for 50–160`);
  }
}

/** Absolute address of a page, or null while site.url isn't set. */
export function absolute(href: string): string | null {
  if (!site.url) return null;
  return href === "index.html" ? `${site.url}/` : `${site.url}/${href}`;
}

/* ── Helpers for templates ───────────────────────────────────────────────── */

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Inline markup used in content files: *gold italic*, **bold**, [text](href). */
export function md(s: string): string {
  return escapeHtml(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => {
      const ext = /^https?:/.test(href);
      return `<a class="inline-link" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

/** Plain text (for aria-labels): markup removed. */
export function plain(s: string): string {
  return s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*?([^*]+)\*\*?/g, "$1");
}

/* ── Structured data (schema.org) ────────────────────────────────────────── */

export function personLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.person.name,
    jobTitle: site.person.role,
    email: `mailto:${site.person.email}`,
    ...(site.url ? { url: `${site.url}/` } : {}),
    sameAs: site.links.filter((l) => l.url).map((l) => l.url),
  };
}

export function publicationsLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: publications.items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "ScholarlyArticle",
        headline: p.title,
        ...(p.authors ? { author: p.authors.filter((a) => a !== "et al.").map((name) => ({ "@type": "Person", name })) } : {}),
        ...(/^\d{4}$/.test(p.date) ? { datePublished: p.date } : {}),
        ...(p.abstract || p.summary ? { abstract: p.abstract || p.summary } : {}),
        ...(p.arxiv ? { url: `https://arxiv.org/abs/${p.arxiv}` } : p.url ? { url: p.url } : {}),
        ...(p.doi ? { sameAs: `https://doi.org/${p.doi}` } : {}),
        ...(p.tags.length ? { keywords: p.tags.join(", ") } : {}),
      },
    })),
  };
}
