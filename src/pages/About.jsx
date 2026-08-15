import Page from '../components/layout/Page.jsx'
import { Display, PageHeading, Rule, Section } from '../components/ui/Pieces.jsx'
import { useI18n } from '../lib/i18n.jsx'

/** Copy carried over verbatim from the original site's About page. */
export default function About() {
  const { t } = useI18n()

  return (
    <Page title={t('about.title')}>
      <Section>
        <PageHeading>{t('about.title')}</PageHeading>
        <div className="yn-prose">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <p>{t('about.p3')}</p>
          <p>{t('about.p4')}</p>
        </div>
      </Section>

      <Rule animate={false} />

      <Section>
        <Display size="h3" as="h2" style={{ marginBottom: 24 }}>
          {t('about.whyTitle')}
        </Display>
        <div className="yn-prose">
          <p>{t('about.whyBody')}</p>
        </div>
      </Section>
    </Page>
  )
}
