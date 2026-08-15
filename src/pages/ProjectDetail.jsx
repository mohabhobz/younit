import { useParams } from 'react-router-dom'
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
import { Link, useI18n } from '../lib/i18n.jsx'
import Prose from '../components/ui/Prose.jsx'

const KINDS = { showcase: 'kindShowcase', capstones: 'kindCapstone', apps: 'kindApp' }

/**
 * The builders block is the point of this page — the people are the deliverable,
 * not a footnote. A named supervisor is picked out in blue.
 */
function Builders({ builders }) {
  const { t } = useI18n()
  if (!builders?.length) return null

  return (
    <Section style={{ paddingTop: 0 }}>
      <Display size="h2" style={{ marginBottom: 32 }}>
        {t('build.builders')}
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
                  {t('build.linkedIn')}
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
  const { t, locale } = useI18n()

  // /build/:collection/:slug would otherwise render a glossary term or a
  // foundation session inside the project shell, complete with a Related block
  // linking on to more of them.
  const doc = KINDS[collection] ? findDoc(collection, slug, locale) : null
  if (!doc) return <NotFound />

  const related = byCollection(collection, locale).filter((d) => d.slug !== doc.slug).slice(0, 3)

  return (
    <Page title={doc.title}>
      <Section style={{ paddingBottom: 40 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px', marginBottom: 20 }}>
          <Micro>{t(`build.${KINDS[collection]}`)}</Micro>
          {doc.status ? <Micro>{t(`build.status.${doc.status}`)}</Micro> : null}
          {doc.publishedAt ? <Micro>{formatDate(doc.publishedAt, locale)}</Micro> : null}
        </div>

        <PageHeading sub={doc.description}>{doc.title}</PageHeading>

        <div className="yn-cta-row">
          {doc.repoUrl ? (
            <Button tone="white" href={doc.repoUrl}>
              {t('build.repository')}
            </Button>
          ) : null}
          {doc.liveUrl ? (
            <Button tone="blue" href={doc.liveUrl}>
              {t('build.liveDemo')}
            </Button>
          ) : null}
        </div>
      </Section>

      <Builders builders={doc.builders} />

      <Rule animate={false} />

      <Section>
        <Prose html={doc.html} />
      </Section>

      {doc.tags?.length ? (
        <Section style={{ paddingTop: 0 }}>
          <Micro style={{ marginBottom: 16 }}>{t('build.techStack')}</Micro>
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
              {t('build.related')}
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
