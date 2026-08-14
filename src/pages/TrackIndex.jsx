import { useParams } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { PillRow } from '../components/ui/Button.jsx'
import { EditorialCard, Grid } from '../components/ui/Card.jsx'
import { PageHeading, Section } from '../components/ui/Pieces.jsx'
import { byCollection } from '../lib/content.js'

/**
 * The three Learn sub-indexes. The original site had one page each; they differ
 * only in whether the entries are a numbered session list or a card grid.
 */
const TRACKS = {
  foundation: {
    title: 'Foundation Series',
    sub: 'Five sessions. Everything you need to understand how markets actually work.',
    numbered: true,
    empty: 'Foundation sessions are being prepared.',
  },
  'algo-track': {
    title: 'Algo Track',
    sub: 'Eight sessions. From first principles to deploying a live algorithmic trading strategy.',
    numbered: true,
    empty: 'Algo Track sessions are being prepared.',
  },
  'deep-dives': {
    title: 'Deep Dives',
    sub: 'Longer-form analysis on specific sectors, instruments, and ideas.',
    numbered: false,
    empty: 'Deep dives are being prepared.',
  },
}

const TONES = ['purple', 'amber', 'blue']

export default function TrackIndex() {
  const { collection } = useParams()
  const track = TRACKS[collection]
  if (!track) return <NotFound />

  const docs = byCollection(collection)

  return (
    <Page title={track.title}>
      <Section>
        <Breadcrumb trail={[{ label: 'Learn', to: '/learn' }, { label: track.title }]} />
        <PageHeading sub={track.sub}>{track.title}</PageHeading>

        {docs.length === 0 ? (
          <p style={{ color: 'var(--yn-grey-dark)' }}>{track.empty}</p>
        ) : track.numbered ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {docs.map((doc, i) => (
              <PillRow
                key={doc.slug}
                to={`/learn/${collection}/${doc.slug}`}
                meta={doc.duration || `${doc.readingMinutes} min read`}
              >
                {String(i + 1).padStart(2, '0')}. {doc.title}
              </PillRow>
            ))}
          </div>
        ) : (
          <Grid>
            {docs.map((doc, i) => (
              <EditorialCard
                key={doc.slug}
                to={`/learn/${collection}/${doc.slug}`}
                tag={(doc.tags ?? [])[0] || 'Deep Dive'}
                tagTone={TONES[i % TONES.length]}
                title={doc.title}
                meta={(doc.tags ?? []).slice(0, 3).join(' · ')}
              />
            ))}
          </Grid>
        )}
      </Section>
    </Page>
  )
}
