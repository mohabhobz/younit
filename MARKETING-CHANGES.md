# Marketing's comments — the running list

Everything asked for since the revised branding deck of 20 August, in the order
it arrived. A line is ticked when the change is in the code, built, checked and
on the local machine. Ticking in Figma is marketing's, not ours: the API has no
way to resolve a thread, so `npm run figma:done -- <id>` replies "Done" on it and
the person who wrote it resolves it.

Nothing here was decided by us. Where a comment needs a destination, a picture or
a decision that is not ours to take, it sits under **Waiting on the client** at
the bottom rather than being guessed at.

## Batch 0 — the brand

- [x] Replace the logo everywhere with the artwork from the revised deck —
      Latin wordmark, Arabic wordmark, Icon A, favicon. Traced from the client's
      own PNGs, each mark carrying its own box.
- [x] Read the deck against the guidelines and report what changed. The type
      scale is unchanged (Anybody, width 117, weight 348; IBM Plex Sans for
      Arabic). The palette is **not** — three of the five swatches differ from
      the tokens. Reported, not changed.

## Batch 1 — the top row

- [x] Remove Editorial from the navigation and put About in its place. The
      writing stays on the site: the footer still links to it and its own
      addresses are unchanged.

## Batch 2 — the top of the homepage

- [x] The eyebrow says what the platform is: "The MENA Region's First API
      Trading Platform".
- [x] Both hero buttons say what they do — "Open an account", "Get your API
      key".
- [x] A "What is Younit" explanation above the three tracks, with a reserved
      16:9 frame for the video. A frame that says the film is coming, not an
      empty player.
- [x] The Learn card loses its lesson counter and its progress bar — there is no
      tracker behind them. In their place: what the track teaches, and a
      photograph.

## Batch 3 — the rest of the homepage

- [x] Learn badge → "Understand the market behind your code".
- [x] Build badge → "Bring your trading idea to life".
- [x] Compete badge → "Put your strategy to the test!".
- [x] The Build card loses `12` and `+18.4%`, and keeps one button: "Click here
      to get started" → `/build/repositories`.
- [x] Remove the "API, two ways" section.
- [x] Remove the Editorial section from the homepage.
- [x] Remove the Project tracks section.
      The photo band stays — no comment asked for it to go.

## Batch 4 — names, on Learn and in the footer

Each rename was followed everywhere the name is written or read from, not only
where the pin was: the Learn cards, the track indexes, the breadcrumbs, the tab
titles, the session decks themselves in both languages, the editorial writing
that mentions them, and an author's biography.

- [x] "Foundation Series" → **Stock Market 101** (Arabic: سوق الأسهم 101).
      17 places, including the header inside all five session decks.
- [x] "Algo Track" → **What is Algo Trading** (Arabic: ما هو التداول الخوارزمي).
      21 places, including all eight decks and the map inside them. Four
      sentences that read "the Algo Track" were reworded so they still read as
      English — the new name is a question, and "the What is Algo Trading" is
      not a sentence.
- [x] Deep Dives comes off the Learn page. Its writing and its addresses are
      untouched: `/learn/deep-dives` and every article under it still open, so
      nothing that linked to them anywhere is broken. It is off the index only,
      "for now".
- [x] The footer's "EFG Innovation Hub" → **LetsYounit!**
- [x] The footer's "EFG" column heading → **EFG Hermes**.
- [x] "One idea · One rule · One automated strategy" removed from the footer,
      and the three strings with it.

`npm run check:renames` was added to the check suite: it reads every page that
shows one of these names, in both languages, and fails if an old name is still
written anywhere or a new one is missing.

## Batch 5 — pages taken away, and the startup kit

The rule followed here: take a page away and what sits under it goes with it,
unless something else on the site opens it. Nothing did, in every case below —
checked before removing, and checked again after.

- [x] The photograph above the footer on the homepage goes. It came in with the
      Editorial section, which went in batch 3.
- [x] The timings come off every session — "45 min", "50 min" — on the track
      pages and in the session headers. Editorial keeps its reading time, which
      is a different promise to the reader.
- [x] Deep Dives: the page itself now, not only its card. `/learn/deep-dives`
      and its three articles are not found. The writing stays in the repository.
- [x] Templates: page removed.
- [x] Showcase: page removed, with the project pages under it.
- [x] Capstones and Apps: pages removed, with the project pages under them.
      Build is one row now — Repositories.
