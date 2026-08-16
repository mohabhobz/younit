import { useParams } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Card, EditorialCard, Grid } from '../components/ui/Card.jsx'
import { Display, PageHeading, Section } from '../components/ui/Pieces.jsx'
import { byCollection } from '../lib/content.js'
import { useI18n } from '../lib/i18n.jsx'

/** Sublines and empty states are the original site's, now in the dictionary. */
const COLLECTIONS = {
  showcase: { key: 'showcase', emptyCta: '/build/repositories' },
  capstones: { key: 'capstones' },
  apps: { key: 'apps' },
}

const TONES = { live: 'blue', 'in-development': 'amber', archived: 'purple' }

/** Card and description, sharing the grid's rows with the columns beside it. */
const COLUMN = { display: 'grid', gridTemplateRows: 'subgrid', gridRow: 'span 2', gap: 0 }

export default function Projects() {
  const { collection } = useParams()
  const { t, locale } = useI18n()
  const meta = COLLECTIONS[collection]
  if (!meta) return <NotFound />

  const docs = byCollection(collection, locale)
  const title = t(`build.${meta.key}Title`)

  return (
    <Page title={title}>
      <Section>
        <Breadcrumb trail={[{ label: t('build.title'), to: '/build' }, { label: title }]} />
        <PageHeading sub={t(`build.${meta.key}Sub`)}>{title}</PageHeading>

        {docs.length ? (
          <Grid>
            {docs.map((doc) => (
              // The column takes its two rows from the grid rather than laying
              // them out itself, so every card in a row is the height of the
              // tallest and every description starts on the same line. Without
              // it a title that wraps to two lines makes its own card taller
              // than the two beside it.
              <div key={doc.slug} style={COLUMN}>
                <EditorialCard
                  to={`/build/${collection}/${doc.slug}`}
                  tag={t(`build.status.${doc.status ?? 'in-development'}`)}
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
              {t(meta.emptyCta ? 'build.showcaseEmptyTitle' : `build.${meta.key}Empty`)}
            </Display>
            {meta.emptyCta ? (
              <Button tone="blue" to={meta.emptyCta}>
                {t('build.showcaseEmptyCta')} {t('common.forwardArrow')}
              </Button>
            ) : null}
          </Card>
        )}
      </Section>
    </Page>
  )
}
