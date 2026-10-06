---
name: Charbel AL Bateh
description: A research portfolio staged like a studio reel, set in black, cream and one gold, with lit classical fragments the visitor can push.
colors:
  gold: "#c9a96e"
  gold-burnished: "#b3925a"
  cream: "#e8e2d1"
  cream-dim: "#9e9887"
  cream-muted: "#8c8676"
  true-black: "#000000"
  night: "#050506"
  obsidian: "#0a0a0c"
  raised-ink: "#111114"
  hairline: "rgba(232, 226, 209, 0.12)"
  hairline-ink: "rgba(232, 226, 209, 0.14)"
  hairline-strong: "rgba(232, 226, 209, 0.28)"
typography:
  display:
    fontFamily: "Cormorant Garamond, EB Garamond, Georgia, serif"
    fontSize: "clamp(3.2rem, 11.5vw, 13.5rem)"
    fontWeight: 400
    lineHeight: 0.82
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Cormorant Garamond, EB Garamond, Georgia, serif"
    fontSize: "clamp(3.2rem, 9.2vw, 10rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.015em"
  statement:
    fontFamily: "Cormorant Garamond, EB Garamond, Georgia, serif"
    fontSize: "clamp(1.7rem, 3.3vw, 3.6rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  lede:
    fontFamily: "Cormorant Garamond, EB Garamond, Georgia, serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2.6rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Cormorant Garamond, EB Garamond, Georgia, serif"
    fontSize: "clamp(1.4rem, 2.6vw, 2.6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.7rem"
    fontWeight: 400
    letterSpacing: "0.24em"
  label-sans:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    letterSpacing: "0.06em"
  button:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 500
    letterSpacing: "0.14em"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.8rem"
    fontWeight: 400
rounded:
  sharp: "2px"
  pill: "999px"
  round: "50%"
spacing:
  gutter: "clamp(16px, 2.6vw, 40px)"
  section: "clamp(80px, 12vw, 180px)"
  section-head: "clamp(36px, 5vw, 72px)"
  card: "clamp(22px, 2.4vw, 34px)"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.true-black}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 20px"
  button-primary-hover:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.true-black}"
  button-ghost:
    backgroundColor: "rgba(0, 0, 0, 0.6)"
    textColor: "{colors.cream}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 20px"
  button-ghost-hover:
    backgroundColor: "rgba(232, 226, 209, 0.08)"
    textColor: "{colors.cream}"
  button-round:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.true-black}"
    rounded: "{rounded.round}"
    size: "52px"
  chip:
    backgroundColor: "rgba(0, 0, 0, 0.75)"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    height: "32px"
    padding: "0 14px"
  tag:
    backgroundColor: "{colors.true-black}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    height: "30px"
    padding: "0 12px"
  input:
    backgroundColor: "{colors.true-black}"
    textColor: "{colors.cream}"
    typography: "{typography.body}"
    padding: "14px 16px"
  input-focus:
    backgroundColor: "{colors.night}"
  card-door:
    backgroundColor: "{colors.obsidian}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sharp}"
    padding: "22px"
  card-door-hover:
    backgroundColor: "{colors.raised-ink}"
  card-curio:
    backgroundColor: "{colors.obsidian}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sharp}"
    padding: "{spacing.card}"
  card-curio-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.true-black}"
    rounded: "{rounded.sharp}"
  listing-row:
    textColor: "{colors.cream}"
    typography: "{typography.title}"
    padding: "28px 0"
  listing-row-hover:
    backgroundColor: "{colors.raised-ink}"
  menu:
    backgroundColor: "{colors.obsidian}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sharp}"
    padding: "14px"
    width: "min(440px, calc(100vw - 2 * var(--gutter)))"
  modal:
    backgroundColor: "{colors.obsidian}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sharp}"
    padding: "clamp(28px, 4vw, 52px)"
    width: "760px"
---

# Design System: Charbel AL Bateh

## Overview

**Creative North Star: "The Gilded Reliquary"**

A true-black room in which a cluster of classical fragments hangs lit: fluted column drums, capitals, Greek-key tiles, tesserae, orbs and laurel rings in veined marble, gold metal, obsidian and night-stone, inside a faint gold star field. The visitor pushes it with the cursor and, on the home page, scrolls into it. Everything around the stage is quiet: cream type on black, hairline rules, one gold used for emphasis, labels and the single primary action.