- [x] Repositories: "Clone, fork, build" comes out of the line under the title.
- [x] Repositories: "Explore the startup kit to get started" is the lead.
- [x] Repositories: three places held for Raslan's links. Each says the link is
      coming rather than pointing anywhere — no address was invented.
- [x] "What is Algo Trading" was already done in batch 4; the Figma still shows
      the old name because the snapshots there predate it.

`check:renames` now also checks the removals: every page listed above must not
open, and the homepage must not carry that photograph.

## Batch 6 — Compete, Editorial and Partners

- [x] Capstones and Apps: already gone in batch 5 — the comments confirm it.
- [x] Compete is one line and a waiting sign: "Stay tuned for the next
      competition", with three dots that keep time. Nothing to click, and no
      date claimed. The photograph stays.
- [x] Leaderboard, Seasons, Hackathons, Wall of Fame: pages removed.
- [x] Editorial: page removed, with the article pages under it, and the footer
      link that pointed at it.
- [x] Partners: page removed, and its footer link with it. (Asked and
      confirmed: the whole page, not only the university list.)

The footer is two shorter lists now — Platform is Learn, Build, Compete; the
EFG column is About, EFG Holding, GitHub. Nothing on the site links to a page
that is not there.

## Batch 7 — checked, and the writing taken out of the bundle

Every comment in this batch was already done in batches 4 and 5. Each was
checked by address rather than by memory:

- [x] The session page says Stock Market 101 — breadcrumb, header and tab title.
- [x] The Algo sessions say What is Algo Trading, including the back button on
      the deck itself, in both languages.
- [x] The Deep Dives article page: not found.
- [x] All five Showcase and Capstone project pages, and the Apps one: not found.

One thing was not finished, and this batch is what found it. The pages were
gone, but their writing was still in `src/content`, and everything there is
compiled into the bundle whether a page renders it or not — so every visitor was
still downloading the removed articles. They now live in `archive/`, out of the
build and still in the repository. **The bundle went from 478 kB to 405 kB
(gzip 145 → 125 kB).** Putting a collection back is moving its folder back.

## Batch 8 — the revised deck's design, applied

Read off the deck's own artwork, not typed from memory. No copy changed.

- [x] The palette moves to the deck's five swatches: blue `#A3C6D7` → `#8ECADC`,
      purple `#AC91E1` → `#BA8EEE`, grey `#D7D7D7` → `#D8D8D8`, accent
      `#FFD05A` → `#FFCC00`. The dark, `#444444`, was already right.
- [x] The header and footer band is the purple, as the deck's website mockup
      draws it — it was the blue. The colour now lives in one token,
      `--yn-chrome`, so moving the chrome again is one line.
- [x] The arches in the hero are purple, as the deck draws them. They were ours
      in blue.
- [x] The three cards keep the colours the deck gives them: Learn blue, Build
      purple, Compete yellow — those already matched.
- [x] Typography: no change needed. The deck names ITC Avant Garde Gothic Pro
      for headlines, but the font kit the client shipped in `Source/Fonts` is
      Anybody, IBM Plex Mono, IBM Plex Sans Arabic and **Poppins** — which is
      what the site uses. Body stays Anybody at width 117, weight 348; Arabic
      stays IBM Plex Sans Arabic.

## Batch 9 — the four on the homepage

- [x] The favicon is redrawn to the deck's own Favicon panel: a square plate
      with a modest corner radius (9.5% of the side, not the quarter circle it
      had), the mark filling 85% of the width rather than 68%, and both centred.
      Checked at 128, 32 and 16 pixels.
- [x] The Build card's three chips stand one above the other and the arrows
      point down. They share the card's height between them, so the card is
      full — this is what the empty middle needed.
- [x] The Compete card's content sits in the middle of the card rather than
      against the top, and so does what is inside the video frame — the glyph
      and its line were a grid's two rows, pushed apart.
- [x] The video frame takes the header's colour.

## Batch 10 — the comments deck (Younit comments website.pptx)

- [x] Eyebrow → "MENA's First API Trading Platform".
- [x] "Learn, Build, Compete." comes off the hero — it is in the row above and
      in the three sections below.
- [x] The hero line is marketing's: "Trade with algorithms, connect to the
      market, and build your own trading apps with Younit". It is the page's
      h1 now, so the page still has exactly one.
