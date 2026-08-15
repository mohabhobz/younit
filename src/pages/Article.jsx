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
  readingTime,
  sessionHtmlFor,
} from '../lib/content.js'
import { useI18n } from '../lib/i18n.jsx'
import Prose from '../components/ui/Prose.jsx'

/**
 * `key` is the track; `rootKey` is the section it sits in. Editorial is its own
 * section, so it has no track above it — naming it twice would print the same
 * word either side of the separator.
 */
const CRUMBS = {
  foundation: { key: 'learn.foundationTitle', root: '/learn', rootKey: 'learn.title' },
  'algo-track': { key: 'learn.algoTrackTitle', root: '/learn', rootKey: 'learn.title' },
  'deep-dives': { key: 'learn.deepDivesTitle', root: '/learn', rootKey: 'learn.title' },
  editorial: { root: '/editorial', rootKey: 'nav.editorial' },
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
  const { t, locale } = useI18n()

  // /editorial/:slug carries no :collection segment.
  const collection = params.collection ?? 'editorial'

  // The route pattern is /learn/:collection/:slug, so without this guard any
  // collection resolves under /learn: /learn/showcase/<slug> would render an
  // article whose breadcrumb points at a page that does not exist, and every
  // editorial post would be reachable at a second URL under /learn.
  const allowed = params.collection ? LEARN_COLLECTIONS.has(params.collection) : true
  const doc = allowed ? findDoc(collection, params.slug, locale) : null
  if (!doc) return <NotFound />

  const crumb = CRUMBS[collection]
  const { index, total, prev, next } = neighbours(collection, doc.slug, locale)
  const authors = authorsOf(doc)
  const deck = sessionHtmlFor(collection, doc.slug)
  const isTrack = collection === 'foundation' || collection === 'algo-track'

  // Reading order, not list order.
  const [earlier, later] = isTrack ? [prev, next] : [next, prev]
  const base = collection === 'editorial' ? '/editorial' : `/learn/${collection}`

  return (
    <Page title={doc.title}>
      <Section style={{ paddingBottom: 40 }}>
        <Breadcrumb
          trail={[
            { label: t(crumb.rootKey), to: crumb.root },
            ...(crumb.key ? [{ label: t(crumb.key), to: `/learn/${collection}` }] : []),
            ...(isTrack && index >= 0
              ? [{ label: t('learn.sessionOf', { session: index + 1, total }) }]
              : []),
          ]}
        />

        <PageHeading sub={doc.description}>{doc.title}</PageHeading>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          <Micro>{doc.duration || readingTime(t, doc.readingMinutes)}</Micro>
          {authors.map((person) => (
            <Micro key={person.name}>{person.name}</Micro>
          ))}
          {doc.publishedAt ? <Micro>{formatDate(doc.publishedAt, locale)}</Micro> : null}
        </div>

        {isTrack && total > 0 ? <TrackProgress index={index} total={total} /> : null}
      </Section>

      <Section style={{ paddingTop: 0 }}>
        <Prose html={doc.html} />
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
                {t('learn.deckCta')}
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

      {/* A track reads forwards: the next session is the one after this in the
          list. A dated collection is listed newest first, so the one after this
          in the list is the older post — "previous" in time, not "next". */}
      {earlier || later ? (
        <>
          <Rule animate={false} />
          <Section>
            <div style={{ display: 'grid', gap: 12 }}>
              {earlier ? (
                <PillRow
                  to={`${base}/${earlier.slug}`}
                  meta={isTrack ? t('learn.prevSession') : t('common.previous')}
                >
                  {earlier.title}
                </PillRow>
              ) : null}
              {later ? (
                <PillRow
                  to={`${base}/${later.slug}`}
                  meta={isTrack ? t('learn.nextSession') : t('common.next')}
                >
                  {later.title}
                </PillRow>
              ) : null}
            </div>
          </Section>
        </>
      ) : null}
    </Page>
  )
}
