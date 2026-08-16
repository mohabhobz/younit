# Younit — site to Figma

A Figma plugin that builds the Younit design system in a Figma file and imports
the site's pages as frames bound to it.

## Why it is built this way

A plugin cannot read this site on its own. Younit is a React application: ask
its URL for HTML and what comes back is `<div id="root"></div>`. The design does
not exist until a browser has run the script and laid the result out.

So the work is split. A browser runs in the project — `npm run figma:export` —
renders every route, measures every box after the layout has settled, and writes
a snapshot per page into `public/figma/`. Those snapshots deploy with the site.
The plugin fetches them and builds.

That is also why the import is faithful rather than approximate: the geometry is
the browser's own, not a guess.

## What it makes

**Variables** — two collections, from `src/styles/tokens.css`:

- `Younit / Colour` — the eight palette colours
- `Younit / Scale` — type sizes, radii and spacing, in three modes:
  **Desktop**, **Tablet**, **Mobile**

The three modes are the stylesheet's three breakpoints (1440, 1100, 700). The
type scale really does change between them — `--yn-hero` is 76 / 58 / 42 — so
switching a frame's mode resizes its headings the way the site does.

**Styles** — eight paint styles and eleven text styles, each bound to the
variables above rather than holding a copy of the value.

**Components** — Button (4 tones × 2 sizes × default/hover), Card, Callout,
PillRow, Breadcrumb. Built, not traced: a traced button is a picture of a
button.

**Pages** — one frame per route per width, with auto layout wherever the
exporter has verified Figma would put the children back where the browser had
them, fills bound to the colour variables, and type bound to the scale.

## Installing it

1. Figma → **Plugins** → **Development** → **Import plugin from manifest…**
2. Choose `figma-plugin/manifest.json`
3. It appears under Plugins → Development → *Younit — site to Figma*

## Using it

Open the file you want it built into, run the plugin, and press **Import
everything**. The design system is built first, then the pages, so the pages can
bind to it.

The other two buttons do one half each — useful when the pages have been
re-exported but the system has not changed.

## Refreshing after the site changes

```
npm run figma          # tokens → plugin → snapshots
git push               # the snapshots deploy with the site
```

Then run the plugin again. Variables and styles are updated in place rather than
duplicated, so a second run does not leave two of everything.

## The fonts

Install these on the machine running Figma, or the type falls back and the
import is drawn in the wrong faces:

- **Poppins** — Light, Regular
- **Anybody** — the variable file
- **IBM Plex Mono** — Regular, Medium
- **IBM Plex Sans Arabic** — Regular

Anybody is variable and the site pins it to `wdth 117, wght 348`. Figma reaches
a variable font through its named instances, so the plugin asks for
*SemiExpanded Light* first and falls back through *Light* and *Regular*. If the
file has none of them, the family is reported in the log once rather than
failing the run.

## Layout of the source

```
figma-plugin/
  manifest.json
  ui.html            the panel: one button, a progress bar, a log
  code.js            built — do not edit
  src/
    00-tokens.js     generated from tokens.css
    10-util.js       colour, fonts, messages
    20-system.js     variables, styles, components
    30-page.js       snapshot → frames
    40-main.js       the plugin entry
```

Figma loads exactly one script and gives it no module system, so
`tools/figma/build-plugin.mjs` joins `src/*.js` in name order into `code.js`.
Edit the sources, not the bundle.
