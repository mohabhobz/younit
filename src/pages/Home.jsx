import { useEffect, useState } from "react";
import useMotion from "../lib/useMotion.js";
import { BrandDefs, ArchPyramid } from "../brand/marks.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";
import { Button } from "../components/ui/Button.jsx";
import {
  Panel,
  SnapshotCard,
} from "../components/ui/Card.jsx";
import {
  Badge,
  Display,
  Rule,
} from "../components/ui/Pieces.jsx";
import { useI18n } from "../lib/i18n.jsx";
import Photo from "../components/ui/Photo.jsx";
import Clip from "../components/ui/Clip.jsx";
import whatMp4 from "../assets/what-younit.mp4";
import whatPoster from "../assets/what-younit-poster.jpg";
import whatWebm from "../assets/what-younit.webm";
import buildJpg from "../assets/build-desk.jpg";
import buildWebp from "../assets/build-desk.webp";
import competeJpg from "../assets/compete-screen.jpg";
import competeWebp from "../assets/compete-screen.webp";
import deskJpg from "../assets/desk-code.jpg";
import deskWebp from "../assets/desk-code.webp";

/* Shared inline styles that recur across sections. ---------------------------- */

const CAPTION = {
  textAlign: "center",
  fontSize: 14,
  color: "var(--yn-grey-dark)",
  margin: "8px 0 0",
  lineHeight: 1.55,
};

/**
 * Heading, card, caption — one column of the journey row.
 *
 * The column takes its rows from the row grid rather than laying them out
 * itself, so the three headings share a row, the three cards share a row and
 * the three captions share a row. Without that, a caption that runs to three
 * lines instead of two steals the height from the card above it and the cards
 * stop lining up. Below the breakpoint the row is one column wide and each
 * column simply stacks.
 */
const COLUMN = {
  display: "grid",
  gridTemplateRows: "subgrid",
  gridRow: "span 3",
  gap: 16,
};

const THREE_UP = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
  gap: 36,
};

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

function Hero() {
  const { t } = useI18n()

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "var(--yn-hero-cols)",
        gap: 48,
        alignItems: "center",
        padding: "var(--yn-section) 0 88px",
      }}
    >
      <div>
        {/* Marketing's note, twice now: the layout is too bulky, and MENA's
            First API Trading Platform should be bigger than the sentence under
            it. So the claim is the headline of the page — the h1, at the hero
            size — and what the platform lets you do follows it at half that,
            which also takes the long sentence from four lines down to three. */}
        <h1
          data-type=""
          className="yn-display yn-hero-claim"
          style={{
            // The display face is Light everywhere else, which at this size
            // read thinner than the claim deserves. Regular is one step up —
            // the weight marketing asked for, and the heaviest Poppins cut the
            // site loads, so it costs nothing to download.
            //
            // The size and the measure are in the stylesheet, because Arabic
            // needs its own and a style attribute cannot carry a language.
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            margin: "0 0 14px",
          }}
        >
          {t("home.eyebrow")}
        </h1>

        <p
          data-type=""
          className="yn-display"
          style={{
            fontSize: "var(--yn-eyebrow)",
            lineHeight: "var(--yn-lh-eyebrow)",
            margin: "0 0 36px",
            maxWidth: "34ch",
          }}
        >
          {t("home.headline")}
        </p>

        <div data-cta="" className="yn-cta-row">
          {/* The account button carries the app shops. The key keeps the
              address the account button used to have — the three tracks —
              because the page that hands out an API key does not exist yet
              and a button must not point at a guess. */}
          <OpenAnAccount />
          <Button tone="blue" href="#journey">
            {t("home.ctaApi")}
          </Button>
        </div>

        <p
          style={{
            fontSize: "var(--yn-small)",
            // Without this the face's own default leading applies and the
            // three lines touch, directly under the hero we just re-set.
            lineHeight: 1.6,
            color: "var(--yn-grey-dark)",
            margin: "18px 0 0",
            maxWidth: "48ch",
          }}
        >
          {t("home.appNote")}
        </p>
      </div>

      {/* The block forms stood here for a day. They are the branding deck's
          own artwork and they are staying in the repository for the page they
          are meant for, but the arches come back to the homepage — and they
          keep moving rather than settling, which is what was asked for both
          here and on Build. They wear the header's colour, from the same
          token, so the two can never drift apart. */}
      <ArchPyramid tone="chrome" />
    </section>
  );
}