The page is dark and spacious, with large Cormorant display set tight and quiet Inter text between. Ornament is linear and gold, never filled: hairline frames with gold corner brackets, small gold "+" registration marks, Greek-key meander bands that open the lifted section and the footer, Greek capital ordinals in the menu. The 3D carries all of the colour and volume; the flat interface stays at hairline weight so the stage is the only lit object.

Motion is slow and inertial: Lenis smooth scrolling, lines that rise out of a mask, a gold italic counter on first arrival, and a pinned home sequence where the framed stage opens to full bleed, the camera falls into the cluster and the statement assembles word by word out of a blur. Reduced motion removes the smoothing, the pinning and the preloader and leaves a static stacked page.

**Key Characteristics:**
- True black page, cream text, one gold; no second hue anywhere in the interface.
- Cormorant Garamond display with gold italic emphasis; Inter for reading; JetBrains Mono for gold registration labels.
- Sharp 2px rectangles framed by hairlines; full round only for pills, chips and circular action buttons.
- Gold linework ornament: corner brackets, "+" marks, meander bands, Greek ordinals.
- One lit physical 3D stage per page, with per-page presets of form and stone.

## Colors

A near-monochrome warm night: black surfaces in four close steps, cream type in three strengths, and one burnished gold.

### Primary
- **Laurel Gold** (`gold`): the only accent. Gold italic emphasis inside display, statement and lede lines; mono labels and registration captions; "+" marks, stage corner brackets and meander strokes; the primary pill, the circular "go" button on work cards, the hovered listing chevron; inline links; the scroll-progress bar, selection, focus outline and text caret; the preloader counter and bar. It also lights the 3D: gold metal, the rim light and the star field.
- **Burnished Gold** (`gold-burnished`): a darker gold used only as a 1px ring, around dark curiosity cards at rest and around a door card on hover. It is not the button hover; pills hover to cream.

### Neutral
- **Bone Cream** (`cream`): all primary text, the giant name, display headings; also the hover fill of the gold pill.
- **Weathered Cream** (`cream-dim`): secondary prose, sub-lines, page subtitles, modal body copy, door descriptions.
- **Dust Cream** (`cream-muted`): dates, sans labels (field labels, fact keys), form status, the attribution under a quote.
- **True Black** (`true-black`): the page, the lifted section, input fields, text on gold.
- **Night** (`night`): the footer and the preloader; the focused input.
- **Obsidian** (`obsidian`): resting containers: menu panel, modal, contact letter, door and curiosity cards, portrait well.
- **Raised Ink** (`raised-ink`): the hover step: the fill that wipes up behind a listing row, a hovered door card.
- **Hairline** (`hairline`), **Hairline Ink** (`hairline-ink`), **Hairline Strong** (`hairline-strong`): cream at 12%, 14% and 28%. The quiet one divides facts, figures, menu foot and card edges; the ink one rules the footer grid and the preloader and scroll-meter tracks; the strong one frames stages, listing rows, the ghost pill, chips and round outline buttons.

### Named Rules
**The One Gold Rule.** Gold is the only chromatic colour in the interface. Nothing else is tinted; cream, black and gold make every surface.

**The Gold Emphasis Rule.** Emphasis in a Cormorant line is a gold italic `em`, one phrase at most per line. Bold is never the emphasis device in display type.

**The Four Blacks Rule.** Depth on the page comes from four blacks (true black, night, obsidian, raised ink) and cream hairlines. Do not add lighter greys to separate surfaces.

## Typography

**Display Font:** Cormorant Garamond (with EB Garamond, Georgia, serif)
**Body Font:** Inter (with system-ui, -apple-system, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, SF Mono, Menlo, monospace)

**Character:** A high-contrast classical serif at weight 400, set very large and tight, against a neutral grotesque for reading and a small tracked mono for gold labels. The serif carries the voice, Inter does the work, and the mono marks measurements.

