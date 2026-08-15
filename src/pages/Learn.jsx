import Page from '../components/layout/Page.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Grid, SnapshotCard } from '../components/ui/Card.jsx'
import { Display, Micro, PageHeading, Section } from '../components/ui/Pieces.jsx'
import { counts } from '../lib/content.js'

/**
 * The four Learn sections, each linking to its own index — the same structure
 * the original site used, with its copy.
 */
const TRACKS = [
  {
    tone: 'blue',
    title: 'Foundation Series',
    meta: `${counts.foundation} sessions`,
    description: 'Everything you need to understand how markets actually work.',
    to: '/learn/foundation',
    cta: 'amber',
  },
  {
    tone: 'purple',
    title: 'Algo Track',
    meta: `${counts.algoTrack} sessions`,
    description:
      'From first principles to deploying a live algorithmic trading strategy.',
    to: '/learn/algo-track',
    cta: 'white',
  },
  {
    tone: 'white',
    title: 'Deep Dives',
    meta: `${counts.deepDives} articles`,
    description: 'Longer-form analysis on specific sectors, instruments, and ideas.',
    to: '/learn/deep-dives',
    cta: 'blue',
  },
  {
    tone: 'white',
    title: 'Glossary',
    meta: `${counts.glossary} terms`,
    description: 'Every term, linkable and searchable.',
    to: '/learn/glossary',
    cta: 'blue',
  },
]

export default function Learn() {
  return (
    <Page title="Learn">
      <Section>
        <PageHeading sub="Capital markets education, from first principles to deep analysis.">
          Learn
        </PageHeading>

        <Grid cols={2} gap={36}>
          {TRACKS.map((track) => (
            <SnapshotCard key={track.title} tone={track.tone} style={{ height: '100%' }}>
              <Micro style={{ color: 'var(--yn-ink-2)' }}>{track.meta}</Micro>
              <Display size="h2-journey" as="h2">
                {track.title}
              </Display>
              <p style={{ margin: 0, fontSize: 'var(--yn-body-size)', lineHeight: 1.6 }}>{track.description}</p>
              <div style={{ marginTop: 'auto', paddingTop: 6 }}>
                <Button tone={track.cta} size="sm" to={track.to}>
                  View all →
                </Button>
              </div>
            </SnapshotCard>
          ))}
        </Grid>
      </Section>
    </Page>
  )
}
