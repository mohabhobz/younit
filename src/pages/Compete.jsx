import Page from '../components/layout/Page.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Display, PageHeading, Section } from '../components/ui/Pieces.jsx'
import Photo from '../components/ui/Photo.jsx'
import competeJpg from '../assets/compete-team.jpg'
import competeWebp from '../assets/compete-team.webp'
import { useI18n } from '../lib/i18n.jsx'

/**
 * One line and a waiting sign.
 *
 * The page used to describe the four sections and link to a page for each.
 * Marketing asked for all four to go and for this to say that the next
 * competition is coming — so there is nothing here to click, and nothing that
 * claims a date nobody has given.
 */
export default function Compete() {
  const { t } = useI18n()

  return (
    <Page title={t('compete.title')} footer="dark">
      <Section>
        <PageHeading sub={t('compete.sub')}>{t('compete.title')}</PageHeading>

        <Card radius="band" style={{ padding: 'clamp(24px, 4vw, 48px)', background: 'transparent' }}>
          <div style={{ display: 'grid', gap: 20, justifyItems: 'center', padding: '48px 0 56px' }}>
            <Display size="h2-journey" as="p" style={{ margin: 0, textAlign: 'center' }}>
              {t('compete.stayTuned')}
            </Display>

            {/* Three dots that keep time. A reader who has asked for less
                movement gets them still, which still reads as waiting. */}
            <span className="yn-loading" role="status" aria-label={t('compete.loading')}>
              <span />
              <span />
              <span />
            </span>
          </div>

          <Photo
            webp={competeWebp}
            jpg={competeJpg}
            width={2432}
            height={811}
            alt={t('compete.photoAlt')}
          />
        </Card>
      </Section>
    </Page>
  )
}