### Hierarchy
- **Display** (400, clamp(3.2rem, 11.5vw, 13.5rem), 0.82): the giant name set into the lower left of the home stage. The same voice at stage scale runs the pinned statement (clamp(2.6rem, 8.4vw, 9.5rem), 0.95) and the footer call to action (clamp(3rem, 10.5vw, 12rem), 0.86).
- **Headline** (400, clamp(3.2rem, 9.2vw, 10rem), 0.95): inner page titles, revealed line by line. Section titles use the same face at clamp(2.8rem, 8vw, 8.5rem).
- **Statement** (400, clamp(1.7rem, 3.3vw, 3.6rem), 1.04, balanced, max 22ch): the one-line role at the top of home (up to 4rem there, max 30ch).
- **Lede** (400, clamp(1.5rem, 2.6vw, 2.6rem), 1.12): the opening paragraph of a section, in the serif.
- **Title** (400, clamp(1.4rem, 2.6vw, 2.6rem), 1.02): listing rows; work-card titles run slightly smaller (clamp(1.4rem, 2.2vw, 2.2rem)). Modal titles (clamp(1.8rem, 3.6vw, 2.8rem)), curiosity titles and door titles (1.9rem) share this register; key-value values are serif at 1.3rem.
- **Body** (400, 17px, 1.55; 16px under 560px): paragraphs, capped at 60 to 62ch.
- **Label** (JetBrains Mono 400, 0.7rem, 0.24em, uppercase, gold): registration captions under stages and side labels such as "Currently".
- **Label Sans** (Inter 600, 0.8rem, 0.06em, uppercase, dust cream): form field labels, fact and contact keys, modal subheads, footer column heads.
- **Button** (Inter 500, 0.74rem, 0.14em, uppercase): every pill.
- **Data** (JetBrains Mono, 0.8rem, dust cream): dates in rows and cards, modal meta.

### Named Rules
**The Serif Speaks Rule.** Anything that is a voice (name, statements, titles, ledes, values, quotes) is Cormorant at 400. Anything that is an instrument (buttons, labels, keys, dates) is Inter or mono, small and tracked.

**The Tight Display Rule.** Display sizes run line-height 0.82 to 0.95 with negative tracking (-0.01em to -0.03em). Loose display leading breaks the carved look.

## Layout

Full-width pages with a fluid gutter (`spacing.gutter`) rather than a centred container. Sections breathe on a large vertical rhythm (`spacing.section`), with headings separated from content by `spacing.section-head`. Section heads put a giant title on the left and a ghost pill on the right, bottom-aligned.

Each page opens with the same structure: a title paired with a right-aligned subtitle (1.4fr / 1fr), then a full-width stage (clamp(300px, 46vh, 560px) on inner pages, min(70vh, 760px) on home), then a row of four "+" marks with a gold caption. Home extends this into one pinned sequence 360vh tall: the stage is clipped to a framed window under the header and opens to full bleed on scroll while the camera dollies into the cluster and the statement assembles centre-screen over a soft dark scrim. The next section lifts over it, opened by a meander band.

Grids are asymmetric and few: 1fr / 2fr for the "Currently" block; a two-column work grid whose first card spans both columns at 21:9; listing rows at 1.6fr / 1fr / 160px / 56px; a 12-column curiosity grid with 8/4, 6/6, 12 and 4/4/4 spans; five doors in a row; contact at 1fr / 1.4fr; a four-column footer.

Responsive steps at 1100px (doors to two), 900px (curiosities to one column), 820px (most two-column grids stack; listing rows collapse to title, meta and a 44px chevron), 720px (the marks row drops to three) and 560px (16px body, smaller header, the "Get in touch" pill hides and the menu carries contact).

## Elevation & Depth

Surfaces are frosted glass over a slow ambient glow. A fixed layer of three soft radial lights (gold, violet, cyan at 5 to 10%) drifts behind the page over 40s, and panels sit on it as glass: a faint cream gradient (8% to 2%), an 18px backdrop blur with 1.5 saturation, a 1px cream ring and a 12% white highlight on the top edge. The two floating layers, menu and modal, add a deep soft drop shadow, but on a black page the ring does the visible work; the shadow only darkens what is behind. The modal backdrop dims to 72% black with an 8px blur. All real volume lives in the 3D stage: clear iridescent glass (transmission, slight dispersion) with gold rims, a few solid gold and stone pieces, a warm key light, a gold rim light, a cool edge light, room-environment reflections, a soft gold glow behind the cluster for the glass to refract, Neutral tone mapping at 0.95 exposure and black fog.

