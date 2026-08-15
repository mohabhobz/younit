# Younit — front end

Egypt's open initiative for capital markets. Vite + React, deployed as a static
site.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the built dist
npm run lint
node tools/verify.mjs   # route crawl, needs `npm run preview` running
```

## The template is the source of truth

The homepage, the design tokens and every component are transcribed from the
Claude Design source — `Younit Homepage.dc.html` and `Younit Style Guide.dc.html`.
Sizes, colours, radii, spacing, copy and motion timings are the template's
values, not approximations of them. Where anything disagreed with the brand PDF
or with an earlier draft, the template won.

Two places deviate, both deliberately and both marked in the code:

- **Responsiveness.** The template is drawn at a fixed 1440. Rendering at 1440
  and above is untouched; below that the frame tightens and the type scale steps
  down at 1100 and 700, so the page holds on a phone.
- **Real destinations.** The template's nav and cards are inert (they were a
  design file). Here they route.

## The design system lives in one file

`src/styles/tokens.css` holds every colour, type size, radius and spacing value
as a CSS custom property, and every component reads them from there. It is a
plain stylesheet, not a build-time config, for a specific reason: Vite does not
regenerate utilities when a config file changes while the dev server is running,
so a value edited in config silently renders as nothing until someone restarts.
Anything that has to take effect live belongs in `tokens.css`.

### Colour

| Token | Hex | Role |
|---|---|---|
| `--yn-blue` | `#A3C6D7` | header band, hero illustration, Learn card |
| `--yn-purple` | `#AC91E1` | Build card, code panel, every hairline and outline |
| `--yn-grey` | `#D7D7D7` | the page ground |
| `--yn-grey-dark` | `#444444` | secondary surfaces, muted body text |
| `--yn-amber` | `#FFD05A` | primary CTA and the Compete card only |
| `--yn-ink` / `--yn-ink-2` | `#000000` / `#1A1A1A` | type, dark bands |

The homepage is roughly 57% grey and well under 1% amber. That ratio is the
design — the amber reads as a call to action precisely because there is almost
none of it.

## Motion

`src/lib/useMotion.js` is the template's motion script, ported to a React hook.
Sections opt in by carrying a data attribute; no component needs to know the
animation exists:

| Attribute | Behaviour |
|---|---|
| `data-type` | types itself in, in document order |
| `data-cta` | lands after the last typed line |
| `data-unit` | an arch unit dropping into the pyramid |
| `data-rule` | a hairline drawing from the leading edge |
| `data-reveal` | a group whose children rise, staggered, on entry |
| `data-count` | a number counting up to its printed value |
| `data-draw` | an SVG whose strokes draw themselves |
| `data-rise` | bars growing from their base |
| `data-cell` | progress cells filling in sequence |
| `data-seq` | children appearing one after another |

The hook takes `'full' | 'subtle' | 'off'`, honours
`prefers-reduced-motion: reduce`, and restores every element it touched on
cleanup — so React's double-invoked effects in development never leave
half-typed text or stuck opacity behind.

## Content

Every route, every string and every content file from the original site is
accounted for. `src/lib/sessions.js`, the About and Partners copy, the glossary
A–Z grouping, the per-term pages, the Build and Compete sub-pages and the
mark-complete control are all carried over rather than reinterpreted.

Every article, session, glossary term and project is a Markdown file with
frontmatter under `src/content/en/`. `tools/vite-plugin-markdown.js` turns each
one into a module exporting `{ frontmatter, html, excerpt }` at build time, so a
malformed file fails the build rather than the page. `src/lib/content.js` is the
only thing that reads them; pages ask it for collections and documents.

The source content uses exactly two inline components, `<Term>` and `<Callout>`.
Both are rewritten to semantic HTML by the plugin. If a third ever appears, the
build logs a warning naming it rather than rendering literal angle brackets.

`public/sessions/` holds all thirteen lesson decks. The slug-to-file maps in
`src/lib/sessions.js` are the original site's, carried over verbatim, so every
Foundation and Algo Track session links to its own deck at
`/learn/:track/:slug/deck`.

