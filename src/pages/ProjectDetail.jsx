import { useParams, Link } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Card, Grid, SnapshotCard } from '../components/ui/Card.jsx'
import {
  Badge,
  Display,
  Micro,
  PageHeading,
  PhotoPlaceholder,
  Rule,
  Section,
} from '../components/ui/Pieces.jsx'
import { byCollection, findDoc, formatDate } from '../lib/content.js'

const KINDS = { showcase: 'Showcase', capstones: 'Capstone', apps: 'App' }

/**
 * The builders block is the point of this page — the people are the deliverable,
 * not a footnote. A named supervisor is picked out in blue.
 */
function Builders({ builders }) {
  if (!builders?.length) return null

  return (
    <Section style={{ paddingTop: 0 }}>
      <Display size="h2" style={{ marginBottom: 32 }}>
        Builders
      </Display>

      <Grid cols={4} gap={28}>
        {builders.map((person) => {
          const supervisor = /supervis/i.test(person.role || '')
          return supervisor ? (
            <SnapshotCard key={person.name} tone="blue" style={{ gap: 14 }}>
              <PhotoPlaceholder ratio="1 / 1" label={person.name} radius="editorial" />
              <Display size="track-title" as="h3">
                {person.name}
              </Display>
              <Micro>{[person.role, person.university].filter(Boolean).join(' · ')}</Micro>
            </SnapshotCard>
          ) : (
            <Card key={person.name} style={{ padding: 22, display: 'grid', gap: 14, height: '100%' }}>
              <PhotoPlaceholder ratio="1 / 1" label={person.name} radius="editorial" />
              <Display size="track-title" as="h3">
                {person.name}
              </Display>
              <Micro>{[person.role, person.university].filter(Boolean).join(' · ')}</Micro>
              {person.linkedIn ? (
                <Button tone="white" size="sm" href={person.linkedIn}>
                  LinkedIn →
                </Button>
              ) : null}
            </Card>
          )
        })}
      </Grid>
    </Section>
  )
}

export default function ProjectDetail() {
  const { collection, slug } = useParams()

  // /build/:collection/:slug would otherwise render a glossary term or a
  // foundation session inside the project shell, complete with a Related block
  // linking on to more of them.
  const doc = KINDS[collection] ? findDoc(collection, slug) : null
  if (!doc) return <NotFound />

  const related = byCollection(collection).filter((d) => d.slug !== doc.slug).slice(0, 3)

  return (
    <Page title={doc.title}>
      <Section style={{ paddingBottom: 40 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px', marginBottom: 20 }}>
          <Micro>{KINDS[collection] ?? collection}</Micro>
          {doc.status ? <Micro>{doc.status}</Micro> : null}
          {doc.publishedAt ? <Micro>{formatDate(doc.publishedAt)}</Micro> : null}
        </div>

        <PageHeading sub={doc.description}>{doc.title}</PageHeading>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {doc.repoUrl ? (
            <Button tone="white" href={doc.repoUrl}>
              Repository →
            </Button>
          ) : null}
          {doc.liveUrl ? (
            <Button tone="blue" href={doc.liveUrl}>
              Live demo →
            </Button>
          ) : null}
        </div>
      </Section>

      <Builders builders={doc.builders} />

      <Rule animate={false} />

      <Section>
        <div className="yn-prose" dangerouslySetInnerHTML={{ __html: doc.html }} />
      </Section>

      {doc.tags?.length ? (
        <Section style={{ paddingTop: 0 }}>
          <Micro style={{ marginBottom: 16 }}>Tech stack</Micro>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {doc.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </Section>
      ) : null}

      {related.length ? (
        <>
          <Rule animate={false} />
          <Section>
            <Display size="h2" style={{ marginBottom: 32 }}>
              Related
            </Display>
            <Grid>
              {related.map((item) => (
                <Card key={item.slug} radius="editorial" style={{ padding: 26 }}>
                  <Display size="track-title" as="h3">
                    <Link to={`/build/${collection}/${item.slug}`}>{item.title}</Link>
                  </Display>
                </Card>
              ))}
            </Grid>
          </Section>
        </>
      ) : null}
    </Page>
  )
}