### Shadow Vocabulary
- **Glass panel** (`background: linear-gradient(160deg, rgba(232,226,209,.08), rgba(232,226,209,.02) 60%); backdrop-filter: blur(18px) saturate(1.5); box-shadow: inset 0 1px 0 rgba(255,255,255,.12), inset 0 0 0 1px rgba(232,226,209,.12)`): ghost pills, doors, curiosity cards, the letter, chips and the portrait.
- **Hairline ring** (`box-shadow: inset 0 0 0 1px rgba(232, 226, 209, 0.12)`, or `0.28` for the strong version): the edge of listing rows and outline buttons.
- **Floating menu** (`box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(232, 226, 209, 0.28)`): the menu panel.
- **Floating modal** (`box-shadow: 0 40px 100px -30px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(232, 226, 209, 0.28)`): the detail modal.

### Named Rules
**The Ring Not Shadow Rule.** A surface is separated by a 1px cream ring and one step of black, not by shadow. A drop shadow appears only under the two floating layers, and always with its ring.

**The Glass Rule.** Panels are frosted glass with one top highlight and a cream ring, never opaque fills. Light comes from the ambient glow and the 3D stage; the glass only blurs and catches it. Gold surfaces (pills, the gold curiosity card) stay solid.

## Shapes

Rectangles are sharp: 2px corners on stages, cards, the menu, the modal, the letter and the portrait. Interactive capsules are fully round: pills, chips and tags at 999px, and circular "go", close and chevron buttons at 50%. Nothing sits between those two shapes.

The frame is the signature form. Every stage carries a 1px strong hairline with a 20px gold L-bracket at each corner, like a mounted plate. Under it runs a registration row of 13px gold "+" crosshairs with one mono caption. The meander, a single gold Greek key 48 by 14px at 0.7 stroke and 55% opacity, repeats across the top edge of the lifted home section and the footer. Linework is always thin and gold; ornament is never filled.

**The Plate Rule.** A 3D stage is always framed: strong hairline, four gold corner brackets, and a "+" registration row beneath it.

## Components

### Buttons
Quiet capsules with a tracked uppercase voice.
- **Shape:** full pill (999px), 44px tall (40px under 560px), 20px horizontal padding.
- **Primary (gold pill):** gold fill, black text, a faint inner white ring at 14%. Used for "Get in touch", "The short version", "Download CV", "Send letter".
- **Hover / Active:** the gold fill turns to bone cream with black text over 200ms; a trailing dot scales 1.6x, an arrow nudges 3px right; press scales to 0.97.
- **Ghost pill:** 60% black with a 14px backdrop blur and a strong hairline ring, cream text; hover fills with 8% cream. Used for "Menu", "Work history", "The whole trajectory".
- **Round action:** 52px gold circle with a black arrow on work cards (revealed on hover on fine pointers, always shown on touch at 44px); 44px outline circles on doors and listing rows that fill gold and turn -45deg on hover.

### Chips
- **Style:** 32px capsule on 75% black with a strong hairline ring, cream Inter 600 at 0.78rem, uppercase, 0.04em. Sits over the top-left of work-card media.
- **Tags:** 30px black capsules inside the modal, Inter 600 at 0.78rem.

### Cards / Containers
- **Corner Style:** sharp (2px).
- **Background:** obsidian at rest; raised ink on hover.
- **Shadow Strategy:** hairline ring only (see Elevation & Depth).
- **Doors:** five link cards, min 240px tall, serif title, dim description and an outline round button; hover lifts to raised ink with a burnished-gold ring and fills the button gold.
- **Curiosities:** a 12-column cabinet of cards (min 320px) with a gold line drawing bleeding off the top-right corner that tilts -6deg and scales 1.06 on hover. Two variants: true black ringed in burnished gold, and solid gold with black text and a black drawing at 60%.
- **Work cards:** a 16:10 (lead card 21:9) media well with a dark radial and a rendered still of the page's cluster, chip top-left, round gold button bottom-right; serif title and mono date below. The image eases to 1.035 on hover.
- **Internal Padding:** 22px on doors, `spacing.card` on curiosities, clamp(28px, 4vw, 52px) in the modal, clamp(22px, 3.4vw, 44px) in the contact letter.

### Inputs / Fields
- **Style:** true-black field with a quiet hairline border, cream Inter text, 14px 16px padding; uppercase sans label above in dust cream; gold caret.
- **Focus:** the border turns gold and the field steps to night; the outline is suppressed in favour of the border.
- **Status:** a dust-cream status line beside the submit pill (`role="status"`).

