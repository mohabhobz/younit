import Page from '../components/layout/Page.jsx'
import { EditorialCard, Grid } from '../components/ui/Card.jsx'
import { PageHeading, Section } from '../components/ui/Pieces.jsx'
import { byCollection, formatDate, peopleById } from '../lib/content.js'
import { useI18n } from '../lib/i18n.jsx'

const TONES = ['purple', 'amber', 'blue']

export default function Editorial() {
  const { t, locale } = useI18n()
  const posts = byCollection('editorial', locale)

  return (
    <Page title={t('editorial.title')}>
      <Section>
        <PageHeading sub={t('editorial.sub')}>{t('nav.editorial')}</PageHeading>

        {posts.length ? (
          <Grid>
            {posts.map((doc, i) => {
              const author = (doc.authors ?? [])
                .map((id) => peopleById[id]?.name)
                .filter(Boolean)[0]
              return (
                <EditorialCard
                  key={doc.slug}
                  to={`/editorial/${doc.slug}`}
                  tag={t(`editorial.kinds.${doc.kind ?? 'newsletter'}`)}
                  tagTone={TONES[i % TONES.length]}
                  title={doc.title}
                  meta={[formatDate(doc.publishedAt, locale), author].filter(Boolean).join(' • ')}
                />
              )
            })}
          </Grid>
        ) : (
          <p style={{ color: 'var(--yn-grey-dark)' }}>{t('editorial.empty')}</p>
        )}
      </Section>
    </Page>
  )
}
