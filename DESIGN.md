---
name: GonkaRouter
description: AI model router on the Gonka Network. A live particle network under a thin mono instrument layer.
colors:
  primary-container: "#00ffa3"
  primary-dim: "#00ef99"
  secondary: "#64fcc9"
  tertiary: "#72dcff"
  void: "#000000"
  well: "#050505"
  counter-ground: "#0a0a0a"
  surface: "#0e0e0e"
  chip: "#1c1c1c"
  chip-hover: "#2a2a2a"
  line: "#262626"
  title-dim: "#7a7a7a"
  ink-soft: "#8a8a8a"
  chip-text: "#cfcfcf"
  ink: "#dddddd"
  chip-on: "#e6e6e6"
  text-main: "#ffffff"
  text-muted: "rgba(255, 255, 255, 0.6)"
typography:
  display:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "clamp(34px, 0.6rem + 4.4vw, 88px)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "clamp(28px, 1.4rem + 1.6vw, 44px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  title:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "clamp(22px, 1rem + 1vw, 30px)"
    fontWeight: 500
    letterSpacing: "-0.03em"
  title-sm:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.35
  body:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  lede:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.04em"
  button:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 500
    letterSpacing: "0.04em"
  tag-head:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 500
  wordmark:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "15px"
    fontWeight: 700
    letterSpacing: "-0.01em"
rounded:
  hair: "2px"
  round: "50%"
spacing:
  gutter: "clamp(16px, 3.4vw, 56px)"
  section: "clamp(72px, 5rem + 4vw, 160px)"
  page-max: "1600px"
  chip-gap: "6px"
  cta-gap: "10px"
  stack: "28px"
  split-gap: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.void}"
    typography: "{typography.button}"
    rounded: "{rounded.hair}"
    padding: "0 14px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.text-main}"
    textColor: "{colors.void}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-main}"
    typography: "{typography.button}"
    rounded: "{rounded.hair}"
    padding: "0 14px"
    height: "36px"
  button-lg:
    padding: "0 20px"
    height: "48px"
  chip:
    backgroundColor: "{colors.chip}"
    textColor: "{colors.chip-text}"
    typography: "{typography.label}"
    rounded: "{rounded.hair}"
    padding: "5px 9px"
  chip-on:
    backgroundColor: "{colors.chip-on}"
    textColor: "{colors.void}"
  chip-tab:
    backgroundColor: "{colors.chip}"
    textColor: "{colors.chip-text}"
    typography: "{typography.label}"
    rounded: "{rounded.hair}"
    padding: "8px 12px"
  chip-tab-hover:
    backgroundColor: "{colors.chip-hover}"
    textColor: "{colors.text-main}"
  tag-head:
    textColor: "{colors.primary-container}"
    typography: "{typography.tag-head}"
  code-well:
    backgroundColor: "{colors.well}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.hair}"
    padding: "24px 20px"
  nav-link:
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.hair}"
    padding: "6px 10px"
  nav-link-hover:
    backgroundColor: "{colors.chip}"
    textColor: "{colors.text-main}"
  hero-counter:
    backgroundColor: "{colors.counter-ground}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.round}"
    size: "44px"
---

# Design System: GonkaRouter

## Overview

**Creative North Star: "The Instrument Logbook"**

The network is the subject. Everything you read sits on a black field like the readout layer of an instrument: small uppercase mono labels, hairline rules, square 2px corners, and one green that marks what is live or actionable. On the home page that field is literally live. A quarter-million points (512² on the high tier) settle onto one twisted, lobed ring right of centre, and the visitor's cursor stirs them through a real fluid simulation. The type layer stays thin so the cloud reads as the hero.

Density is a logbook's density: tight 11 to 13px instrument text, generous section breathing room (72 to 160px), and information arranged as ruled ledgers instead of cards. One typeface, JetBrains Mono, carries every role. Hierarchy comes from scale and grey value, not from weight jumps or a second family. Color is close to monochrome: grey-white particles and text, with #00FFA3 rationed to labels, markers, focus, the progress hairline, and the primary action.