### Navigation
- **Header:** fixed, transparent, serif wordmark at 1.3rem on the left; gold "Get in touch" pill and ghost "Menu" pill on the right. It slides up out of view on scroll down and returns on scroll up.
- **Menu:** a frosted glass panel (max 340px) that grows from its trigger at the top right (scale 0.96 to 1, 300ms). Each row is a 1.45rem serif page name led by its gold italic Greek capital ordinal (Α to Η), with an arrow that slides in on hover over a 5% cream wash. The current page is gold. A hairline foot carries email and location. Escape and outside click close it; focus moves to the first link on open.
- **Scroll progress:** a 2px gold bar across the top of the viewport.

### Listing Rows (signature)
Full-width rows for Work, Publishings and Projects: serif title, dim meta, mono date and a 48px outline chevron, ruled top and bottom with strong hairlines. On hover a raised-ink panel wipes up from the bottom edge, extended into the gutters (380ms), the title slides 16px right, and the chevron fills gold and rotates -45deg. Each row opens a centred modal (scale 0.96 to 1) with mono meta, serif title, dim body, gold bullet dots on hairline-ruled lists and pill tags; focus is trapped inside and returns to the row on close.

### Stage (signature)
The framed 3D window. A dark radial well (#12110e to black) holding a WebGL canvas that fades in over 900ms once the first frame is ready. Glass relics are drawn to the centre, collide softly and are shoved by the cursor. Forms are fluted drums, capitals, orbs, laurel rings, Greek-key tiles and tesserae; only glass and gold: clear iridescent glass, gold rims on drums and orbs, and about one piece in twelve in solid gold. Each piece keeps a margin of air around it; motion is slow and the light soft (the Calm Vitrine rule). Home holds 18 pieces (11 on phones), inner pages 14 (9). If WebGL fails, a gold-to-black radial stands in. Cards use static renders of the same cluster.

### Finale (home, signature)
A pinned 640vh sequence before the footer, one camera flight through one scene: a gold-framed window in a black wall tilts square and the camera flies through its glass; a void with a rainbow halo ring where an uppercase serif statement spreads apart word by word; a colonnade of fluted marble columns with gold capitals on a black floor; a glass pane that shatters into iridescent shards (shards dissolve as they reach the lens); then glass crystals in a gold glow with the closing call to action, "Write a *letter*, I'll write back", and a gold pill to Contact. On the home page this replaces the footer's giant call to action. Reduced motion shows only the final frame.

### Glass controls
Every control is glass. Primary pills are gold-tinted glass with a gold ring and soft glow; secondary pills, round arrow buttons, chips, tags and fields are clear frosted glass with a bright top edge. Hover states live on a separate layer that fades in over 450ms (gradients cannot interpolate), and a soft light sweeps across pills over 1.1s; on leave the sweep fades rather than reversing. The scrollbar is a thin gold glass thread on black.

### Preloader
First visit per session on home only: a night-black sheet with an oversized gold italic counter (000 to 100, tabular figures) in the lower left and a thin gold bar, held until the stage reports its first frame, then wiped upward with a 900ms clip.

## Do's and Don'ts

### Do:
- **Do** keep gold as the only accent, and spend it on emphasis, labels, ornament and the single primary action of a view.
- **Do** set emphasis inside Cormorant lines as gold italic, one phrase per line.
- **Do** frame every 3D stage with the strong hairline, four 20px gold corner brackets and a "+" registration row with one mono caption.
- **Do** separate surfaces with the four blacks and 1px cream rings (12% quiet, 28% strong).
- **Do** keep rectangles at 2px corners and capsules fully round.
- **Do** draw ornament as thin gold linework: meander bands, "+" marks, brackets, curiosity line drawings.
- **Do** keep the reduced-motion path complete: no smooth scroll, no pinning, no preloader, reveals as plain fades.

### Don't:
- **Don't** introduce a second hue, a coloured gradient or a lighter grey surface into the interface.
- **Don't** set display type in bold or with loose leading; the serif stays at 400 and tight.
- **Don't** round rectangular surfaces beyond 2px; the only round forms are pills, chips, tags and circular buttons.
- **Don't** fill ornament or render it in cream; meanders, brackets and marks are gold strokes.
- **Do** keep exactly one gold mono label above each inner-page title, and only in the form "Greek ordinal · page name" (for example "Γ · Work history"), matching the menu's ordinal. It is a carry-over from the original classical site that the owner asked to keep. **Don't** add mono eyebrows anywhere else.
- **Don't** use a drop shadow as the only edge of a surface; any shadow travels with its hairline ring.
