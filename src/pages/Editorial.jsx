import Page from '../components/layout/Page.jsx'
import { EditorialCard, Grid } from '../components/ui/Card.jsx'
import { PageHeading, Section } from '../components/ui/Pieces.jsx'
import { byCollection, formatDate, peopleById } from '../lib/content.js'

const TONES = ['purple', 'amber', 'blue']

/** Kind → label, from the original site's dictionary. */
const KINDS = {
  newsletter: 'Newsletter',
  commentary: 'Commentary',
  profile: 'Profile',
  explainer: 'Explainer',
}

export default function Editorial() {
  const posts = byCollection('editorial')

  return (
    <Page title="From the Hub">
      <Section>
        <PageHeading sub="Market commentary, builder profiles, and the weekly EGX recap.">
          Editorial
        </PageHeading>

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
                  tag={KINDS[doc.kind] ?? KINDS.newsletter}
                  tagTone={TONES[i % TONES.length]}
                  title={doc.title}
                  meta={[formatDate(doc.publishedAt), author].filter(Boolean).join(' • ')}
                />
              )
            })}
          </Grid>
        ) : (
          <p style={{ color: 'var(--yn-grey-dark)' }}>Nothing published yet.</p>
        )}
      </Section>
    </Page>
  )
}