const BODY = {
  fontSize: "var(--yn-body-size)",
  lineHeight: 1.7,
  color: "var(--yn-grey-dark)",
  margin: "0 0 18px",
  maxWidth: "58ch",
};

/**
 * The rest of a long passage, and the button that asks for it.
 *
 * Marketing's note was that the page reads as a wall. So the first paragraph
 * stands and the remainder waits behind a word — and it is in the markup either
 * way, so a reader who cannot use the button still meets the whole text and a
 * search engine still reads it.
 */
function More({ label, less, children }) {
  const [open, setOpen] = useState(false)
  const id = "yn-more-" + label.replace(/\s+/g, "-").toLowerCase()

  return (
    <>
      <div id={id} hidden={!open}>
        {children}
      </div>
      <button
        type="button"
        className="yn-more"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((was) => !was)}
      >
        {open ? less : label}
      </button>
    </>
  )
}

/**
 * An account is opened in the app, and which shop that is depends on the phone
 * in the reader's hand.
 *
 * The two buttons had their work the wrong way round: the key was fetching the
 * app and the account was scrolling the page. The note under them always said
 * it plainly — download EFG Hermes ONE, open the account, then come back for
 * the key — so "Open an account" is the button that goes to the shop.
 *
 * The reading happens after the page is drawn, never while it is being written:
 * on a server or in a snapshot there is no `navigator`, and a button that
 * guessed would send half its readers to the wrong shop. iPadOS calls itself a
 * Macintosh, so a touch point is what gives it away.
 */
const STORES = {
  ios: 'https://apps.apple.com/eg/app/efg-hermes-one/id1593210448',
  android: 'https://play.google.com/store/apps/details?id=com.efgh.oneapp',
}

function usePlatform() {
  const [platform, setPlatform] = useState(null)

  useEffect(() => {
    const ua = navigator.userAgent || ''
    const iPad = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1
    if (/iPhone|iPod|iPad/.test(ua) || iPad) setPlatform('ios')
    else if (/Android/.test(ua)) setPlatform('android')
    else setPlatform('desktop')
  }, [])

  return platform
}

