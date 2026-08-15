import Page from '../components/layout/Page.jsx'
import { Button } from '../components/ui/Button.jsx'
import { PageHeading, Section } from '../components/ui/Pieces.jsx'
import { useI18n } from '../lib/i18n.jsx'

export default function NotFound() {
  const { t } = useI18n()

  return (
    <Page title={t('notFound.title')}>
      <Section>
        <PageHeading sub={t('notFound.sub')}>{t('notFound.heading')}</PageHeading>
        <div className="yn-cta-row">
          <Button tone="blue" to="/">
            {t('notFound.cta')}
          </Button>
        </div>
      </Section>
    </Page>
  )
}
