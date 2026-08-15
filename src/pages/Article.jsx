import { useParams } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import MarkComplete from '../components/learn/MarkComplete.jsx'
import { Button, PillRow } from '../components/ui/Button.jsx'
import { SnapshotCard } from '../components/ui/Card.jsx'
import { Display, Micro, PageHeading, Rule, Section } from '../components/ui/Pieces.jsx'
import {
  authorsOf,
  findDoc,
  formatDate,
  neighbours,
  sessionHtmlFor,
} from '../lib/content.js'

const CRUMBS = {
  foundation: { label: 'Foundation Series', root: '/learn', rootLabel: 'Learn' },
  'algo-track': { label: 'Algo Track', root: '/learn', rootLabel: 'Learn' },
  'deep-dives': { label: 'Deep Dives', root: '/learn', rootLabel: 'Learn' },
  editorial: { label: 'Editorial', root: '/editorial', rootLabel: 'Editorial' },
}

/** Only these live under /learn. `editorial` has its own top-level route. */
const LEARN_COLLECTIONS = new Set(['foundation', 'algo-track', 'deep-dives'])

/** One cell per session in the track, the current one filled. */
function TrackProgress({ index, total }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', gap: 4, marginTop: 24 }}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          style={{
            width: 26,
            height: 26,
            borderRadius: 4,
            border: '1px solid var(--yn-ink)',
            background: i === index ? 'var(--yn-amber)' : 'transparent',
          }}
        />
      ))}
    </div>
  )
}

export default function Article() {
  const params = useParams()

  // /editorial/:slug carries no :collection segment.
  const collection = params.collection ?? 'editorial'

  // The route pattern is /learn/:collection/:slug, so without this guard any
  // collection resolves under /learn: /learn/showcase/<slug> would render an
  // article whose breadcrumb points at a page that does not exist, and every
  // editorial post would be reachable at a second URL under /learn.
  const allowed = params.collection ? LEARN_COLLECTIONS.has(params.collection) : true
  const doc = allowed ? findDoc(collection, params.slug) : null
  if (!doc) return <NotFound />

  const crumb = CRUMBS[collection] ?? { label: collection, root: '/learn', rootLabel: 'Learn' }
  const { index, total, prev, next } = neighbours(collection, doc.slug)
  const authors = authorsOf(doc)
  const deck = sessionHtmlFor(collection, doc.slug)
  const isTrack = collection === 'foundation' || collection === 'algo-track'
  const base = collection === 'editorial' ? '/editorial' : `/learn/${collection}`

  return (
    <Page title={doc.title}>
      <Section style={{ paddingBottom: 40 }}>
        <Breadcrumb
          trail={[
            { label: crumb.rootLabel, to: crumb.root },
            {
              label: crumb.label,
              to: collection === 'editorial' ? undefined : `/learn/${collection}`,
            },
            ...(isTrack && index >= 0
              ? [{ label: `Session ${index + 1} of ${total}` }]
              : []),
          ]}
        />

        <PageHeading sub={doc.description}>{doc.title}</PageHeading>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          <Micro>{doc.duration || `${doc.readingMinutes} min read`}</Micro>
          {authors.map((person) => (
            <Micro key={person.name}>{person.name}</Micro>
          ))}
          {doc.publishedAt ? <Micro>{formatDate(doc.publishedAt)}</Micro> : null}
        </div>

        {isTrack && total > 0 ? <TrackProgress index={index} total={total} /> : null}
      </Section>

      <Section style={{ paddingTop: 0 }}>
        <div className="yn-prose" dangerouslySetInnerHTML={{ __html: doc.html }} />
      </Section>

      {deck ? (
        <Section style={{ paddingTop: 0 }}>
          <SnapshotCard tone="blue">
            <Display size="h3" as="h2">
              The full session
            </Display>
            <p style={{ margin: 0, fontSize: 'var(--yn-body-size)', lineHeight: 1.6 }}>
              This session has a complete illustrated deck — the same one used to teach
              it. It fills the screen, and closes back to this page.
            </p>
            <div className="yn-cta-row">
              <Button tone="white" to={`/learn/${collection}/${doc.slug}/deck`}>
                Open the session deck
              </Button>
            </div>
          </SnapshotCard>
        </Section>
      ) : null}

      {isTrack ? (
        <Section style={{ paddingTop: 0 }}>
          <MarkComplete slug={doc.slug} />
        </Section>
      ) : null}

      {prev || next ? (
        <>
          <Rule animate={false} />
          <Section>
            <div style={{ display: 'grid', gap: 12 }}>
              {prev ? (
                <PillRow to={`${base}/${prev.slug}`} meta={isTrack ? "Previous session" : "Previous"}>
                  {prev.title}
                </PillRow>
              ) : null}
              {next ? (
                <PillRow to={`${base}/${next.slug}`} meta={isTrack ? "Next session" : "Next"}>
                  {next.title}
                </PillRow>
              ) : null}
            </div>
          </Section>
        </>
      ) : null}
    </Page>
  )
}