function OpenAnAccount() {
  const { t } = useI18n()
  const platform = usePlatform()

  // One button, everywhere. An Android phone goes to Google Play; everything
  // else — an iPhone, an iPad, and a desktop, where there is no phone to read —
  // goes to the App Store page, which opens fine in a browser.
  const href = platform === 'android' ? STORES.android : STORES.ios

  return (
    <Button tone="amber" href={href}>
      {t("home.ctaFoundation")}
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/* What Younit is                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The introduction, above the three tracks.
 *
 * Marketing asked for it there: a reader who does not yet know what this is
 * cannot be sold three ways of using it. So the explanation comes first and the
 * journey follows.
 *
 * The video is a reserved frame rather than a player. There is no film yet, and
 * a box that says so is honest where an embedded player with nothing in it is
 * not — the moment there is one, its source goes in and the frame stays as it
 * is.
 */
function WhatIsYounit() {
  const { t } = useI18n()

  return (
    <section id="what" style={{ padding: "var(--yn-section) 0" }}>
      <div
        data-reveal=""
        style={{
          display: "grid",
          gridTemplateColumns: "var(--yn-hero-cols)",
          gap: 56,
          alignItems: "start",
        }}
      >
        <div>
          <Display size="h2" style={{ marginBottom: 28 }}>
            {t("home.what.title")}
          </Display>

          {/* Two paragraphs, both on the page. Read more was for a wall of
              text and this is not one. */}
          <p style={BODY}>{t("home.what.body1")}</p>
          <p style={{ ...BODY, margin: 0 }}>{t("home.what.body2")}</p>
        </div>

        {/* The grey box with a glyph in it stood here, waiting for a film.
            The film arrived: one idea becomes a rule, the rule sends signals,
            the signals run a strategy on their own, and it all returns to the
            single square it started from, so the ten seconds loop without a
            seam. */}
        <Clip
          mp4={whatMp4}
          webm={whatWebm}
          poster={whatPoster}
          alt={t("home.what.videoAlt")}
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* How Younit works                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Seven steps, from downloading the app to building on the infrastructure.
 *
 * The first is on the page and the other six wait behind the button, for the
 * same reason the introduction does: marketing asked for the page not to read
 * as a wall of text.
 */
function HowItWorks() {
  const { t } = useI18n()
  const steps = t("home.how.steps")

  // A step is a card, and the cards fill the width. One column of text with
  // half the page empty beside it is what this was, and seven of them read as a
  // document rather than a path. As cards they read as steps: the number large
  // and pale at the top, the title, then the step itself.
  //
  // They were filled — blue, purple, amber, in the tracks' own order — for a
  // day. Marketing looked at the page whole and asked for them to be the card
  // About EFG Hermes is: an outline, no fill, on the page's own ground. Seven
  // filled boxes in a row were louder than the three tracks they sat above,
  // and the three are the point of the page.
  const step = (item, i) => (
    <div
      key={item.title}
      style={{
        border: "1px solid var(--yn-ink)",
        borderRadius: "var(--yn-r-card)",
        padding: "clamp(20px, 2.4vw, 28px)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        height: "100%",
      }}
    >
      <span
        className="yn-display"
        aria-hidden="true"
        style={{
          fontSize: "var(--yn-h2-journey)",
          lineHeight: 1,
          color: "var(--yn-ink)",
          opacity: 0.45,
        }}
      >
        {String(i + 1).padStart(2, "0")}
      </span>
      <div className="yn-display" style={{ fontSize: "var(--yn-card-title)", lineHeight: 1.2 }}>
        {item.title}
      </div>
      <p style={{ ...BODY, margin: 0, maxWidth: "42ch" }}>{item.body}</p>
    </div>
  )

  return (
    <section id="how" style={{ padding: "var(--yn-section) 0" }}>
      <div data-reveal="">
        {/* The title, then the sentence that sums the seven up, one under the
            other. Side by side they sat at two heights with a gap between
            them; stacked they read as one introduction. */}
        <div style={{ marginBottom: 36 }}>
          <Display size="h2">{t("home.how.title")}</Display>
          <p style={{ ...BODY, margin: "14px 0 0", maxWidth: "62ch" }}>
            {t("home.how.closing")}
          </p>
        </div>

        <div className="yn-steps">{steps.slice(0, 3).map((item, i) => step(item, i))}</div>

        <div style={{ marginTop: 20 }}>
          <More label={t("common.readMore")} less={t("common.readLess")}>
            <div className="yn-steps">{steps.slice(3).map((item, i) => step(item, i + 3))}</div>
          </More>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Who this is                                                                */
/* -------------------------------------------------------------------------- */

/**
 * About EFG Hermes.
 *
 * One panel, not two. The second said "About Younit", and marketing struck it
 * out: what Younit is has already been said further up the page, at length,
 * with a film beside it. The words here are the client's own, to the comma,
 * and they end on a working address for the press.
 *
 * The panel runs the full frame, at their asking. It was capped at its own
 * measure for a day — a bordered box with six hundred pixels of nothing beside
 * it — and the answer to that was to fill the box rather than to shrink it.
 */
function WhoWeAre() {
  const { t } = useI18n()
  const email = t("home.who.efgMediaEmail")
  const [before, after] = t("home.who.efgMedia").split("{email}")

  return (
    <section id="who" style={{ padding: "var(--yn-section) 0" }}>
      <div
        data-reveal=""
        style={{
          border: "1px solid var(--yn-ink)",
          borderRadius: "var(--yn-r-card)",
          padding: "clamp(22px, 3vw, 34px)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <Display size="h3" as="h2">
          {t("home.who.efgTitle")}
        </Display>
        <p style={{ ...BODY, margin: 0, maxWidth: "none" }}>{t("home.who.efgBody")}</p>
        <p style={{ ...BODY, margin: 0, maxWidth: "none" }}>
          {before}
          <a className="yn-navlink" href={`mailto:${email}`}>
            {email}
          </a>
          {after}
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Journey                                                                    */
/* -------------------------------------------------------------------------- */

/** 5 x 2 lattice. Shared edges are collapsed by dropping one border per cell. */
function ProgressGrid() {
  const { t } = useI18n()

  const cells = Array.from({ length: 10 }, (_, i) => {
    const topRow = i < 5;
    const filled = topRow && i > 0;
    return {
      key: i,
      filled,
      style: {
        border: "1px solid var(--yn-ink)",
        borderInlineStart: i % 5 === 0 ? "1px solid var(--yn-ink)" : 0,
        borderTop: topRow ? "1px solid var(--yn-ink)" : 0,
        background: filled ? "var(--yn-amber)" : "var(--yn-white)",
      },
    };
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gridAutoRows: 44,
      }}
    >
      {cells.map((c) =>
        c.key === 9 ? (
          <div
            key={c.key}
            style={{
              ...c.style,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 7,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--yn-grey-dark)",
              lineHeight: 1.3,
            }}
          >
            {t("home.journey.progressRate")}
            <br />
            {t("home.journey.steadyProgress")}
          </div>
        ) : (
          <div
            key={c.key}
            data-cell={c.filled ? "" : undefined}
            style={c.style}
          />
        ),
      )}
    </div>
  );
}

function CardCta({ children, tone, href, to }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "auto",
        paddingTop: 6,
      }}
    >
      {/* `to` is a page of this site and goes through the router, which
          keeps the language prefix; `href` is an anchor on this one. */}
      <Button tone={tone} size="sm" href={href} to={to}>
        {children}
      </Button>
    </div>
  );
}

function Journey() {
  const { t } = useI18n()

  return (
    <section id="journey" style={{ padding: "var(--yn-section) 0" }}>
      {/* One grid: headings, cards and captions are rows of the same three
          columns, exactly as the template lays them out. The three rows are
          declared here and the columns inherit them, so everything on a row is
          the same height as its neighbours. */}
      <div
        data-reveal=""
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
          gridTemplateRows: "auto 1fr auto",
          gap: 40,
          alignItems: "stretch",
        }}
      >
        <div style={COLUMN}>
          <Display size="h2-journey">{t("home.journey.learn")}</Display>

          <SnapshotCard tone="blue" style={{ height: "100%" }}>
            <div className="yn-card-badge">
              <Badge>{t("home.journey.learningSnapshot")}</Badge>
            </div>
            {/* No counter and no progress bar: there is no tracker behind
                them yet, and a number nobody is keeping is a promise the site
                cannot make. Marketing asked for all three cards to read at the
                same weight, so the line that was set as a display title is now
                a paragraph like the two beside it — and the words are theirs. */}
            <div className="yn-card-slot">
              <p style={{ fontSize: "var(--yn-body-size)", lineHeight: 1.6, margin: 0 }}>
                {t("home.journey.learnerBody")}
              </p>
            </div>
            <Photo
              webp={deskWebp}
              jpg={deskJpg}
              width={2624}
              height={875}
              ratio="4 / 3"
              radius="tile"
              alt={t("home.journey.learnPhotoAlt")}
            />
            {/* Was `#api`, which is not on this page any more, so the button
                did nothing. It now goes to Learn — the card's own section,
                and this site's own page, not an address we invented. */}
            <CardCta tone="white" to="/learn">
              {t("home.journey.continueLesson")}
            </CardCta>
          </SnapshotCard>

          <p style={CAPTION}>
            {t("home.journey.learnCaption")}
          </p>
        </div>

        <div style={COLUMN}>
          <Display size="h2-journey">{t("home.journey.build")}</Display>

          <SnapshotCard tone="purple" style={{ height: "100%" }}>
            <div className="yn-card-badge">
              <Badge>{t("home.journey.builderSnapshot")}</Badge>
            </div>
            {/* The counts are gone. What is left is the shape of a strategy —
                a rule, a signal, a position — which is the thing being offered
                rather than a figure standing in for it. */}
            {/* The three chips are gone — marketing asked for the icons off
                and this line on — and the card carries a photograph like the
                two beside it. */}
            <div className="yn-card-slot">
              <p style={{ fontSize: "var(--yn-body-size)", lineHeight: 1.6, margin: 0 }}>
                {t("home.journey.builderBody")}
              </p>
            </div>
            <Photo
              webp={buildWebp}
              jpg={buildJpg}
              width={1600}
              height={1200}
              ratio="4 / 3"
              radius="tile"
              alt={t("home.journey.buildPhotoAlt")}
            />
            <CardCta tone="blue" to="/build/repositories">
              {t("home.journey.getStarted")}
            </CardCta>
          </SnapshotCard>

          <p style={CAPTION}>
            {t("home.journey.buildCaption")}
          </p>
        </div>

        <div style={COLUMN}>
          <Display size="h2-journey">{t("home.journey.compete")}</Display>

          <SnapshotCard tone="amber" style={{ height: "100%" }}>
            <div className="yn-card-badge">
              <Badge>{t("home.journey.competitionSnapshot")}</Badge>
            </div>
            {/* The rank and the change are off the card, at marketing's asking.
                The card is no longer empty either: the competition has not
                opened, and this is the sentence they wrote to say so. */}
            <div className="yn-card-slot">
              <p style={{ fontSize: "var(--yn-body-size)", lineHeight: 1.6, margin: 0 }}>
                {t("home.journey.competitionBody")}
              </p>
            </div>
            <Photo
              webp={competeWebp}
              jpg={competeJpg}
              width={1600}
              height={1200}
              ratio="4 / 3"
              radius="tile"
              alt={t("home.journey.competePhotoAlt")}
            />
            {/* Was `#editorial`, and that section was removed months ago. It
                goes to Compete, which is the page that says the same thing
                this card now says: the competition has not opened yet. */}
            <CardCta tone="white" to="/compete">
              {t("home.journey.seeAllRanks")}
            </CardCta>
          </SnapshotCard>

          <p style={CAPTION}>
            {t("home.journey.competeCaption")}
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* The photograph                                                             */
/* -------------------------------------------------------------------------- */

/* Meta labels are design copy from the template; the titles and destinations
   resolve against the real content files. */
const TRACKS = [
  {
    collection: "capstones",
    slug: "arabic-financial-nlp-corpus",
    metaStart: (
      <>
        Arabic - financial - nlp -<br />
        corpus
      </>
    ),
    metaEnd: "home.trackMeta.capstone",
    shape: "sentiment: <float>  entity: <ticker>  source: <feed>",
  },
  {
    collection: "showcase",
    slug: "sector-rotation-tracker",
    metaStart: (
      <>
        Sector - rotation -<br />
        tracker
      </>
    ),
    metaEnd: "home.trackMeta.seeking",
    shape: "rotation: <sector> → <sector>  window: <Nd>",
  },
  {
    collection: "showcase",
    slug: "arabic-sentiment-egx",
    metaStart: <>Arabic - sentiment - egx</>,
    metaEnd: "home.trackMeta.builtOn",
    shape: "score: <float>  label: <bull|bear>  ticker: <symbol>",
  },
];

/* -------------------------------------------------------------------------- */

export default function Home() {
  const { t, locale } = useI18n();
  useMotion("full", locale);

  useEffect(() => {
    document.title = t("meta.siteTitle");
  }, [t]);

  return (
    <div
      style={{
        background: "var(--yn-grey)",
        minHeight: "100vh",
        overflowX: "clip",
      }}
    >
      <BrandDefs />
      <SiteHeader tone="brand" />

      <main
        id="top"
        style={{
          maxWidth: "var(--yn-frame)",
          margin: "0 auto",
          padding: "0 var(--yn-gutter)",
        }}
      >
        <Hero />
        <Rule />
        <WhatIsYounit />
        <Rule />
        <HowItWorks />
        <Rule />
        <Journey />
        <Rule />
        <WhoWeAre />
      </main>

      <SiteFooter tone="brand" />
    </div>
  );
}