### A deck is a page of the site

The original site framed each deck in an iframe: full-screen, no header, no
footer, one back button. That kept the deck's styles away from the site's, but
it also cut the deck off — a reader in the middle of a lesson had no way to
reach Learn or Build without leaving first. So a deck is rendered inline now,
under the same header and footer as every other page, with a breadcrumb above
it.

That only works if the two stylesheets cannot see each other, and a deck was
written as a whole document: `*{margin:0}`, `body{...}`, `header{...}`.
`tools/scope-decks.mjs` rewrites every one of those selectors to sit under
`.yn-deck` — 1448 rules through a real CSS parser, not a search and replace —
and drops the document wrapper, leaving the markup, the copy and the scripts
as they were. `public/vendor/deck.css` gets the scope twice (`.yn-deck.yn-deck`)
because it used to win collisions by loading last, and inside the site the
deck's own styles travel with its markup and land later; repeating the class
buys back the same precedence without depending on insertion order.

`src/lib/deck.js` does the loading. A `<script>` set through `innerHTML` never
runs and a `<link>` wants to be in the head, so the fragment is parsed, its
assets are loaded once and cached across decks, and its own scripts are
re-created in order. The decks were written as standalone pages and set
intervals and window listeners without ever expecting to be torn down, so
anything registered while a deck's script runs is recorded and undone when the
reader navigates away.

Some things follow from being inside the site. The deck reads from the left
gutter of the 1440 frame like every other page rather than from a 960 column
centred in the window. Its "next part" buttons are real links the router
handles. The way back is a pill under the breadcrumb, on the frame, the same on
all thirteen — two decks pinned their own copy of that control to a corner,
which was the only place for it in a full-screen frame; those are hidden.

Every control in a deck is the site's pill, and it inverts on hover the way the
site's buttons do. Both states read one custom property, so a variant restates
only its fill and no rule can flip half the pair. That was a real defect: a
group of rules repainting hover states in ink named the buttons too, so a
hovered pill went ink on ink and the label vanished.

### The decks are on the Younit brand

They arrived in the previous identity: navy ground, gold and teal accents,
Playfair Display headings, an EFG lockup. The teaching content and the markup
are exactly as written — every sentence, table, chart and section. Only the
presentation changed:

- `public/vendor/deck.css` rebinds the decks' own colour variables to Younit
  values and restyles the shared component vocabulary. One sheet governs all
  thirteen, and it overrides rather than edits.
- 642 inline style attributes carried the old palette. Inline styles beat any
  stylesheet, so those were remapped in place — by property, because a hue that
  was text on navy has to become ink on grey while the same hue stays a fill.
- 78 selectors painted text in an accent. Each read well on navy and between
  1.0 and 2.7 to one on the grey. Emphasis now carries weight instead of
  colour; labels and states go to ink; up/down and pass/fail keep a hue of
  their own, darkened for a light ground.
- Playfair Display is replaced by Poppins, and the body face is Anybody, so a
  deck sets in the same faces as the site.
- Chart colours are remapped in the chart configs, where Chart.js reads them —
  a stylesheet cannot reach those.
- The EFG lockup is gone: the site header carries the wordmark and the
  breadcrumb names the track, so the deck keeps only its own track label and
  session tag.
- Thirty fixed two-column grids never collapsed, so a phone scrolled sideways.
- A 28px button and an 8px carousel dot were below the 32px anyone can reliably
  hit on a phone. The boxes grew; the marks are the size they were drawn.
- Rows that were hairline-separated list items became cards, and their padding
  was vertical only — so once they had a border, the text touched it.
- A link wrapping a whole card took the purple on hover along with every line
  inside it, at 2.7 on white. Purple is for a link in a sentence now; a card
  answers with its lift and its outline.

Three defects were also fixed:

1. Each deck carried `<script src="/review-overlay.js">` — the internal review
   tool, not part of the product, 404ing on every lesson. Removed.
