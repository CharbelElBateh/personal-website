# Editing the site

Every word on the site lives in this folder. Edit a file, and the page follows.

```bash
npm install            # once
npm run dev            # live preview at http://localhost:4321 (reloads on save)
npm run build          # writes the finished site to dist/ — upload that folder
npm run check:links    # after a build: every internal link, file and #anchor (add -- --external for outside links)
npm run og             # redraws public/og.png, the link-preview image, after a name or role change
```

If something in a file is wrong (a typo in a field name, a missing title, a link to a
hidden item), the build stops and names the file, the field and the reason.

## Which file does what

| File | Controls |
| --- | --- |
| `site.yaml` | Domain (`url`), form key, your name, email, CV, profile links, **which pages exist** (`enabled`), menu order, footer, the phone CTA |
| `home.yaml` | Home sections (`show: true/false` on each), the featured "Recently" cards, figures |
| `about.yaml` | Facts, bio, portrait, the "Elsewhere" doors |
| `work.yaml` | Work page text and every role |
| `projects.yaml` | Projects page text and every project |
| `publications.yaml` + `publications.bib` | Publications page text; papers come straight from BibTeX |
| `curiosities.yaml` | "Look at this": cards with different templates (`kind: note / image / link / quote`) |
| `contact.yaml` | Contact page lines, quote, and whether the form shows |
| `system.yaml` | The 404 page and the thank-you page shown after the form sends |

## Common jobs

- **Add a role / project:** copy an item in `work.yaml` / `projects.yaml`, give it a new `id`.
- **Hide something without deleting it:** add `hidden: true` to the item (in BibTeX: `hidden = {true}`).
- **Remove a whole page:** `enabled: false` in `site.yaml`. It disappears from the menu, footer and
  About doors, and the Greek numerals re-letter. The build refuses if another page still links to it.
- **Add a paper:** paste the BibTeX from arXiv or Scholar into `publications.bib`, then optionally add
  `venue`, `summary` and `keywords`. Its key becomes the link: `publishings.html#<key>`.
- **Feature something on the home page:** add a card under `recent.cards` in `home.yaml` with
  `link: work.html#w2` (or a paper key).
- **New kind of curiosity card:** add the kind to the schema in `src/lib/content.ts`, a component in
  `src/components/curio/`, and a line in `src/pages/curiosities.astro`.
- **Images:** put them in `public/` (e.g. `public/assets/portrait.jpg`) and refer to them as `assets/portrait.jpg`.

## Two one-time settings in `site.yaml`

- **`url`** — once you have a domain, e.g. `url: https://charbelalbateh.com`. This switches on canonical
  links, `sitemap.xml`, the sitemap line in `robots.txt`, link-preview images and search breadcrumbs.
- **`web3formsKey`** — go to web3forms.com, enter `charbelelbateh@gmail.com`, and paste the key they email
  you. The form then sends letters itself and shows the thank-you page. Until then it opens the visitor's
  email app. Spam protection (a hidden trap field and a minimum fill-in time) works either way.

## Search and sharing (automatic)

Every page gets its own title and description from its file (the build refuses duplicates and warns about
lengths), Open Graph tags for link previews, and structured data: you as a Person on Home and About, your
papers as ScholarlyArticles on Publications. The 404 and thank-you pages are kept out of search results.
Fonts, three.js and Lenis are served from the site itself, so no visitor data goes to Google or a CDN and
no cookie banner is needed — keep it that way if you add analytics (choose a cookieless one).

## Writing text

- `*gold italic*`, `**bold**`, `[a link](work.html)` work in most text fields.
- YAML trips on a few characters. **Put the text in quotes** if it contains `: ` (colon + space),
  starts with a quote mark or `*`, or contains a comma inside `{ … }` on one line.
