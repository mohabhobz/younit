import { useParams } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { PillRow } from '../components/ui/Button.jsx'
import { EditorialCard, Grid } from '../components/ui/Card.jsx'
import { PageHeading, Section } from '../components/ui/Pieces.jsx'
import { byCollection, readingTime } from '../lib/content.js'
import { useI18n } from '../lib/i18n.jsx'

/**
 * The three Learn sub-indexes. The original site had one page each; they differ
 * only in whether the entries are a numbered session list or a card grid.
 */
const TRACKS = {
  foundation: { key: 'foundation', numbered: true },
  'algo-track': { key: 'algoTrack', numbered: true },
  'deep-dives': { key: 'deepDives', numbered: false },
}

const TONES = ['purple', 'amber', 'blue']

export default function TrackIndex() {
  const { collection } = useParams()
  const { t, locale } = useI18n()
  const track = TRACKS[collection]
  if (!track) return <NotFound />

  const docs = byCollection(collection, locale)
  const title = t(`learn.${track.key}Title`)

  return (
    <Page title={title}>
      <Section>
        <Breadcrumb trail={[{ label: t('learn.title'), to: '/learn' }, { label: title }]} />
        <PageHeading sub={t(`learn.${track.key}Sub`)}>{title}</PageHeading>

        {docs.length === 0 ? (
          <p style={{ color: 'var(--yn-grey-dark)' }}>{t(`learn.${track.key}Empty`)}</p>
        ) : track.numbered ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {docs.map((doc, i) => (
              <PillRow
                key={doc.slug}
                to={`/learn/${collection}/${doc.slug}`}
                meta={doc.duration || readingTime(t, doc.readingMinutes)}
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
                tag={(doc.tags ?? [])[0] || t('learn.deepDiveTag')}
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