2. Five loaded Chart.js and two its annotation plugin from cdnjs; both are now
   served from `public/vendor/` at the versions the decks pinned.
3. All thirteen loaded webfonts from Google; those woff2 files are local now.

A deck makes zero external requests. `tools/check-decks.mjs` walks all thirteen
at their real routes at 390 and 1440 and fails on unreadable text — at rest and
with every control hovered one at a time — a surviving colour from the previous
brand, a chart that never drew, a script that threw, a request leaving the
machine, or horizontal overflow. It also measures the site's own header and
footer on every deck page against the same chrome on a page with no deck on it,
property by property — which is what proves the scoping holds.

The homepage's editorial cards and project tracks resolve against these real
files — the template's titles were already the real ones. Their dates and
authors come from frontmatter, not from the design copy.

## Fonts

Self-hosted from npm — no third-party request at runtime, and the build does not
depend on a CDN being reachable.

| Role | Shipping now | Should be |
|---|---|---|
| Display | Poppins 300/400 | **ITC Avant Garde Gothic Pro Book** — commercial, needs a webfont licence |
| Body | Anybody Variable, `wdth 117 wght 348` | same (SIL OFL) |
| Mono | IBM Plex Mono 400/500 | same (SIL OFL) |
| Arabic | IBM Plex Sans Arabic 400 | same (SIL OFL) |

Poppins is the stand-in the Claude Design file itself uses. Swapping in the
licensed display face is one `@font-face` block plus one line in `tokens.css`.

## Assets

`src/brand/marks.jsx` defines the wordmark, the dot, the arch unit and the
schematic glyphs once as SVG `<symbol>`s, with the exact path data from the
template, and references them with `<use>`. Mount `<BrandDefs />` once per page.

The hero photograph is the template's, re-encoded from the original 5504 x 3072
JPEG down to 2624 x 875 — the largest size the 3:1 band can show on a 2x display
— and served as WebP with a JPEG fallback. 7.1 MB became 98 KB.

Photography that is not yet licensed renders as `PhotoPlaceholder` at its true
aspect ratio with a written description of what belongs there.

## Honesty rules

Nothing on this site has launched. Compete shows no ranks, no names and no
figures — only a description of what each section will be. The homepage snapshot
figures are the design's sample values.

## Arabic

The route tree, the layout and every spacing rule use logical properties
(`margin-inline`, `padding-block`), so an RTL variant is a content drop rather
than a refactor. There is no Arabic content yet — the source site's `content/ar`
directories were all empty — so one locale ships and the header shows no locale
switch. A switch that does not switch is worse than none; when Arabic content
exists, `SiteHeader` is where it returns.

## Defects found and fixed in review

A full pass over the code before the first deploy. Each of these shipped
silently until it was looked for:

**In the client's lesson decks**

- Nine links pointed at `/learn/algo-track/part-1` … `part-7`. No such slug
  exists — the real ones are `00-intro` … `07-what-ai-brings` — so every one
  landed on the 404 page. Corrected, including the six that navigate by script
  rather than by `href`.
- A deck rendered inside an iframe, and none of its internal links said where to
  open. Clicking one loaded the entire site — header, footer and all — *inside*
  the deck. Now that a deck is a page rather than a frame, they are ordinary
  links the router handles.

**In the application**

- `/learn/:collection/:slug` and `/build/:collection/:slug` accepted any
  collection, so `/learn/showcase/<slug>` rendered an article whose breadcrumb
  pointed at a page that does not exist, `/build/glossary/bond` rendered a
  glossary term inside the project shell, and every editorial post was reachable
  at a second URL. Both routes now check the collection first.
- The prev/next control derived its base by slicing the pathname, which broke on
  any trailing-slash URL: `/editorial/<slug>/` produced a next link of
  `/editorial/<slug>/<other-slug>`. It is derived from the collection now.
- The two featured homepage cards had their tags transposed — the deep dive was
  labelled "Newsletter" and the newsletter "Deep Dive". The tag is derived from
  the document rather than hard-coded.
