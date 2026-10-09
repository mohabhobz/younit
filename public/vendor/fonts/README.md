# The two brand faces that are not in this repository

The brand licenses three faces. One of them, **Anybody**, is on Google Fonts
under the OFL and ships with the site — it is in this folder as
`anybody-wdth.woff2` and `anybody-latin-ext-wdth.woff2`, and the app loads it
from `@fontsource-variable/anybody` as well.

The other two are licensed, not redistributable, so their files cannot be
committed here:

| Face | Expected filename in this folder |
| --- | --- |
| ITC Avant Garde Gothic Pro **Book** | `itc-avant-garde-gothic-pro-book.woff2` |
| ABC Favorit Arabic **Book** | `abc-favorit-arabic-book.woff2` |

Both are already declared against exactly those names in
`src/styles/index.css`, and both are first in the stack in
`src/styles/tokens.css` and `public/vendor/deck.css`. A font file that is not
there fails to load and the browser falls through to the next family, which is
why the site renders today without them. **Drop either file in with the name
above and that face takes over everywhere — site and lesson decks, both
languages — with no change to any rule.**

## Where the files come from

**ITC Avant Garde Gothic Pro Book** is on Adobe Fonts and cannot be
self-hosted from a desktop sync. It needs a Creative Cloud **web project** with
"ITC Avant Garde Gothic Pro" added and the Book weight selected; that produces
a kit stylesheet at `https://use.typekit.net/XXXXXXX.css`. Either route works:

- add the kit's `<link>` to `index.html` — the family it registers,
  `itc-avant-garde-gothic-pro`, is already second in the display stack; or
- if the licence allows a self-hosted copy, convert it to WOFF2 and drop it in
  here under the name above.

**ABC Favorit Arabic Book** is from ABC Dinamo. A web licence ships `.woff2`
files directly; rename the Book weight to the name above and drop it in.

## What else used to be here

`playfair-display-{400,700,900}.woff2` and `ibm-plex-sans-{300,400,500,600}.woff2`
were served to every lesson deck and painted nothing — the decks were scoped to
the brand long ago and neither face is named in any rule. They are gone.

`ibm-plex-mono-{400,500}.woff2` stays for code samples only. The brand pack has
no monospace — the branding deck set its own code labels in a trial face — so
every label, tag, figure caption and table header on the site and in the decks
is set in the display face now.
