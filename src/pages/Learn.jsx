import Page from '../components/layout/Page.jsx'
import { ArchPyramid } from '../brand/marks.jsx'
import { PillRow } from '../components/ui/Button.jsx'
import { Display, Section } from '../components/ui/Pieces.jsx'
import { counts } from '../lib/content.js'
import { useI18n } from '../lib/i18n.jsx'

/**
 * Learn, laid out the way Build is.
 *
 * It was four filled cards in a two-by-two grid. Marketing asked for this page
 * to read like Build: the title and its line on the left with the artwork
 * beside them, and the sections under it as a list of rows rather than as
 * cards. So the two Learn and Build now share one shape, and a reader moving
 * between them meets the same page twice rather than two designs.
 *
 * The count each track advertises rides on its row as meta, which is where the
 * row puts it — nothing is lost by dropping the cards.
 *
 * Deep Dives is not among them. It came off this index first and then, on the
 * second comment, the page itself: `/learn/deep-dives` and the articles under
 * it are not found. The writing is still in the repository, so this is a line
 * to put back rather than work to redo.
 */
const TRACKS = [
  {
    title: 'learn.foundationTitle',
    meta: ['learn.sessions', { count: counts.foundation }],
    to: '/learn/foundation',
  },
  {
    title: 'learn.algoTrackTitle',
    meta: ['learn.sessions', { count: counts.algoTrack }],
    to: '/learn/algo-track',
  },
  {
    title: 'learn.egxGuideTitle',
    meta: ['learn.sessions', { count: counts.egxGuide }],
    to: '/learn/egx-guide',
  },
  {
    title: 'learn.glossaryTitle',
    meta: ['learn.terms', { count: counts.glossary }],
    to: '/learn/glossary',
  },
]

export default function Learn() {
  const { t } = useI18n()

  return (
    <Page title={t('learn.title')}>
      <Section>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'var(--yn-hero-cols)',
            gap: 48,
            alignItems: 'center',
          }}
        >
          <div>
            <Display as="h1" size="h1">
              {t('learn.title')}
            </Display>
            <p className="yn-display" style={{ fontSize: 'var(--yn-h3)', margin: '10px 0 0' }}>
              {t('learn.sub')}
            </p>

            <div style={{ display: 'grid', gap: 12, marginTop: 40 }}>
              {TRACKS.map((track) => (
                <PillRow key={track.title} to={track.to} meta={t(...track.meta)}>
                  {t(track.title)}
                </PillRow>
              ))}
            </div>
          </div>

          {/* The same colour as the header, from the same token, as on the
              other two pages. */}
          <ArchPyramid tone="chrome" />
        </div>
      </Section>
    </Page>
  )
}