- [x] "Open an account" downloads EFG Hermes ONE, and **the page reads the
      device**: an iPhone or iPad goes to the App Store, an Android phone to
      Google Play. On a desktop, where there is nothing to detect, both shops
      are offered by name.
- [x] Under the buttons: "Download EFG Hermes ONE and open your account first.
      When you are done, come back and click Get your API key."
- [x] "Get your API key" keeps the address it had — EFG's own page has not
      arrived yet.
- [x] The introduction is two sections now: **What is Younit** and **How Younit
      Works**, both in marketing's words, with the seven steps written out.
- [x] Neither reads as a wall: the first paragraph and the first step stand, and
      **Read more** opens the rest. The hidden text is in the page either way,
      so a reader without the button and a search engine both get all of it.
- [x] The Build card loses the three icons and says: "Access Younit's APIs,
      market data, and SDK to build, test, and automate your own strategies and
      applications."
- [x] The Compete card loses the figures in its middle, for now.
- [x] Footer: "The content provided does not constitute investment advice.",
      and the line beside it now reads EFG Hermes rather than EFG Holding.
- [x] About gains two sections — About EFG Hermes and About Younit. Each says
      its text is being written, because that text is coming from you.

**The font question, answered.** Yes — the site is on the kit the client
shipped: Poppins for display, Anybody (width 117, weight 348) for body, IBM Plex
Sans Arabic for Arabic, IBM Plex Mono for code. The deck's type page names ITC
Avant Garde Gothic Pro for headlines, but the font folder delivered with it
contains Poppins, not that.

## To raise with marketing

- **Three buttons now point at sections that were removed.** The hero's "Get
  your API key" and the Learn card's "Continue lesson" point at `#api`; the
  Compete card's "See all ranks" points at `#editorial`. They still scroll
  nowhere. Left exactly as they were, per your instruction — tell us the
  destinations and we will put them in.
- **The addresses still carry the old names.** `/learn/foundation` and
  `/learn/algo-track` are unchanged, because changing an address breaks every
  link already sent, bookmarked or printed. Nothing on the page shows them, and
  they can be changed with a redirect from the old ones the moment you say so.
- **"LetsYounit!" replaced a name that was also used as a noun.** The footer
  heading is now LetsYounit!, but the About and Partners pages said "the Hub" in
  the middle of sentences, where an exclamation cannot stand. Those read
  "Younit" now. If marketing wants LetsYounit! in the prose as well, say the
  word.
- **The Arabic for both track names is ours, not marketing's.** سوق الأسهم 101
  and ما هو التداول الخوارزمي. The comments were written in English only.
- **"Delete this page, we won't need it now" sat on the Repositories row.**
  Repositories was kept, because three other comments rewrite it — the startup
  kit lead, the three link slots, and taking "clone, fork, build" out. Taken
  together with the four rows marked Delete beside it, the reading is that the
  four go and Repositories stays. Say the word if that is wrong.
- **White on the purple band is 2.6:1.** The deck draws the header's links in
  white on the purple, so that is what the site does. It reads better than the
  1.8:1 the blue gave and is still under the 4.5:1 anyone can read comfortably.
  The same purple with black links is 8.2:1. One word and it is fixed — but it
  is the brand's call, not ours.
- **The Compete card on the homepage is empty now** the figures are out of its
  middle — a badge and a button with a lot of yellow between them. Say what
  belongs there and it goes in.
- **On a desktop the account button becomes two**, App Store and Google Play,
  because there is no device to read. On a phone it is the single button the
  deck draws.
- **The Learn page is three cards**, so the glossary sits alone on its row.
- **The site is now five pages and the sessions.** Home, Learn (with the two
  tracks and the glossary), Build → Repositories, Compete, About. Worth a look
  at whether that is the site you want before it goes anywhere.
- **The Figma snapshots are behind the site.** They still show the old track
  names and the old homepage, because they were exported before batch 4. A
  fresh `npm run figma:export` will catch them up when the pages settle.

## Waiting on the client

- The EFG ONE account address, for "Open an account".
- Where "Get your API key" should go.
- The video for the What-is-Younit frame.
- @nouranallam's confirmation of the What-is-Younit copy.
- Which images from the branding deck go where, and their licence.
- The palette: three swatches in the deck differ from the tokens on the site.
