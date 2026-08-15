import { useParams } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { Badge, Display, PageHeading, Rule, Section } from '../components/ui/Pieces.jsx'
import { byCollection, findDoc } from '../lib/content.js'
import { Link, useI18n } from '../lib/i18n.jsx'
import Prose from '../components/ui/Prose.jsx'

export default function GlossaryTerm() {
  const { term: slug } = useParams()
  const { t, locale } = useI18n()
  const doc = findDoc('glossary', slug, locale)
  if (!doc) return <NotFound />

  // A related term is stored as its slug, which is a URL and not a word. Show
  // the term's own name — in the reader's language — and fall back to the slug
  // only if the entry has gone missing.
  const related = (doc.relatedTerms ?? []).map((relatedSlug) => ({
    slug: relatedSlug,
    label:
      byCollection('glossary', locale).find((d) => d.slug === relatedSlug)?.term ??
      relatedSlug.replace(/-/g, ' '),
  }))

  return (
    <Page title={doc.term || doc.slug} width={1120}>
      <Section>
        <Breadcrumb
          trail={[
            { label: t('learn.title'), to: '/learn' },
            { label: t('learn.glossaryTitle'), to: '/learn/glossary' },
            { label: doc.term || doc.slug },
          ]}
        />
        <PageHeading sub={doc.shortDefinition}>{doc.term || doc.slug}</PageHeading>

        {doc.html?.trim() ? (
          <Prose html={doc.html} />
        ) : null}

        {related.length ? (
          <>
            <Rule animate={false} />
            <div style={{ paddingTop: 40 }}>
              <Display size="h3" as="h2" style={{ marginBottom: 20 }}>
                {t('learn.relatedTerms')}
              </Display>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/learn/glossary/${item.slug}`}
                    style={{ display: 'inline-flex', alignItems: 'center', minHeight: 34 }}
                  >
                    <Badge tone="purple">{item.label}</Badge>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </Section>
    </Page>
  )
}
