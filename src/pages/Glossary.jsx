import { Link } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { Display, PageHeading, Rule, Section } from '../components/ui/Pieces.jsx'
import { byCollection } from '../lib/content.js'

export default function Glossary() {
  const terms = byCollection('glossary')
    .slice()
    .sort((a, b) => (a.term || a.slug).localeCompare(b.term || b.slug))

  // Grouped by initial letter, as the original site groups it.
  const grouped = terms.reduce((acc, term) => {
    const letter = (term.term || term.slug)[0].toUpperCase()
    ;(acc[letter] ||= []).push(term)
    return acc
  }, {})
  const letters = Object.keys(grouped).sort()

  return (
    <Page title="Glossary">
      <Section>
        <Breadcrumb trail={[{ label: 'Learn', to: '/learn' }, { label: 'Glossary' }]} />
        <PageHeading sub="Every term, linkable and searchable.">Glossary</PageHeading>

        {/* Jump bar — every letter that has terms. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 56 }}>
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#${letter}`}
              style={{
                width: 34,
                height: 34,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--yn-purple)',
                borderRadius: 'var(--yn-r-pill)',
                fontSize: 13,
              }}
            >
              {letter}
            </a>
          ))}
        </div>

        {terms.length === 0 ? (
          <p style={{ color: 'var(--yn-grey-dark)' }}>Glossary terms are being prepared.</p>
        ) : (
          letters.map((letter) => (
            <div key={letter} id={letter} style={{ marginBottom: 56, scrollMarginTop: 24 }}>
              <Display size="h2" as="h2" style={{ marginBottom: 20 }}>
                {letter}
              </Display>
              <Rule animate={false} />
              <dl style={{ margin: 0 }}>
                {grouped[letter].map((term) => (
                  <div
                    key={term.slug}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
                      gap: 24,
                      padding: '20px 0',
                      borderBottom: '1px solid var(--yn-purple)',
                    }}
                  >
                    <dt>
                      <Link
                        to={`/learn/glossary/${term.slug}`}
                        className="yn-display"
                        style={{ fontSize: 'var(--yn-track-title)', lineHeight: 1.2 }}
                      >
                        {term.term || term.slug}
                      </Link>
                    </dt>
                    <dd style={{ margin: 0, fontSize: 15, color: 'var(--yn-grey-dark)', lineHeight: 1.6 }}>
                      {term.shortDefinition}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))
        )}
      </Section>
    </Page>
  )
}
