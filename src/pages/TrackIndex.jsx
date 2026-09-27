import { useParams } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { PillRow } from '../components/ui/Button.jsx'
import { PageHeading, Section } from '../components/ui/Pieces.jsx'
import { byCollection } from '../lib/content.js'
import { useI18n } from '../lib/i18n.jsx'

/**
 * The Learn sub-indexes. Deep Dives was the third and is not here for now —
 * marketing asked for the page itself to go, so `/learn/deep-dives` and the
 * articles under it are not found rather than quietly unlinked. Nothing else on
 * the site pointed at them. The writing is still in the repository, so putting
 * the page back is putting this line back.
 */
const TRACKS = {
  foundation: { key: 'foundation' },
  'algo-track': { key: 'algoTrack' },
  'egx-guide': { key: 'egxGuide' },
}

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
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {docs.map((doc, i) => (
              <PillRow key={doc.slug} to={`/learn/${collection}/${doc.slug}`}>
                {String(i + 1).padStart(2, '0')}. {doc.title}
              </PillRow>
            ))}
          </div>
        )}
      </Section>
    </Page>
  )
}
