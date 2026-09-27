import Page from '../components/layout/Page.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Grid, SnapshotCard } from '../components/ui/Card.jsx'
import { Display, Micro, PageHeading, Section } from '../components/ui/Pieces.jsx'
import { counts } from '../lib/content.js'
import { useI18n } from '../lib/i18n.jsx'

/**
 * The Learn sections, each linking to its own index.
 *
 * Deep Dives is not among them for now. It came off this index first and then,
 * on the second comment, the page itself: `/learn/deep-dives` and the articles
 * under it are not found. Nothing else on the site pointed at them, and the
 * writing is still in the repository, so this is a line to put back rather than
 * work to redo.
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
    tone: 'amber',
    title: 'learn.egxGuideTitle',
    meta: ['learn.sessions', { count: counts.egxGuide }],
    description: 'learn.egxGuideShort',
    to: '/learn/egx-guide',
    cta: 'white',
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
