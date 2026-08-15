import { useEffect } from "react";
import useMotion from "../lib/useMotion.js";
import { BrandDefs, ArchPyramid, Glyph } from "../brand/marks.jsx";
import SiteHeader from "../components/layout/SiteHeader.jsx";
import SiteFooter from "../components/layout/SiteFooter.jsx";
import { Button } from "../components/ui/Button.jsx";
import {
  EditorialCard,
  Panel,
  SnapshotCard,
  TrackCard,
} from "../components/ui/Card.jsx";
import {
  Badge,
  Display,
  MonoChip,
  PanelBadge,
  Rule,
} from "../components/ui/Pieces.jsx";
import { findDoc, formatDate, peopleById } from "../lib/content.js";
import { useI18n } from "../lib/i18n.jsx";
import Photo from "../components/ui/Photo.jsx";
import photoJpg from "../assets/desk-code.jpg";
import photoWebp from "../assets/desk-code.webp";

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
          <Button tone="amber" href="#journey">
            {t("home.ctaFoundation")}
          </Button>
          <Button tone="blue" href="#api">
            {t("home.ctaApi")}
          </Button>
        </div>
      </div>

      <ArchPyramid tone="blue" />
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

function FlowChip({ glyph, line1, line2 }) {
  return (
    <div
      style={{
        flex: 1,
        background: "var(--yn-white)",
        border: "1px solid var(--yn-ink)",
        borderRadius: 8,
        padding: "8px 6px",
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

function CardCta({ children, tone, href }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "auto",
        paddingTop: 6,
      }}
    >
      <Button tone={tone} size="sm" href={href}>
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
            <div>
              <div style={{ ...LABEL, paddingTop: 12, paddingBottom: 12 }}>
                {t("home.journey.lessonsCompleted")}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  data-count=""
                  className="yn-display"
                  style={{ fontSize: "var(--yn-stat)", lineHeight: 1.05 }}
                >
                  03/08
                </span>
                <Glyph data-draw="" />
              </div>
            </div>
            <hr style={{ border: 0, borderTop: "1px solid var(--yn-ink)", margin: 0 }} />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ ...LABEL, lineHeight: 1.4 }}>
                {t("home.journey.learningProgress")}
              </div>
              <span
                data-count=""
                className="yn-display"
                style={{ fontSize: "var(--yn-stat-2)", lineHeight: 1 }}
              >
                68%
              </span>
            </div>
            <ProgressGrid />
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
            <div>
              <div style={{ ...LABEL, paddingTop: 12, paddingBottom: 12 }}>
                {t("home.journey.activeStrategy")}
              </div>
              <div
                data-count=""
                className="yn-display"
                style={{ fontSize: "var(--yn-stat)", lineHeight: 1.05 }}
              >
                12
              </div>
            </div>
            <hr style={{ border: 0, borderTop: "1px solid var(--yn-ink)", margin: 0 }} />
            <div>
              <div style={LABEL}>{t("home.journey.backtestReturn")}</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  data-count=""
                  className="yn-display"
                  style={{ fontSize: "var(--yn-stat-2)", lineHeight: 1.05 }}
                >
                  +18.4%
                </span>
                <Glyph data-draw="" />
              </div>
              <div style={{ ...LABEL, marginTop: 6 }}>{t("home.journey.backtestReturn")}</div>
            </div>
            <div
              data-seq=""
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <FlowChip glyph="step" line1={t("home.flow.price")} line2={t("home.flow.priceRule")} />
              <span style={{ fontSize: 'var(--yn-small)' }}>→</span>
              <FlowChip glyph="bar" line1={t("home.flow.volume")} line2={t("home.flow.volumeRule")} />
              <span style={{ fontSize: 'var(--yn-small)' }}>→</span>
              <FlowChip glyph="step" line1={t("home.flow.buy")} line2={t("home.flow.buyRule")} />
            </div>
            <CardCta tone="blue" href="#api">
              {t("home.journey.runStrategy")}
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
            <div>
              <div style={{ ...LABEL, paddingTop: 12, paddingBottom: 12 }}>
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
/* The API, two ways                                                          */
/* -------------------------------------------------------------------------- */

const CODE = `from efg import Client

client = Client(api_key="YOUR_KEY")

# where's CIB trading right now?
quote = client.quote("COMI")
print(quote.last)

# Buy 100 shares, limit at 135
order = client.buy("COMI", qty=100, limit=135.00)
print(order.id, order.status)`;

function PanelHead({ tone, children }) {
  const { t } = useI18n()

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        marginBottom: 16,
        flexWrap: "wrap",
      }}
    >
      <PanelBadge tone={tone}>{t("home.api.badge")}</PanelBadge>
      <span
        style={{
          fontSize: 14,
          color: "var(--yn-grey-dark)",
          lineHeight: 1.4,
          flex: 1,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function ApiTwoWays() {
  const { t } = useI18n()

  // The panel's point is that the same thing can be said in plain language —
  // so the transcript is in the reader's language, not always in English.
  const transcript = t("home.transcript")

  return (
    <section id="api" style={{ padding: "var(--yn-section) 0" }}>
      <Display size="h1" style={{ lineHeight: 1.05, margin: "0 0 10px" }}>
        {t("home.api.titleLine1")}
        <br />
        {t("home.api.titleLine2")}
      </Display>
      <p
        className="yn-display"
        style={{
          fontSize: "var(--yn-h3)",
          lineHeight: 1.2,
          margin: "0 0 56px",
        }}
      >
        {t("home.api.sublineLine1")}
        <br />
        {t("home.api.sublineLine2")}
      </p>

      <div
        data-reveal=""
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(420px, 100%), 1fr))",
          gap: 56,
          alignItems: "stretch",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <PanelHead tone="purple">
            {t("home.api.codeLead")}
          </PanelHead>
          <Panel tone="purple" style={{ flex: 1 }}>
            <pre
              style={{
                fontFamily: "var(--yn-mono)",
                fontSize: 'var(--yn-small)',
                lineHeight: 1.75,
                whiteSpace: "pre-wrap",
              }}
            >
              {CODE}
            </pre>
          </Panel>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <PanelHead tone="blue">
            {t("home.api.agentLead")}
          </PanelHead>
          <Panel
            tone="blue"
            seq
            style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}
          >
            {transcript.map((turn, i) => (
              <div key={turn.line}>
                <MonoChip>{turn.who}</MonoChip>
                <div
                  style={{
                    fontFamily: "var(--yn-mono)",
                    fontSize: 12,
                    letterSpacing: "0.02em",
                    lineHeight: 1.6,
                    margin:
                      i === transcript.length - 1 ? "8px 0 0" : "8px 0 8px",
                  }}
                >
                  {turn.line}
                </div>
                {i < transcript.length - 1 ? (
                  <hr
                    style={{
                      border: 0,
                      borderTop: "1px solid var(--yn-ink)",
                      margin: 0,
                    }}
                  />
                ) : null}
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Editorial, photo band, project tracks                                      */
/* -------------------------------------------------------------------------- */

/**
 * The three the design calls out, resolved against the real content files. The
 * tag is derived from each document's own collection and kind — hard-coding it
 * is how the deep dive ended up labelled "Newsletter" and the newsletter
 * "Deep Dive".
 */
const FEATURED = [
  { collection: "deep-dives", slug: "efg-api-what-you-can-build", tone: "purple" },
  { collection: "deep-dives", slug: "egx-liquidity-why-stocks-dont-move", tone: "amber" },
  { collection: "editorial", slug: "2026-04-week-2", tone: "blue" },
];

function tagFor(doc, t) {
  if (doc.collection === "deep-dives") return t("learn.deepDiveTag");
  return t(`editorial.kinds.${doc.kind ?? "newsletter"}`);
}

function Editorial() {
  const { t, locale } = useI18n()

  const items = FEATURED.map((f) => ({
    ...f,
    doc: findDoc(f.collection, f.slug, locale),
  })).filter((f) => f.doc);
  if (!items.length) return null;

  return (
    <section id="editorial" style={{ padding: "var(--yn-section) 0" }}>
      <Display size="h1">{t("home.editorial.title")}</Display>
      <p
        className="yn-display"
        style={{ fontSize: "var(--yn-h3)", margin: "0 0 48px" }}
      >
        {t("home.editorial.subtitle")}
      </p>

      <div data-reveal="" style={THREE_UP}>
        {items.map(({ doc, tone, collection }) => {
          const author = (doc.authors ?? [])
            .map((id) => peopleById[id]?.name)
            .filter(Boolean)[0];
          const base =
            collection === "editorial" ? "/editorial" : "/learn/deep-dives";
          return (
            <EditorialCard
              key={doc.slug}
              to={`${base}/${doc.slug}`}
              tag={tagFor(doc, t)}
              tagTone={tone}
              title={doc.title}
              meta={[formatDate(doc.publishedAt, locale), author]
                .filter(Boolean)
                .join(" • ")}
            />
          );
        })}
      </div>
    </section>
  );
}

function PhotoBand() {
  const { t } = useI18n()

  return (
    <div data-reveal="">
      <Photo
        webp={photoWebp}
        jpg={photoJpg}
        width={2624}
        height={875}
        alt={t("compete.photoAlt")}
      />
    </div>
  );
}

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

function ProjectTracks() {
  const { t, locale } = useI18n()

  const items = TRACKS.map((track) => ({
    ...track,
    doc: findDoc(track.collection, track.slug, locale),
  })).filter((track) => track.doc);
  if (!items.length) return null;

  return (
    <section style={{ padding: "var(--yn-section) 0 104px" }}>
      <Display size="h1" style={{ margin: "0 0 48px" }}>
        {t("home.tracks.titleLine1")}
        <br />
        {t("home.tracks.titleLine2")}
      </Display>

      <div data-reveal="" style={THREE_UP}>
        {items.map((track) => (
          <TrackCard
            key={track.slug}
            to={`/build/${track.collection}/${track.slug}`}
            metaStart={track.metaStart}
            metaEnd={t(track.metaEnd)}
            title={track.doc.title}
            shape={track.shape}
          />
        ))}
      </div>
    </section>
  );
}

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
        overflowX: "hidden",
      }}
    >
      <BrandDefs />
      <SiteHeader tone="blue" />

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
        <Journey />
        <Rule />
        <ApiTwoWays />
        <Rule />
        <Editorial />
        <PhotoBand />
        <ProjectTracks />
      </main>

      <SiteFooter tone="blue" />
    </div>
  );
}
