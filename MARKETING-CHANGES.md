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

## To raise with marketing

- **The Build card has an empty middle.** Removing the two figures left the card
  taller than what is now in it. Centring the row of chips did not close the
  gap, because the card's height is set by the Learn and Compete cards beside
  it. It needs something in it or a shorter card, and both are marketing's
  choice, not ours.
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