- The stroke-draw animation had never run. Its selector looked for `path` inside
  `[data-draw]`, but those glyphs were `<use>` references and a `<use>` instance
  lives in a shadow tree `querySelectorAll` cannot reach. The glyphs are drawn
  inline now; the selector finds eleven nodes where it used to find none.
- The hero reserved a `min-height` while typing and never released it, so once
  the webfont swapped in or the window widened, a phantom gap stayed under the
  copy for the life of the page.
- `SessionDeck` locked body scroll in an effect guarded on `src`, but rendered
  `NotFound` when either `src` or `doc` was missing — leaving the 404 page
  unscrollable.
- Deck URLs and the Related links on project pages were root-absolute, so both
  broke under a subpath deploy. Both respect the router base now.
- `YYYY-MM-DD` dates parsed as UTC midnight and printed a day early anywhere
  west of Greenwich.
- `2026-04-week-2` credits `editorial-team`, for which no person record exists,
  so its byline silently vanished. An unknown id now yields a readable name.

**In the build**

- The 404-fallback plugin wrote to a hardcoded `./dist` instead of the resolved
  output directory, so with any other `outDir` it silently rewrote a stale file
  from a previous build.
- ESLint's rule block matched only `.js`/`.jsx`, so every `.mjs` tool was
  enumerated and then linted with no rules at all — `npm run lint` reported
  clean on files it had not checked.
- `tools/shots/` (about 10 MB of QA screenshots) and `.vercel/` were not
  ignored.

## Verification

`node tools/verify.mjs` loads every route at 390 / 768 / 1024 / 1440 in
a real browser and fails on horizontal overflow, console errors, broken images,
a page rendering with no content, or a page without exactly one `<h1>`. It
writes a full-page screenshot of each route to `tools/shots/`.

`tools/check-interactive.mjs` hovers every control on every route at 390 and
1440 and measures the contrast between each label and whatever is actually
painted behind it, in both states, plus tap-target size at phone width. It asks
whether the text can be read, not whether a rule applied — which is what catches
a hover that turns a label the same colour as its own background. It collapses
transitions before measuring, so a sample is always the settled state rather
than the middle of a 180ms crossfade; the first run that did so found a real
one — the arrow in a pill row went ink-on-ink, because the card-hover reset and
`.yn-btn:hover` have equal specificity and the reset came later.

`tools/shot.mjs` captures the homepage after the motion has settled, which is
what to compare against the Claude Design render.

## Deploying

`vercel.json` supplies the whole configuration — framework `vite`, build
`npm run build`, output `dist`, an SPA rewrite for real paths, and a one-year
immutable cache on fingerprinted assets. Import the repository at
vercel.com/new; there is nothing to fill in.

URLs are real paths, not hash routes. `base` comes from `PAGES_BASE` and
defaults to `/`; the build also writes `dist/404.html` as a copy of
`index.html` for static hosts that use it as the fallback.

## Outstanding

- **Two pieces of white type on the light blue band fall below the contrast
  floor**, both exactly as the design source sets them: the homepage nav
  (white at 62% on `#A3C6D7`, 1.8:1) and the 6px "Powered by EFG Hermes" lockup
  (1.5:1). Neither is a coding defect, so neither was changed. Setting both to
  `--yn-ink` on the blue band takes them to roughly 11:1 and changes nothing
  else — one line each in `SiteHeader.jsx`. `tools/check-interactive.mjs` lists
  them as known exceptions so the rest of the check stays meaningful.
- **ITC Avant Garde Gothic Pro (Book)** webfont licence — see Fonts.
- **Licensed photography** for the Compete page and project portraits.

## Copy carried over verbatim

The template's wording is used as written, including four things that read like
slips. They are left alone because changing client-approved copy is not a
developer's call — flag them and they are one-line fixes:

1. `Not a sandbox. not a toy, the actual api` — comma where the pattern wants a
   full stop.
2. `VOLUME +20%` on the Build card — the strategy line above it implies a drop.
3. `leaderboard -through seasons` — missing space.
4. `Egypt's open initiative for Capital Markets` — mid-sentence capitals.
