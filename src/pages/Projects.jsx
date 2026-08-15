import { useParams, Link } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Card, EditorialCard, Grid } from '../components/ui/Card.jsx'
import { Display, Micro, PageHeading, Section } from '../components/ui/Pieces.jsx'
import { byCollection } from '../lib/content.js'

/** Sublines and empty states are the original site's. */
const COLLECTIONS = {
  showcase: {
    title: 'Showcase',
    sub: 'Things people are building on EFG infrastructure. Real names, real code.',
    empty: {
      title: 'The first projects are landing soon. Want to be among them?',
      cta: 'Explore the repositories',
      to: '/build/repositories',
    },
  },
  capstones: {
    title: 'Capstones',
    sub: 'University capstone projects built on EFG infrastructure. Real students, real research.',
    empty: { title: 'Capstone projects loading soon.' },
  },
  apps: {
    title: 'Apps',
    sub: 'Independent applications built on the EFG API.',
    empty: { title: 'Apps loading soon.' },
  },
}

const STATUS = { live: 'Live', 'in-development': 'In development', archived: 'Archived' }
const TONES = { live: 'blue', 'in-development': 'amber', archived: 'purple' }

export default function Projects() {
  const { collection } = useParams()
  const meta = COLLECTIONS[collection]
  if (!meta) return <NotFound />

  const docs = byCollection(collection)

  return (
    <Page title={meta.title}>
      <Section>
        <Breadcrumb trail={[{ label: 'Build', to: '/build' }, { label: meta.title }]} />
        <PageHeading sub={meta.sub}>{meta.title}</PageHeading>

        {docs.length ? (
          <Grid>
            {docs.map((doc) => (
              <div key={doc.slug}>
                <EditorialCard
                  to={`/build/${collection}/${doc.slug}`}
                  tag={STATUS[doc.status] ?? doc.status ?? 'In development'}
                  tagTone={TONES[doc.status] ?? 'purple'}
                  title={doc.title}
                  meta={
                    collection === 'capstones'
                      ? [doc.university, doc.semester].filter(Boolean).join(' · ')
                      : (doc.builders ?? []).map((b) => b.name).join(', ')
                  }
                />
                <p
                  style={{
                    margin: '12px 4px 0',
                    fontSize: 'var(--yn-small)',
                    color: 'var(--yn-grey-dark)',
                    lineHeight: 1.6,
                  }}
                >
                  {doc.description}
                </p>
              </div>
            ))}
          </Grid>
        ) : (
          <Card style={{ textAlign: 'center', padding: 48 }}>
            <Display size="track-title" as="p" style={{ marginBottom: 16 }}>
              {meta.empty.title}
            </Display>
            {meta.empty.cta ? (
              <Button tone="blue" to={meta.empty.to}>
                {meta.empty.cta} →
              </Button>
            ) : null}
          </Card>
        )}
      </Section>
    </Page>
  )
}
