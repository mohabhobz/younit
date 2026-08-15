import { useParams } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { Card } from '../components/ui/Card.jsx'
import { PageHeading, Section } from '../components/ui/Pieces.jsx'
import { useI18n } from '../lib/i18n.jsx'

/**
 * Four sections that open in Phase 2. Each states what it will be and nothing
 * more — no ranks, no names, no figures. The description is the real one, which
 * is the point of the note at the bottom.
 */
export const COMPETE_SECTIONS = {
  leaderboard: 'leaderboard',
  seasons: 'seasons',
  hackathons: 'hackathons',
  'wall-of-fame': 'wallOfFame',
}

export default function CompeteSection() {
  const { section } = useParams()
  const { t } = useI18n()
  const key = COMPETE_SECTIONS[section]
  if (!key) return <NotFound />

  const title = t(`compete.${key}Title`)

  return (
    <Page title={title} footer="dark">
      <Section>
        <Breadcrumb trail={[{ label: t('compete.title'), to: '/compete' }, { label: title }]} />
        <PageHeading sub={t(`compete.${key}Sub`)}>{title}</PageHeading>

        <Card tone="blue" outline="ink">
          <p style={{ margin: 0, fontSize: 'var(--yn-body-size)', lineHeight: 1.6 }}>
            {t('compete.phaseNote')}
          </p>
        </Card>
      </Section>
    </Page>
  )
}
