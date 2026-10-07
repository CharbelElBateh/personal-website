# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Charbel's personal research website. Primary visitors, all confirmed:

- **Academic peers**: researchers and potential collaborators. They read papers, check the research direction, and get in touch to collaborate.
- **Hiring / industry**: recruiters and hiring managers. They judge fit, download the CV, and make contact.
- **PhD / lab admissions**: committees and prospective advisors. They evaluate the research trajectory and its depth.

Casual readers of the curiosities/notes are welcome but are not a design target.

## Product Purpose

A credible and verifiable record of who Charbel is as a researcher: his work, publications, projects, and how to reach him. It succeeds when a peer, recruiter, or admissions reader can quickly understand his research identity, check it against real artifacts (papers, code, CV), and contact him.

## Positioning

**Open decision.** The research framing is not settled. Two candidates:

- computer engineering research that brings AI to hardware, electronics, and quantum computing (cross-stack);
- applied LLM / retrieval / agents work, which is how the current copy reads.

Future work must not lock in either framing until the user decides.

## Operating Context

- Astro static site (`npm run build` → `dist/`), with the same addresses as before: `index.html`, `about.html`, `work.html`, `publishings.html`, `projects.html`, `curiosities.html` ("Look at this"), `contact.html`.
- **All words live in `content/`** (one YAML file per page, plus `site.yaml` for the person, links and page switches, and `publications.bib` for papers). `src/lib/content.ts` validates them at build time and fails with the file and field at fault. See `content/README.md`.
- Templates are in `src/pages/` and `src/components/` (Curiosities card kinds in `src/components/curio/`). Header, footer, listings and modals are rendered at build time.
- SEO and plumbing: per-page titles and descriptions (checked unique at build), Open Graph, JSON-LD (Person, ProfilePage, ScholarlyArticle list, BreadcrumbList), `robots.txt`, `site.webmanifest`, favicon set, `og.png` (`npm run og`). Canonical links and `sitemap.xml` switch on once `url` is set in `content/site.yaml` (no domain yet).
- Contact: Web3Forms once `web3formsKey` is set (redirects to `thanks.html`), the visitor's email app until then; honeypot field plus a 3-second minimum as spam traps.
- No third-party requests: fonts (`@fontsource`), three.js and Lenis are self-hosted (`public/vendor/` is copied from `node_modules` at build), and there are no cookies, so no consent banner is required.
- `npm run check:links` verifies every internal link, file and anchor in `dist/`.
- Browser scripts are in `public/assets/`: `stage.js` (mounted by `boot.js`) draws each page's 3D stage; `scroll.js` handles smooth scrolling, the preloader and the pinned home sequence; `shared.js` holds reveals, modals, the menu and the custom scrollbar; `listing.js` wires rows, copy buttons and deep links. Script and style URLs carry a per-build `?v=` automatically.

## Capabilities and Constraints

- Pages: home, about, work history, publications, projects, curiosities, and contact.
- Work, Publishings, and Projects are data-driven listings that open a detail modal.
- **The contact form has no backend.** It validates each field, then opens the visitor's email app with the letter pre-filled (`mailto:`). The page says so. A hosted form service can replace this once hosting is chosen.
- The CV (`CV.pdf`, repo root) downloads from About, the menu and the footer.
- Every Work, Publication and Project item has a deep link (`page.html#id`) that opens its modal.
- Undecided: positioning (see above), the form backend, and the hosting/deploy target.

## Evidence on Hand

**Source of truth: `CV.pdf`** (in the repo; linked from About's "Download CV"). Content filled from it and now real:

- name spelling "Charbel Al Bateh"; email charbelelbateh@gmail.com; GitHub CharbelElBateh; LinkedIn charbel-al-bateh;
- education: BE Computer Engineering, Lebanese American University (2021 to present), minor in Mathematics;
- the full Work history in `content/work.yaml` (INMIND.AI, LAU, MERAKI, BMW Group, Invigo, Galactech.io);
- Publications: two arXiv preprints, with authors, year and abstract taken from the arXiv records (quantum state preparation, arXiv 2605.31006; MIRA-Math, arXiv 2607.07391), and two submissions in preparation (KV caching; PINNs for electronics);
- About bio, tools, "Currently", "Studying" and "Community" facts; the home "Recently" cards (one role, two papers); the home figures (2 arXiv preprints, 2 papers in preparation, 3 fields: AI, quantum, hardware).

**Still placeholder (the owner will decide):** every Project in `content/projects.yaml` (the Projects page only; no longer featured on home); the city (Beirut) and the undated availability line; Google Scholar (shown as "link coming", not linked); the reading list; the portrait (`portrait: null` in `content/about.yaml`); the "Look at this" page; the home and About voice paragraphs. Never invent facts to fill these.

## Product Principles

1. **Verifiable over impressive.** Every claim should be backed by a link to a paper, repository, or the CV. If evidence doesn't exist yet, leave the claim out rather than fake it.
2. **Research first.** Publications and research direction are the core content. Personality and curiosities are supporting texture.
3. **Fast paths per audience.** A recruiter reaches the CV and contact in one step, and an academic reaches papers and citations in one step.
4. **No dead ends.** Links, downloads, and forms must work, or be visibly marked as not yet available.

## Accessibility & Inclusion

No product-specific requirement has been established beyond baseline WCAG AA. The site uses Greek-letter section labels, so those need accessible text equivalents.
