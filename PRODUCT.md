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

- Static multi-page site: `index.html`, `about.html`, `work.html`, `publishings.html`, `projects.html`, `curiosities.html` ("Look at this"), `contact.html`.
- Shared chrome and listings come from `assets/partials.js`, `assets/shared.js`, and `assets/data.js` (arrays `WORK`, `PUBS`, `PROJECTS`). Each page renders its rows plus a detail modal from these arrays.
- `assets/stage.js` (mounted by `assets/boot.js`) draws each page's 3D stage. `assets/scroll.js` handles smooth scrolling, the preloader and the pinned home sequence.

## Capabilities and Constraints

- Pages: home, about, work history, publications, projects, curiosities, and contact.
- Work, Publishings, and Projects are data-driven listings that open a detail modal.
- **The contact form is not wired up.** The submit handler only fakes a "dispatched" state with `setTimeout`, and no submission backend has been chosen.
- The CV download on About serves `CV.pdf` from the repo root.
- Undecided: positioning (see above), the form backend, and the hosting/deploy target.

## Evidence on Hand

**Source of truth: `CV.pdf`** (in the repo; linked from About's "Download CV"). Content filled from it and now real:

- name spelling "Charbel Al Bateh"; email charbelelbateh@gmail.com; GitHub CharbelElBateh; LinkedIn charbel-al-bateh;
- education: BE Computer Engineering, Lebanese American University (2021 to present), minor in Mathematics;
- the full Work history in `assets/data.js` (INMIND.AI, LAU, MERAKI, BMW Group, Invigo, Galactech.io);
- Publications: two arXiv preprints (quantum state preparation; MIRA-Math) and two submissions in preparation (KV caching; PINNs for electronics);
- About bio, tools, "Currently", "Studying" and "Community" facts; the home "Recently" work and publication cards; the "4 papers & drafts" figure.

**Still placeholder (the owner will decide):** every Project in `assets/data.js` and the home project card; the "6+ years" and "3 domains" figures; the city (Beirut) and availability line; Google Scholar; the reading list; the portrait; the "Look at this" page; the home and About voice paragraphs. Never invent facts to fill these.

## Product Principles

1. **Verifiable over impressive.** Every claim should be backed by a link to a paper, repository, or the CV. If evidence doesn't exist yet, leave the claim out rather than fake it.
2. **Research first.** Publications and research direction are the core content. Personality and curiosities are supporting texture.
3. **Fast paths per audience.** A recruiter reaches the CV and contact in one step, and an academic reaches papers and citations in one step.
4. **No dead ends.** Links, downloads, and forms must work, or be visibly marked as not yet available.

## Accessibility & Inclusion

No product-specific requirement has been established beyond baseline WCAG AA. The site uses Greek-letter section labels, so those need accessible text equivalents.
