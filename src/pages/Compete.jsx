import Page from '../components/layout/Page.jsx'
import { COMPETE_SECTIONS } from './CompeteSection.jsx'
import { Card, Grid } from '../components/ui/Card.jsx'
import { Badge, PageHeading, Section } from '../components/ui/Pieces.jsx'
import Photo from '../components/ui/Photo.jsx'
import competeJpg from '../assets/compete-team.jpg'
import competeWebp from '../assets/compete-team.webp'
import { Link, useI18n } from '../lib/i18n.jsx'

/**
 * Nothing here has launched. The page describes what each section will be and
 * shows no ranks, no names and no figures — which is also what the design
 * specifies. The four entries link to their own pages, as the original site did.
 */
const ORDER = ['leaderboard', 'hackathons', 'seasons', 'wall-of-fame']

export default function Compete() {
  const { t } = useI18n()

  return (
    <Page title={t('compete.title')} footer="dark">
      <Section>
        <PageHeading sub={t('compete.sub')}>{t('compete.title')}</PageHeading>

        <Card radius="band" style={{ padding: 'clamp(24px, 4vw, 48px)', background: 'transparent' }}>
          <Grid cols={2} gap={28} style={{ marginBottom: 40 }}>
            {ORDER.map((section) => {
              const key = COMPETE_SECTIONS[section]
              return (
                <Link
                  key={section}
                  to={`/compete/${section}`}
                  style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
                >
                  <Badge tone="purple">{t(`compete.${key}Title`)}</Badge>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 'var(--yn-body-size)',
                      color: 'var(--yn-grey-dark)',
                      flex: 1,
                      lineHeight: 1.6,
                    }}
                  >
                    {t(`compete.${key}Sub`)}
                  </p>
                </Link>
              )
            })}
          </Grid>

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
