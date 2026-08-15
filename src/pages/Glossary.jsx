import Page from '../components/layout/Page.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { Display, PageHeading, Rule, Section } from '../components/ui/Pieces.jsx'
import { byCollection } from '../lib/content.js'
import { Link, useI18n } from '../lib/i18n.jsx'

export default function Glossary() {
  const { t, locale } = useI18n()
  const terms = byCollection('glossary', locale)
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
    <Page title={t('learn.glossaryTitle')}>
      <Section>
        <Breadcrumb
          trail={[
            { label: t('learn.title'), to: '/learn' },
            { label: t('learn.glossaryTitle') },
          ]}
        />
        <PageHeading sub={t('learn.glossarySub')}>{t('learn.glossaryTitle')}</PageHeading>

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
                fontSize: 'var(--yn-small)',
              }}
            >
              {letter}
            </a>
          ))}
        </div>

        {terms.length === 0 ? (
          <p style={{ color: 'var(--yn-grey-dark)' }}>{t('learn.glossaryEmpty')}</p>
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
                    <dd style={{ margin: 0, fontSize: 'var(--yn-body-size)', color: 'var(--yn-grey-dark)', lineHeight: 1.6 }}>
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