It rejects the AI-product category default: centred gradient headline, pill badges, glowing icon-card grids.

**Key Characteristics:**
- Pure black ground (#000) on home; hairlines (#262626) instead of boxes.
- JetBrains Mono for everything; uppercase, 0.04em tracked labels at 11 to 13px.
- Square 2px corners on every rectangle; round only for the counter, the brand mark and avatars.
- Lists are ruled ledgers: top rule per row, closing bottom rule on the last row.
- Bracketed lowercase green headings name a block: `[pricing]`, `[legal]`.
- The WebGL particle and fluid field is the one heavy visual, gated by capability, with a static poster as the floor.

**Scope and known seam.** This system covers the home page body and the shared landing chrome (nav, footer, instrument buttons) that every landing-layout page wears: /, /pricing, /docs, /blog, /privacy-policy, /terms-of-service, /feedback. The bodies of those other pages still use the older Plus Jakarta / Inter, rounded style. That is a seam the build carries, not part of this system. New landing surfaces follow this document.

## Colors

A near-monochrome black and grey instrument palette with a single rationed neon green.

### Primary
- **Signal Green** (primary-container): the brand mark color. Used for bracketed tag-heads, the primary button fill, list markers, ledger and spec icons, the 1px scroll-progress hairline under the nav, focus outlines, link and title hover, the blinking code caret, and the sparse accent points in the particle field. Text on it is always black.
- **Dim Signal** (primary-dim): keyword color in code samples (`from`, `import`) and inline code text inside FAQ answers. Never a fill.

### Secondary
- **Code Mint** (secondary): the base text color inside code wells only.

### Tertiary
- **Readout Cyan** (tertiary): string literals in code samples and the `base_url` value in the closing code line. Syntax only; never used for UI chrome.

### Neutral
- **Void** (void): the home page ground, the hero field, the text color on green and on the inverted chip.
- **Well Black** (well): code panels and the closing `base_url` line; one step off the void so the well reads without a shadow.
- **Counter Ground** (counter-ground): the round hero counter and the empty blog thumbnail.
- **Surface** (surface): the ground for non-home landing pages in dark mode, and the base the translucent nav mixes from.
- **Chip Slab** (chip): flat chips, nav link hover, the footer mail chip, inline code ground.
- **Chip Hover** (chip-hover): hover state for unselected tab chips; also the scrollbar thumb on home.
- **Hairline** (line): every rule, border and divider in the world.
- **Dim Title Grey** (title-dim): the second line of a two-tone display headline.
- **Soft Ink** (ink-soft): secondary copy: ledes, ledger and FAQ answer text, spec labels, meta rows.
- **Chip Text** (chip-text): text on unselected chips.
- **Ink** (ink): default body text on the home page.
- **Chip On** (chip-on): the inverted, selected chip.
- **White** (text-main): display and section headings, titles, ghost button text.
- **Muted White** (text-muted): resting nav links, footer links and footer microcopy.

The shared chrome follows `html.light` overrides (line #dcdfe3, chip #ebedef, chip-text #3a3a3a, ink-soft #5c6166, plus tokens.css surface and text values) on non-home landing pages. Home is forced dark and never renders those.

### Named Rules
**The Rationed Green Rule.** #00FFA3 marks state, structure labels and the one primary action. It is never a background wash, a gradient, or body text. In the particle field the green points are about one in a few hundred (`pow(random, 220)`), and that sparseness is the template for the page.

**The Grey Ladder Rule.** Hierarchy on black is carried by four greys (white, ink #ddd, soft ink #8a8a8a, dim title #7a7a7a), not by color. Add a new step only if none of the four fits.

## Typography

**Display Font:** JetBrains Mono (with ui-monospace, SF Mono, Menlo, Consolas, monospace)
**Body Font:** JetBrains Mono
**Label/Mono Font:** JetBrains Mono

**Character:** One mono family at three weights (400, 500, 700) reads as a machine readout at small sizes and as engineered, tightly tracked slabs at display sizes. The single family is the identity; contrast comes from scale, case and grey value.

### Hierarchy
- **Display** (500, clamp(34px, 0.6rem + 4.4vw, 88px), 0.96, -0.04em, uppercase): the hero headline and, slightly smaller (clamp(32px, 1rem + 4.4vw, 80px), line-height 1), the closing headline. Set in two tones: first line white, second line Dim Title Grey.
- **Headline** (500, clamp(28px, 1.4rem + 1.6vw, 44px), 1.05, -0.04em, sentence case, `text-wrap: balance`): section headings.
- **Title** (500, clamp(22px, 1rem + 1vw, 30px), -0.03em): the active model name in the model panel.
- **Title Small** (500, 15px, 1.35): blog post titles, clamped to two lines.
- **Body** (400, 13px, 1.5): default copy. Measures: 40ch for section ledes, 44ch for the hero lede, 52 to 68ch for longer answers.
- **Lede** (400, 14px): hero description and FAQ questions.
- **Label** (400 or 500, 11px, 0.04em, uppercase): chips, nav links, meta rows, code bar, footer microcopy. Ledger titles and spec rows use the same treatment at 12 to 13px.
- **Button** (500, 12px, 0.04em, uppercase; 13px on large buttons).
- **Tag-head** (500, 13px, lowercase, in square brackets, green): block names. Footer columns use the 11px label size.
- **Wordmark** (700, 15px nav / 18px footer, -0.01em to -0.02em): "GonkaRouter" only. 700 is reserved for it.

### Named Rules
**The One Family Rule.** JetBrains Mono for every role. Don't introduce a sans or serif for display or body inside this world.

**The Uppercase Is Instrument Rule.** Uppercase plus 0.04em tracking means "this is a control or a readout": chips, buttons, nav, labels, ledger titles, the display headline. Running prose and section headlines stay sentence case.

## Layout

A 1600px max page (`page-max`) with a fluid gutter of clamp(16px, 3.4vw, 56px). Every full-width band (nav row, sections, footer) shares that container, so left edges align from the nav wordmark down to the footer.

Sections stack as full-bleed bands separated by a single top hairline. Vertical rhythm is `section` (clamp(72px, 5rem + 4vw, 160px)) on top and 0.8 of that below; the closing section takes the full value on both sides.

The recurring section composition is a 5 / 7 split at ≥1024px with a 64px gap (40px stacked below). The left column holds the headline, lede and one text link, and sticks at `top: 96px` while the right column scrolls. On mobile it collapses to one column with the head first.

The hero fills `100svh`. The particle form is centred and large (×1.22 at ≥1100px), and the type sits on either side of it along the bottom edge: the two-tone headline bottom-left; bottom-right a 380px offer column with the highlights list, a one-line lede and the two CTAs. Below 1100px the two stack. There is no counter, scroll cue or chip row in the hero. Pointer events are off on the type layer so the canvas under it receives the cursor; only links and buttons re-enable them.

**Highlights list.** Non-interactive facts are set as a spec list, never as chips or buttons: 12px uppercase ink, a 6px square marker per line, no fill or border. The single key offer (free tokens) is Signal Green, marker included. Chips stay reserved for things you can press, such as the model tabs.

Everything else from the first viewport lives in the **At a glance** strip directly below the hero: one ruled row of four cells (`[info]`, `[pricing]` with the live rate as a 26px figure, `[models]` as a clickable ledger that opens that model's tab, `[connect]`), split by vertical hairlines at ≥1100px (columns 1 / 1 / 1.4 / 0.7), two columns at ≥768px, stacked below.

Breakpoints in use: 640px (desktop nav actions, two-column blog), 768px (footer grid 2fr 1fr 1fr 1fr, ledger three columns, hero counter shown, all chips shown), 900px (inline nav links, burger hidden), 1024px (section split, three-column blog), 1100px (wide particle form, four-cell glance strip).

Inner spacing: 6px between chips, 10px between CTAs, 28px between hero groups, rows padded 12px (specs, hero models) to 20 to 22px (FAQ, ledger).

### Named Rules
**The Ledger Rule.** Lists are rows separated by 1px hairlines: a top rule on each row and a bottom rule on the last. Use this for features, specs, models, FAQ, and blog entries (top rule only). Don't wrap list items in bordered or filled cards.

## Elevation & Depth

The world is flat. There are no box-shadows. Depth comes from three things: the live particle field behind the type, tonal steps of black (void #000, well #050505, counter #0a0a0a), and the translucent nav (`rgb(0 0 0 / 0.72)` on home, `color-mix(surface 78%)` elsewhere, with 16px backdrop blur and a hairline once scrolled).

Over the cloud, legibility is protected rather than decorated. The hero headline and chip row use `mix-blend-mode: plus-lighter` so they glow into the particles. The lede carries a black halo (`text-shadow: 0 0 12px #000, 0 0 2px #000`); no body copy sits over the cloud.

### Named Rules
**The Flat Instrument Rule.** No box-shadows, no glows on surfaces. If something needs separation, use a hairline or a step of black.

**The Legibility Halo Rule.** Black text-shadow and radial falloffs exist only to keep copy readable over the live field. Don't use them as decoration on solid ground.

## Shapes

Rectangles with a 2px corner (`hair`) everywhere: buttons, chips, nav links, icon buttons, code wells, blog thumbnails. Borders are 1px, always the hairline color, brightening to white (ghost button, icon button) or green (hero counter) on hover. Circles are allowed for exactly three things: the hero model counter, the brand mark, and user avatars. Bullets are squares (`list-style: square`) in green.

The signature form is the ring itself: one bent, lobed ring with an elliptical cross-section that twists one and a half turns, defined as an SDF in `lib/particle-hero/shaders/field.ts`. It is the only organic shape in the world.

### Named Rules
**The Two Pixel Rule.** Every rectangle has a 2px radius. Not 0, not 8, not a pill.

## Components

### Buttons
Rectangular instrument buttons: flat, uppercase, mono, quick.
- **Shape:** square corners (2px), 1px border slot, `min-height` 36px (48px large).
- **Primary:** Signal Green fill, black text, 0 14px padding (0 20px and 13px text when large). Carries an arrow icon when it leads somewhere. Label is "Get API Keys" across the site.
- **Hover / Focus:** primary goes to white fill. All buttons press down 1px on `:active`. Focus is a 1px green outline at 3px offset. Color transitions run 150ms; the press uses `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Ghost:** transparent with a hairline border and white text; hover brightens the border to white. Over the hero it gets a `rgb(0 0 0 / 0.4)` fill so it holds against the cloud.
- **Icon button:** 36px square, hairline border, hover brightens border; disabled at 0.3 opacity.

### Chips
- **Style:** flat Chip Slab (#1c1c1c) with Chip Text, 11px uppercase label, 5px 9px padding, 2px corners. No border, no pill.
- **State:** selected is inverted (Chip On fill, black text). As tabs they grow to 8px 12px and unselected tabs hover to Chip Hover with white text. A 10px small variant tags blog posts. On home, the hero chip row hides past the third chip below 768px.

### Ledger rows
- **Style:** grid row (20px icon slot, then title, then text at ≥768px as 2fr / 3fr), 22px vertical padding, hairline top rule. Title is 13px uppercase white, text is Soft Ink at 60ch.
- **Variants:** spec rows (12px uppercase, icon + label), hero model rows (name and API id left, uppercase spec right, name turns green on hover), FAQ rows.

### FAQ disclosure
Ledger rows whose question (14px white) turns green on hover. The plus icon rotates 45° and turns green when open. The answer opens by animating `grid-template-rows` 0fr to 1fr with an opacity fade (300ms expo out); closed answers are `inert`.

### Code well
- **Corner Style:** 2px.
- **Background:** Well Black with a hairline border.
- **Bar:** 11px uppercase Soft Ink row with filename, model id (not uppercased) and language pushed right, ruled off below.
- **Body:** Code Mint text, 12 to 14px at 1.7 line height, keywords Dim Signal, strings Readout Cyan, comments muted. Ends on a blinking green block caret (1.1s, stepped; disabled under reduced motion).

### Navigation
Fixed top bar, transparent over the home hero, solid once scrolled 24px or on any other page (translucent black with 16px blur and a hairline). The wordmark is 15px bold mono beside the 28px round mark. Links are 11px uppercase muted white, turning white with a Chip Slab ground on hover or when active. A 1px green progress hairline along the bottom edge scales with scroll. Below 900px links move into a sheet of 13px uppercase ruled rows; below 640px the Sign In and Get API Keys buttons move into the sheet as a two-column pair.

### Footer
A hairline-topped band: wordmark and uppercase tag line with a mail chip, then link columns headed by bracketed green 11px labels (`[menu]`, `[service]`, `[legal]`). Links are 13px muted white with an underline that fades in on hover. The bottom bar holds uppercase copyright and social icons that turn green on hover.

### Bracketed tag-head
A lowercase name in square brackets, Signal Green, 13px medium (11px in the footer). It names the block it sits on, the way a panel label names a readout. It is the block's heading, not a label stacked above another heading.

### Text link
13px Ink, underlined with a #555 line at 4px offset; hover drops to 0.7 opacity and the underline goes to currentColor. Takes a trailing arrow (→ internal, ↗ external).

### Particle field (signature)
`HeroParticles.vue` over `lib/particle-hero`. A GPGPU point cloud (512², 320² or 160² by tier) springs toward an SDF ring and is pushed by a stable-fluids simulation fed by pointer and touch. Points are dark grey to white through a matcap with sparse green sparkles, on pure black. Boot is lazy (idle callback, dynamic `import`), pauses offscreen and when the tab is hidden, and crossfades in over 1.2s from a static WebP poster. The poster is the floor and is all you get under reduced motion, Save-Data, viewports under 768px, or missing WebGL2 float buffers.

### Named Rules
**The Poster Floor Rule.** Any heavy visual ships a static poster that renders first and stays if the GPU path is unavailable. Content never waits on the canvas.

## Do's and Don'ts

### Do:
- **Do** set every surface in JetBrains Mono; reserve weight 700 for the wordmark.
- **Do** use uppercase 11px labels with 0.04em tracking for controls and readouts, and sentence case for prose and section headlines.
- **Do** build lists as hairline ledgers (#262626 rule on top of each row, one closing rule at the bottom).
- **Do** give every rectangle a 2px corner and a 1px hairline when it needs an edge.
- **Do** keep #00FFA3 to labels, markers, focus, progress and the primary button, with black text on it.
- **Do** name blocks with a bracketed lowercase green tag-head (`[pricing]`) when the block has no other heading.
- **Do** set display headlines in two tones: white first line, #7a7a7a second line.
- **Do** ship a static poster under any WebGL visual and gate the GPU path on reduced motion, Save-Data, width and capability.
- **Do** animate opacity, transform and grid rows; 150ms for color, 300ms with `cubic-bezier(0.16, 1, 0.3, 1)` for movement.

### Don't:
- **Don't** use rounded cards, pill badges or icon-card grids; chips are flat 2px slabs.
- **Don't** add box-shadows or surface glows; separate with hairlines and steps of black.
- **Don't** use gradient text or green background washes (the legacy `gradient-text` and `kinetic-gradient` utilities in tokens.css belong to the older style, not this world).
- **Don't** introduce a second typeface inside the landing world.
- **Don't** stack a small label above a section headline as an eyebrow; tag-heads name blocks that have no other heading.
- **Don't** add hues outside black, the grey ladder and the green family to UI chrome; cyan and mint are for code syntax only.
- **Don't** let the canvas block content or capture clicks meant for the type layer.
