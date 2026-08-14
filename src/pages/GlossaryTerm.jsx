import { useParams, Link } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { Badge, Display, PageHeading, Rule, Section } from '../components/ui/Pieces.jsx'
import { findDoc } from '../lib/content.js'

export default function GlossaryTerm() {
  const { term: slug } = useParams()
  const doc = findDoc('glossary', slug)
  if (!doc) return <NotFound />

  return (
    <Page title={doc.term || doc.slug}>
      <Section>
        <Breadcrumb
          trail={[
            { label: 'Learn', to: '/learn' },
            { label: 'Glossary', to: '/learn/glossary' },
            { label: doc.term || doc.slug },
          ]}
        />
        <PageHeading sub={doc.shortDefinition}>{doc.term || doc.slug}</PageHeading>

        {doc.html?.trim() ? (
          <div className="yn-prose" dangerouslySetInnerHTML={{ __html: doc.html }} />
        ) : null}

        {doc.relatedTerms?.length ? (
          <>
            <Rule animate={false} />
            <div style={{ paddingTop: 40 }}>
              <Display size="h3" as="h2" style={{ marginBottom: 20 }}>
                Related glossary terms
              </Display>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {doc.relatedTerms.map((related) => (
                  <Link
                    key={related}
                    to={`/learn/glossary/${related}`}
                    style={{ display: 'inline-flex', alignItems: 'center', minHeight: 34 }}
                  >
                    <Badge tone="purple">{related.replace(/-/g, ' ')}</Badge>
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
