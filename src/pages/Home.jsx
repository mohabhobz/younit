import { useEffect, useState } from "react";
import useMotion from "../lib/useMotion.js";
import { BrandDefs, ArchPyramid, Glyph } from "../brand/marks.jsx";
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
import deskJpg from "../assets/desk-code.jpg";
import deskWebp from "../assets/desk-code.webp";

/* Shared inline styles that recur across sections. ---------------------------- */

const LABEL = {
  fontSize: 'var(--yn-micro)',
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--yn-ink-2)",
};

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
        <p
          data-type=""
          className="yn-display"
          style={{
            fontSize: "var(--yn-eyebrow)",
            lineHeight: "var(--yn-lh-eyebrow)",
            margin: "0 0 4px",
          }}
        >
          {t("home.eyebrow")}
        </p>

        {/* "Learn, Build, Compete." is in the row above and in the three
            sections below, so the headline is what the platform lets you do. */}
        <h1
          data-type=""
          className="yn-display"
          style={{
            fontSize: "var(--yn-h1)",
            lineHeight: "var(--yn-lh-h1)",
            letterSpacing: "-0.02em",
            margin: "0 0 36px",
            maxWidth: "18ch",
          }}
        >
          {t("home.headline")}
        </h1>

        <div data-cta="" className="yn-cta-row">
          <OpenAccount />
          {/* The key's destination is EFG's own page and has not arrived, so
              this keeps the address it had rather than one of my choosing. */}
          <Button tone="blue" href="#api">
            {t("home.ctaApi")}
          </Button>
        </div>

        <p
          style={{
            fontSize: "var(--yn-small)",
            color: "var(--yn-grey-dark)",
            margin: "18px 0 0",
            maxWidth: "48ch",
          }}
        >
          {t("home.appNote")}
        </p>
      </div>

      {/* Purple, as the deck's own homepage draws it — the blue arches were
          ours. */}
      <ArchPyramid tone="purple" />
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
 * Opening an account means downloading EFG Hermes ONE, and which shop that is
 * depends on the phone in the reader's hand.
 *
 * The reading happens after the page is drawn, not while it is being written:
 * on a server or in a snapshot there is no `navigator`, and a button that
 * guessed would send half its readers to the wrong shop. Until the answer is
 * known — and on a desktop, where it never will be — both shops are offered by
 * name, which is also what someone at a laptop needs.
 */
const STORES = {
  ios: 'https://apps.apple.com/eg/app/efg-hermes-one/id1593210448',
  android: 'https://play.google.com/store/apps/details?id=com.efgh.oneapp',
}

function usePlatform() {
  const [platform, setPlatform] = useState(null)

  useEffect(() => {
    const ua = navigator.userAgent || ''
    // iPadOS 13 and later say "Macintosh"; a touch point is what gives it away.
    const iPad = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1
    if (/iPhone|iPod|iPad/.test(ua) || iPad) setPlatform('ios')
    else if (/Android/.test(ua)) setPlatform('android')
    else setPlatform('desktop')
  }, [])

  return platform
}

function OpenAccount() {
  const { t } = useI18n()
  const platform = usePlatform()

  if (platform === 'ios' || platform === 'android') {
    return (
      <Button tone="amber" href={STORES[platform]}>
        {t("home.ctaFoundation")}
      </Button>
    )
  }

  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      <Button tone="amber" href={STORES.ios}>
        {t("home.appStore")}
      </Button>
      <Button tone="amber" href={STORES.android}>
        {t("home.googlePlay")}
      </Button>
    </span>
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

          <p style={BODY}>{t("home.what.body1")}</p>
          <More label={t("common.readMore")} less={t("common.readLess")}>
            <p style={BODY}>{t("home.what.body2")}</p>
          </More>
        </div>

        <div
          style={{
            aspectRatio: "16 / 9",
            borderRadius: "var(--yn-r-card)",
            border: "1px solid var(--yn-ink)",
            background: "var(--yn-chrome)",
            // The two rows of a grid share the height between them, which put
            // the glyph near the top and the words near the bottom. They are
            // one thing, so they sit together in the middle.
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <Glyph kind="step" width={64} height={46} />
          <span style={{ ...LABEL }}>{t("home.what.videoLabel")}</span>
        </div>
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

  const step = (item, i) => (
    <div key={item.title} style={{ display: "flex", gap: 16, margin: "0 0 22px" }}>
      <span className="yn-display" style={{ fontSize: "var(--yn-h3)", lineHeight: 1.1, opacity: 0.5 }}>
        {String(i + 1).padStart(2, "0")}
      </span>
      <div>
        <div className="yn-display" style={{ fontSize: "var(--yn-h3)", lineHeight: 1.2, marginBottom: 6 }}>
          {item.title}
        </div>
        <p style={{ ...BODY, margin: 0 }}>{item.body}</p>
      </div>
    </div>
  )

  return (
    <section id="how" style={{ padding: "var(--yn-section) 0" }}>
      <div data-reveal="">
        <Display size="h2" style={{ marginBottom: 28 }}>
          {t("home.how.title")}
        </Display>

        {step(steps[0], 0)}
        <More label={t("common.readMore")} less={t("common.readLess")}>
          {steps.slice(1).map((item, i) => step(item, i + 1))}
          <p style={{ ...BODY, marginTop: 24 }}>{t("home.how.closing")}</p>
        </More>
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Badge>{t("home.journey.learningSnapshot")}</Badge>
            </div>
            {/* No counter and no progress bar: there is no tracker behind
                them yet, and a number nobody is keeping is a promise the site
                cannot make. A line about what the track teaches, and a
                photograph of the thing itself. */}
            <div
              className="yn-display"
              style={{
                fontSize: "var(--yn-card-title)",
                lineHeight: 1.25,
                paddingTop: 12,
              }}
            >
              {t("home.journey.lessonsCompleted")}
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
            <CardCta tone="white" href="#api">
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Badge>{t("home.journey.builderSnapshot")}</Badge>
            </div>
            {/* The counts are gone. What is left is the shape of a strategy —
                a rule, a signal, a position — which is the thing being offered
                rather than a figure standing in for it. */}
            {/* The three chips are gone — marketing asked for the icons off
                and this line on. */}
            <p
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                fontSize: "var(--yn-body-size)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {t("home.journey.builderBody")}
            </p>
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Badge>{t("home.journey.competitionSnapshot")}</Badge>
            </div>
            {/* The rank and the change are off the card for now, at marketing's
                asking. What is left is what the section is called and the way
                in — no figures standing in for a leaderboard that has not
                opened. */}
            <div style={{ flex: 1 }} />
            <CardCta tone="white" href="#editorial">
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
      </main>

      <SiteFooter tone="brand" />
    </div>
  );
}
