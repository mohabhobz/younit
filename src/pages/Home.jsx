import { useEffect } from "react";
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

        <h1
          data-type=""
          className="yn-display"
          style={{
            fontSize: "var(--yn-hero)",
            lineHeight: "var(--yn-lh-hero)",
            letterSpacing: "-0.02em",
            margin: "0 0 28px",
          }}
        >
          {t("home.headline")}
        </h1>

        <p
          data-type=""
          style={{
            fontSize: 'var(--yn-body-size)',
            color: "var(--yn-grey-dark)",
            margin: "0 0 40px",
            maxWidth: "46ch",
          }}
        >
          {t("home.subline")}
        </p>

        <div data-cta="" className="yn-cta-row">
          {/* The labels are marketing's; the destinations are not settled.
              Both keep the addresses they already had rather than being
              pointed somewhere invented — the account link belongs to EFG ONE
              and the key link to the page Raed drew, and neither has arrived. */}
          <Button tone="amber" href="#journey">
            {t("home.ctaFoundation")}
          </Button>
          <Button tone="blue" href="#api">
            {t("home.ctaApi")}
          </Button>
        </div>
      </div>

      {/* Purple, as the deck's own homepage draws it — the blue arches were
          ours. */}
      <ArchPyramid tone="purple" />
    </section>
  );
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
          <Display size="h2">{t("home.what.title")}</Display>
          <Display size="h2" style={{ marginBottom: 28 }}>
            {t("home.what.subtitle")}
          </Display>

          {["body1", "body2", "body3"].map((key) => (
            <p
              key={key}
              style={{
                fontSize: "var(--yn-body-size)",
                lineHeight: 1.7,
                color: "var(--yn-grey-dark)",
                margin: "0 0 18px",
                maxWidth: "58ch",
              }}
            >
              {t(`home.what.${key}`)}
            </p>
          ))}
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

/** The step between two chips, pointing the way the card is read. */
function Down() {
  return (
    <span aria-hidden="true" style={{ fontSize: "var(--yn-small)", textAlign: "center", lineHeight: 1 }}>
      ↓
    </span>
  )
}

function FlowChip({ glyph, line1, line2 }) {
  return (
    <div
      style={{
        // The size of what it holds, not a shape forced around it: one width
        // so the three line up, and the height hugs the glyph and its two
        // lines. The three stand in the middle of the column.
        width: 104,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        background: "var(--yn-white)",
        border: "1px solid var(--yn-ink)",
        borderRadius: 8,
        padding: "10px 8px",
        textAlign: "center",
      }}
    >
      <Glyph kind={glyph} width={34} height={26} />
      <div
        style={{
          fontFamily: "var(--yn-mono)",
          fontSize: 9,
          letterSpacing: "0.04em",
          lineHeight: 1.3,
        }}
      >
        {line1}
        <br />
        {line2}
      </div>
    </div>
  );
}

function RankSteps() {
  return (
    <svg
      data-rise=""
      viewBox="0 0 132 100"
      style={{ width: 150, height: 114, flex: "0 0 auto" }}
      aria-hidden="true"
    >
      <g stroke="var(--yn-ink)" strokeWidth="2">
        <rect x="2" y="62" width="42" height="36" fill="var(--yn-white)" />
        <rect x="44" y="42" width="42" height="56" fill="var(--yn-white)" />
        <rect x="86" y="22" width="42" height="76" fill="var(--yn-white)" />
        <rect x="86" y="2" width="42" height="34" fill="var(--yn-blue)" />
      </g>
    </svg>
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
            {/* A strategy reads downwards: a rule, then a signal, then a
                position. Standing the three on top of each other turns the
                arrows the same way and gives the card its middle back — the
                counts that used to fill it are gone. */}
            <div
              data-seq=""
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                paddingTop: 12,
              }}
            >
              <FlowChip glyph="step" line1={t("home.flow.price")} line2={t("home.flow.priceRule")} />
              <Down />
              <FlowChip glyph="bar" line1={t("home.flow.volume")} line2={t("home.flow.volumeRule")} />
              <Down />
              <FlowChip glyph="step" line1={t("home.flow.buy")} line2={t("home.flow.buyRule")} />
            </div>
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
            {/* The card is as tall as the two beside it and holds less, so
                what it holds sits in the middle of it rather than against the
                top. */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <div>
                <div style={{ ...LABEL, paddingBottom: 12 }}>
                  {t("home.journey.currentRank")}
                </div>
                <div
                  data-count=""
                  className="yn-display"
                  style={{ fontSize: "var(--yn-stat)", lineHeight: 1.05 }}
                >
                  04/124
                </div>
              </div>
              <hr style={{ border: 0, borderTop: "1px solid var(--yn-ink)", margin: 0 }} />
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div style={LABEL}>{t("home.journey.rankChange")}</div>
                  <div
                    className="yn-display"
                    style={{ fontSize: "var(--yn-stat-2)", lineHeight: 1.1 }}
                  >
                    <span data-count="">5</span>{" "}
                    <span style={{ fontSize: 'var(--yn-eyebrow)' }}>↑</span>
                  </div>
                </div>
                <RankSteps />
              </div>
            </div>
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
        <Journey />
      </main>

      <SiteFooter tone="brand" />
    </div>
  );
}
