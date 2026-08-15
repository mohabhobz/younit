import Page from '../components/layout/Page.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Grid, SnapshotCard } from '../components/ui/Card.jsx'
import { Display, Micro, PageHeading, Section } from '../components/ui/Pieces.jsx'
import { counts } from '../lib/content.js'
import { useI18n } from '../lib/i18n.jsx'

/**
 * The four Learn sections, each linking to its own index — the same structure
 * the original site used, with its copy.
 */
const TRACKS = [
  {
    tone: 'blue',
    title: 'learn.foundationTitle',
    meta: ['learn.sessions', { count: counts.foundation }],
    description: 'learn.foundationShort',
    to: '/learn/foundation',
    cta: 'amber',
  },
  {
    tone: 'purple',
    title: 'learn.algoTrackTitle',
    meta: ['learn.sessions', { count: counts.algoTrack }],
    description: 'learn.algoTrackShort',
    to: '/learn/algo-track',
    cta: 'white',
  },
  {
    tone: 'white',
    title: 'learn.deepDivesTitle',
    meta: ['learn.articles', { count: counts.deepDives }],
    description: 'learn.deepDivesSub',
    to: '/learn/deep-dives',
    cta: 'blue',
  },
  {
    tone: 'white',
    title: 'learn.glossaryTitle',
    meta: ['learn.terms', { count: counts.glossary }],
    description: 'learn.glossarySub',
    to: '/learn/glossary',
    cta: 'blue',
  },
]

export default function Learn() {
  const { t } = useI18n()

  return (
    <Page title={t('learn.title')}>
      <Section>
        <PageHeading sub={t('learn.sub')}>{t('learn.title')}</PageHeading>

        <Grid cols={2} gap={36}>
          {TRACKS.map((track) => (
            <SnapshotCard key={track.title} tone={track.tone} style={{ height: '100%' }}>
              <Micro style={{ color: 'var(--yn-ink-2)' }}>{t(...track.meta)}</Micro>
              <Display size="h2-journey" as="h2">
                {t(track.title)}
              </Display>
              <p style={{ margin: 0, fontSize: 'var(--yn-body-size)', lineHeight: 1.6 }}>
                {t(track.description)}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 6 }}>
                <Button tone={track.cta} size="sm" to={track.to}>
                  {t('common.viewAll')}
                </Button>
              </div>
            </SnapshotCard>
          ))}
        </Grid>
      </Section>
    </Page>
  )
}
