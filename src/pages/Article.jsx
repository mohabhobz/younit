import { useParams } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import MarkComplete from '../components/learn/MarkComplete.jsx'
import { PillRow } from '../components/ui/Button.jsx'
import { Micro, PageHeading, Rule, Section } from '../components/ui/Pieces.jsx'
import { authorsOf, findDoc, formatDate, neighbours } from '../lib/content.js'
import { useI18n } from '../lib/i18n.jsx'
import Prose from '../components/ui/Prose.jsx'
import Contents from '../components/ui/Contents.jsx'

/**
 * `key` is the track; `rootKey` is the section it sits in. Editorial was here
 * too until marketing asked for that page to go, and this page went with it —
 * what is left is a lesson without a deck.
 */
const CRUMBS = {
  foundation: { key: 'learn.foundationTitle', root: '/learn', rootKey: 'learn.title' },
  'algo-track': { key: 'learn.algoTrackTitle', root: '/learn', rootKey: 'learn.title' },
}

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

  const collection = params.collection

  // The route pattern is /learn/:collection/:slug, so without this guard any
  // collection resolves under /learn: /learn/deep-dives/<slug> would render an
  // article whose breadcrumb points at a page that no longer exists.
  const crumb = CRUMBS[collection]
  const doc = crumb ? findDoc(collection, params.slug, locale) : null
  if (!doc) return <NotFound />

  const { index, total, prev, next } = neighbours(collection, doc.slug, locale)
  const authors = authorsOf(doc)

  // A track reads forwards: the next session is the one after this in the list.
  const [earlier, later] = [prev, next]
  const base = `/learn/${collection}`

  return (
    <Page title={doc.title} width={1120}>
      <Section style={{ paddingBottom: 40 }}>
        <Breadcrumb
          trail={[
            { label: t(crumb.rootKey), to: crumb.root },
            { label: t(crumb.key), to: `/learn/${collection}` },
            ...(index >= 0
              ? [{ label: t('learn.sessionOf', { session: index + 1, total }) }]
              : []),
          ]}
        />

        <PageHeading sub={doc.description} measure>
          {doc.title}
        </PageHeading>

        {/* No timing: marketing asked for them off every session. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          {authors.map((person) => (
            <Micro key={person.name}>{person.name}</Micro>
          ))}
          {doc.publishedAt ? <Micro>{formatDate(doc.publishedAt, locale)}</Micro> : null}
        </div>

        {total > 0 ? <TrackProgress index={index} total={total} /> : null}
      </Section>

      {/* The reading column keeps its measure; the space beside it carries the
          contents rather than staying empty. Below the breakpoint the column
          is the page and the contents are not shown — a phone has the scroll
          bar for that. */}
      <Section style={{ paddingTop: 0 }} className="yn-article">
        <Prose html={doc.html} />
        <aside className="yn-article__aside">
          <Contents html={doc.html} />
        </aside>
      </Section>


      <Section style={{ paddingTop: 0 }}>
        <MarkComplete slug={doc.slug} />
      </Section>

      {earlier || later ? (
        <>
          <Rule animate={false} />
          <Section>
            <div style={{ display: 'grid', gap: 12 }}>
              {earlier ? (
                <PillRow
                  to={`${base}/${earlier.slug}`}
                  meta={t('learn.prevSession')}
                >
                  {earlier.title}
                </PillRow>
              ) : null}
              {later ? (
                <PillRow
                  to={`${base}/${later.slug}`}
                  meta={t('learn.nextSession')}
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
