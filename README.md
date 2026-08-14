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

`public/sessions/` holds all thirteen standalone lesson decks. The slug-to-file
maps in `src/lib/sessions.js` are the original site's, carried over verbatim, so
every Foundation and Algo Track session links to its own deck. A deck opens
full-screen at `/learn/:track/:slug/deck`, the way the original site opened it.

Three things were fixed in the decks, and nothing else in them was touched:

1. Each carried `<script src="/review-overlay.js">` — the internal review tool,
   not part of the product, 404ing on every lesson. Removed from all thirteen.
2. Five loaded Chart.js and two its annotation plugin from cdnjs. Both are now
   served from `public/vendor/`, at the same versions the decks pinned.
3. All thirteen loaded Playfair Display, IBM Plex Mono and IBM Plex Sans from
   Google. Those nine latin woff2 files now sit in `public/vendor/fonts/`, with
   `public/vendor/deck-fonts.css` declaring them.

A deck now makes zero external requests. Charts draw with no network.

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
- A deck renders inside an iframe, and none of its internal links said where to
  open. Clicking one loaded the entire site — header, footer and all — *inside*
  the deck. They now carry `target="_top"`, and the scripted ones use
  `window.top.location`.

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
a hover that turns a label the same colour as its own background.

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
