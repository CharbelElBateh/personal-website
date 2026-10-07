/* A small BibTeX reader: enough for entries pasted from arXiv, Scholar or a paper's .bib. */

export interface BibEntry {
  type: string;
  key: string;
  /** Field values exactly as written (LaTeX intact), keys lower-cased. */
  raw: Record<string, string>;
  /** Field order as written, for re-serialising. */
  order: string[];
  line: number;
}

export class BibError extends Error {}

export function parseBib(src: string, file: string): BibEntry[] {
  const entries: BibEntry[] = [];
  let i = 0;
  const lineAt = (pos: number) => src.slice(0, pos).split("\n").length;
  const fail = (msg: string, pos: number): never => {
    throw new BibError(`${file}:${lineAt(pos)}: ${msg}`);
  };
  const skipSpace = () => { while (i < src.length && /\s/.test(src[i])) i++; };

  function braced(): string {
    // src[i] === "{"; returns the inside, nested braces kept
    const start = i;
    let depth = 0;
    for (; i < src.length; i++) {
      if (src[i] === "\\") { i++; continue; }
      if (src[i] === "{") depth++;
      else if (src[i] === "}" && --depth === 0) { i++; return src.slice(start + 1, i - 1); }
    }
    return fail("unclosed {", start);
  }
  function quoted(): string {
    const start = i++;
    let depth = 0;
    for (; i < src.length; i++) {
      if (src[i] === "\\") { i++; continue; }
      if (src[i] === "{") depth++;
      else if (src[i] === "}") depth--;
      else if (src[i] === '"' && depth === 0) { i++; return src.slice(start + 1, i - 1); }
    }
    return fail('unclosed "', start);
  }
  function value(): string {
    const parts: string[] = [];
    for (;;) {
      skipSpace();
      if (src[i] === "{") parts.push(braced());
      else if (src[i] === '"') parts.push(quoted());
      else {
        const m = /^[^\s,#}]+/.exec(src.slice(i));
        if (!m) fail("expected a value", i);
        parts.push(m![0]);
        i += m![0].length;
      }
      skipSpace();
      if (src[i] === "#") { i++; continue; }
      return parts.join("");
    }
  }

  while (i < src.length) {
    // Lines starting with % are comments; anything outside an entry is ignored.
    if (src[i] === "%") { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (src[i] !== "@") { i++; continue; }
    const at = i++;
    const type = (/^\w+/.exec(src.slice(i)) || fail("expected an entry type after @", at))[0].toLowerCase();
    i += type.length;
    skipSpace();
    if (src[i] !== "{" && src[i] !== "(") fail(`expected { after @${type}`, i);
    if (type === "comment" || type === "preamble" || type === "string") { braced(); continue; }
    i++;
    skipSpace();
    const key = (/^[^\s,]+/.exec(src.slice(i)) || fail("missing citation key", i))[0];
    i += key.length;
    const raw: Record<string, string> = {};
    const order: string[] = [];
    for (;;) {
      skipSpace();
      if (src[i] === ",") { i++; skipSpace(); }
      if (src[i] === "}" || src[i] === ")") { i++; break; }
      if (i >= src.length) fail(`entry ${key} is not closed`, at);
      const name = (/^[\w-]+/.exec(src.slice(i)) || fail(`bad field name in ${key}`, i))[0].toLowerCase();
      i += name.length;
      skipSpace();
      if (src[i] !== "=") fail(`expected = after ${name} in ${key}`, i);
      i++;
      if (name in raw) fail(`field ${name} appears twice in ${key}`, i);
      raw[name] = value();
      order.push(name);
    }
    entries.push({ type, key, raw, order, line: lineAt(at) });
  }
  return entries;
}

const ACCENTS: Record<string, string> = { "'": "́", "`": "̀", "^": "̂", '"': "̈", "~": "̃", "=": "̄", ".": "̇", c: "̧", v: "̌", u: "̆", H: "̋", k: "̨" };
const SYMBOLS: Record<string, string> = { ss: "ß", o: "ø", O: "Ø", ae: "æ", AE: "Æ", oe: "œ", OE: "Œ", aa: "å", AA: "Å", l: "ł", L: "Ł", i: "ı", j: "ȷ" };

/** LaTeX-ish BibTeX text to plain Unicode, for display. */
export function texToText(s: string): string {
  return s
    .replace(/\\([`'^"~=.])\s*\{?\s*\\?([A-Za-z])\}?/g, (_, a, ch) => (ch + ACCENTS[a]).normalize("NFC"))
    .replace(/\\([cvuHk])\s*\{\s*([A-Za-z])\s*\}/g, (_, a, ch) => (ch + ACCENTS[a]).normalize("NFC"))
    .replace(/\\(ss|ae|AE|oe|OE|aa|AA|o|O|l|L|i|j)(?![A-Za-z])\s?/g, (_, n) => SYMBOLS[n])
    .replace(/\\(?:textit|emph|textbf|textsc|texttt|mathrm|text)\s*\{([^{}]*)\}/g, "$1")
    .replace(/\\([&%$#_{}])/g, "$1")
    .replace(/---/g, "—").replace(/--/g, "–")
    .replace(/(?<!\\)~/g, " ")
    .replace(/\$([^$]*)\$/g, "$1")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** "Al Bateh, Charbel and Saab, S. and others" -> ["Charbel Al Bateh", "S. Saab", "et al."] */
export function bibAuthors(s: string): string[] {
  return s.split(/\s+and\s+/).map((name) => {
    const n = texToText(name);
    if (n.toLowerCase() === "others") return "et al.";
    const parts = n.split(",").map((p) => p.trim());
    if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
    if (parts.length === 3) return `${parts[2]} ${parts[0]}, ${parts[1]}`;
    return n;
  });
}

/** Re-serialise an entry with only the given fields, aligned like the source file. */
export function toBibtex(e: BibEntry, skip: Set<string>): string {
  const names = e.order.filter((n) => !skip.has(n));
  const width = Math.max(...names.map((n) => n.length));
  const casing: Record<string, string> = { archiveprefix: "archivePrefix", primaryclass: "primaryClass" };
  const body = names.map((n) => `  ${(casing[n] || n).padEnd(width)} = {${e.raw[n]}}`).join(",\n");
  return `@${e.type}{${e.key},\n${body}\n}`;
}
