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
import Photo from "../components/ui/Photo.jsx";
import photoJpg from "../assets/desk-code.jpg";
import photoWebp from "../assets/desk-code.webp";

/* Shared inline styles that recur across sections. ---------------------------- */

const LABEL = {
  fontSize: 11,
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

/** Heading, card, caption — one column of the journey row. */
const COLUMN = {
  display: "flex",
  flexDirection: "column",
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
            lineHeight: 1.15,
            margin: "0 0 4px",
          }}
        >
          Egypt&apos;s open initiative for Capital Markets
        </p>

        <h1
          data-type=""
          className="yn-display"
          style={{
            fontSize: "var(--yn-hero)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            margin: "0 0 28px",
          }}
        >
          Learn, Build, Compete.
        </h1>

        <p
          data-type=""
          style={{
            fontSize: 15,
            color: "var(--yn-grey-dark)",
            margin: "0 0 40px",
            maxWidth: "46ch",
          }}
        >
          Not a sandbox. not a toy, the actual api, open to anyone willing to
          learn.
        </p>

        <div data-cta="" className="yn-cta-row">
          <Button tone="amber" href="#journey">
            Start the foundation series
          </Button>
          <Button tone="blue" href="#api">
            Explore the api
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
  const cells = Array.from({ length: 10 }, (_, i) => {
    const topRow = i < 5;
    const filled = topRow && i > 0;
    return {
      key: i,
      filled,
      style: {
        border: "1px solid #000",
        borderLeft: i % 5 === 0 ? "1px solid #000" : 0,
        borderTop: topRow ? "1px solid #000" : 0,
        background: filled ? "#FFD05A" : "#fff",
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
            Progress rate
            <br />
            steady progress
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
        background: "#fff",
        border: "1px solid #000",
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
      <g stroke="#000" strokeWidth="2">
        <rect x="2" y="62" width="42" height="36" fill="#fff" />
        <rect x="44" y="42" width="42" height="56" fill="#fff" />
        <rect x="86" y="22" width="42" height="76" fill="#fff" />
        <rect x="86" y="2" width="42" height="34" fill="#A3C6D7" />
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
  return (
    <section id="journey" style={{ padding: "var(--yn-section) 0" }}>
      {/* One grid: headings, cards and captions are rows of the same three
          columns, exactly as the template lays them out. */}
      <div
        data-reveal=""
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
          gap: 40,
          alignItems: "stretch",
        }}
      >
        <div style={COLUMN}>
          <Display size="h2-journey">01. Learn</Display>

          <SnapshotCard tone="blue" style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Badge>Learning Snapshot</Badge>
            </div>
            <div>
              <div style={{ ...LABEL, paddingTop: 12, paddingBottom: 12 }}>
                Lessons completed
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
            <hr style={{ border: 0, borderTop: "1px solid #000", margin: 0 }} />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ ...LABEL, lineHeight: 1.4 }}>
                Learning
                <br />
                progress
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
              Continue lesson
            </CardCta>
          </SnapshotCard>

          <p style={CAPTION}>
            from what a stock is to writing your first trading algorithm -
            through the foundation series and the algo track.
          </p>
        </div>

        <div style={COLUMN}>
          <Display size="h2-journey">02. Build</Display>

          <SnapshotCard tone="purple" style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Badge>Builder Snapshot</Badge>
            </div>
            <div>
              <div style={{ ...LABEL, paddingTop: 12, paddingBottom: 12 }}>
                Active strategy
              </div>
              <div
                data-count=""
                className="yn-display"
                style={{ fontSize: "var(--yn-stat)", lineHeight: 1.05 }}
              >
                12
              </div>
            </div>
            <hr style={{ border: 0, borderTop: "1px solid #000", margin: 0 }} />
            <div>
              <div style={LABEL}>Backtest return</div>
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
              <div style={{ ...LABEL, marginTop: 6 }}>Backtest return</div>
            </div>
            <div
              data-seq=""
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <FlowChip glyph="step" line1="PRICE" line2="&gt;MA50" />
              <span style={{ fontSize: 13 }}>→</span>
              <FlowChip glyph="bar" line1="VOLUME" line2="+20%" />
              <span style={{ fontSize: 13 }}>→</span>
              <FlowChip glyph="step" line1="BUY" line2="POSITION" />
            </div>
            <CardCta tone="blue" href="#api">
              Run strategy
            </CardCta>
          </SnapshotCard>

          <p style={CAPTION}>
            run a strategy on live egx data - or build the tool, dashboard or
            agent you wish existed.
          </p>
        </div>

        <div style={COLUMN}>
          <Display size="h2-journey">03. Compete</Display>

          <SnapshotCard tone="amber" style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Badge>Competition Snapshot</Badge>
            </div>
            <div>
              <div style={{ ...LABEL, paddingTop: 12, paddingBottom: 12 }}>
                Current rank
              </div>
              <div
                data-count=""
                className="yn-display"
                style={{ fontSize: "var(--yn-stat)", lineHeight: 1.05 }}
              >
                04/124
              </div>
            </div>
            <hr style={{ border: 0, borderTop: "1px solid #000", margin: 0 }} />
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                <div style={LABEL}>Rank change</div>
                <div
                  className="yn-display"
                  style={{ fontSize: "var(--yn-stat-2)", lineHeight: 1.1 }}
                >
                  <span data-count="">5</span>{" "}
                  <span style={{ fontSize: 34 }}>↑</span>
                </div>
              </div>
              <RankSteps />
            </div>
            <CardCta tone="white" href="#editorial">
              See all ranks
            </CardCta>
          </SnapshotCard>

          <p style={CAPTION}>
            strategies go head to head on a public leaderboard -through seasons,
            competitions, and hackathons.
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

const TRANSCRIPT = [
  { who: "YOU", line: "WHAT IS THE PRICE OF CIB?" },
  { who: "AI", line: "CIB (COMI) IS TRADING AT EGP 134.50." },
  { who: "YOU", line: "PLACE A LIMIT BUY FOR 100 SHARES AT 135." },
  {
    who: "AI",
    line: "DONE - LIMIT BUY FOR 100 SHARES OF CIB AT EGP 135.00 (ORDER ORD_8F3A, OPEN) I'LL FLAG IT IF IT FILLS.",
  },
];

function PanelHead({ tone, children }) {
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
      <PanelBadge tone={tone}>The Api</PanelBadge>
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
  return (
    <section id="api" style={{ padding: "var(--yn-section) 0" }}>
      <Display size="h1" style={{ lineHeight: 1.05, margin: "0 0 10px" }}>
        Build on this,
        <br />
        The API, Two Ways
      </Display>
      <p
        className="yn-display"
        style={{
          fontSize: "var(--yn-h3)",
          lineHeight: 1.2,
          margin: "0 0 56px",
        }}
      >
        real prices, place orders, manage positions
        <br />
        in code, or in plain language
      </p>

      <div
        data-reveal=""
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(420px, 100%), 1fr))",
          gap: 56,
        }}
      >
        <div>
          <PanelHead tone="purple">
            reading a price and placing an order on egx - the whole thing, in a
            few lines.
          </PanelHead>
          <Panel tone="purple">
            <pre
              style={{
                fontFamily: "var(--yn-mono)",
                fontSize: 13,
                lineHeight: 1.75,
                whiteSpace: "pre-wrap",
              }}
            >
              {CODE}
            </pre>
          </Panel>
        </div>

        <div>
          <PanelHead tone="blue">
            or connect the efg mcp server to an ai agent and just ask.
          </PanelHead>
          <Panel
            tone="blue"
            seq
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {TRANSCRIPT.map((turn, i) => (
              <div key={turn.line}>
                <MonoChip>{turn.who}</MonoChip>
                <div
                  style={{
                    fontFamily: "var(--yn-mono)",
                    fontSize: 12,
                    letterSpacing: "0.02em",
                    lineHeight: 1.6,
                    margin:
                      i === TRANSCRIPT.length - 1 ? "8px 0 0" : "8px 0 8px",
                  }}
                >
                  {turn.line}
                </div>
                {i < TRANSCRIPT.length - 1 ? (
                  <hr
                    style={{
                      border: 0,
                      borderTop: "1px solid #000",
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

const KIND_LABELS = {
  newsletter: "Newsletter",
  commentary: "Commentary",
  profile: "Profile",
  explainer: "Explainer",
};

function tagFor(doc) {
  if (doc.collection === "deep-dives") return "Deep Dive";
  return KIND_LABELS[doc.kind] ?? KIND_LABELS.newsletter;
}

function Editorial() {
  const items = FEATURED.map((f) => ({
    ...f,
    doc: findDoc(f.collection, f.slug),
  })).filter((f) => f.doc);
  if (!items.length) return null;

  return (
    <section id="editorial" style={{ padding: "var(--yn-section) 0" }}>
      <Display size="h1">Editorial</Display>
      <p
        className="yn-display"
        style={{ fontSize: "var(--yn-h3)", margin: "0 0 48px" }}
      >
        Latest from the Hub
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
              tag={tagFor(doc)}
              tagTone={tone}
              title={doc.title}
              meta={[formatDate(doc.publishedAt), author]
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
  return (
    <div data-reveal="">
      <Photo
        webp={photoWebp}
        jpg={photoJpg}
        width={2624}
        height={875}
        alt="Two builders at a desk, one screen showing code"
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
    metaEnd: (
      <>
        Capstone
        <br />
        track
      </>
    ),
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
    metaEnd: (
      <>
        Seeking university
        <br />
        teams
      </>
    ),
    shape: "rotation: <sector> → <sector>  window: <Nd>",
  },
  {
    collection: "showcase",
    slug: "arabic-sentiment-egx",
    metaStart: <>Arabic - sentiment - egx</>,
    metaEnd: <>Built on efg api</>,
    shape: "score: <float>  label: <bull|bear>  ticker: <symbol>",
  },
];

function ProjectTracks() {
  const items = TRACKS.map((t) => ({
    ...t,
    doc: findDoc(t.collection, t.slug),
  })).filter((t) => t.doc);
  if (!items.length) return null;

  return (
    <section style={{ padding: "var(--yn-section) 0 104px" }}>
      <Display size="h1" style={{ margin: "0 0 48px" }}>
        Project tracks
        <br />
        opening for builders
      </Display>

      <div data-reveal="" style={THREE_UP}>
        {items.map((t) => (
          <TrackCard
            key={t.slug}
            to={`/build/${t.collection}/${t.slug}`}
            metaStart={t.metaStart}
            metaEnd={t.metaEnd}
            title={t.doc.title}
            shape={t.shape}
          />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

export default function Home() {
  useMotion("full");

  useEffect(() => {
    document.title = "Younit — Egypt's open initiative for capital markets";
  }, []);

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
