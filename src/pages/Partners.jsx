import Page from '../components/layout/Page.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Badge, Display, PageHeading, Rule, Section } from '../components/ui/Pieces.jsx'
import { useI18n } from '../lib/i18n.jsx'

/** Both lists are the original site's, unchanged, and now in the dictionary. */
export default function Partners() {
  const { t } = useI18n()
  const universities = t('partners.universities')
  const divisions = t('partners.divisions')

  return (
    <Page title={t('partners.title')}>
      <Section>
        <PageHeading>{t('partners.title')}</PageHeading>

        <Display size="h3" as="h2" style={{ marginBottom: 24 }}>
          {t('partners.universitiesTitle')}
        </Display>
        <div style={{ display: 'grid', gap: 12, marginBottom: 64 }}>
          {universities.map((name) => (
            <Card
              key={name}
              radius="pill"
              style={{
                padding: '16px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: 'var(--yn-body-size)' }}>{name}</span>
              <Badge tone="blue">{t('partners.partnerStatus')}</Badge>
            </Card>
          ))}
        </div>

        <Rule animate={false} />

        <div style={{ paddingTop: 64 }}>
          <Display size="h3" as="h2" style={{ marginBottom: 24 }}>
            {t('partners.efgTitle')}
          </Display>
          <div className="yn-prose" style={{ marginBottom: 64 }}>
            {divisions.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <Rule animate={false} />

          <div style={{ paddingTop: 64 }}>
            <Display size="h3" as="h2" style={{ marginBottom: 24 }}>
              {t('partners.acknowledgmentsTitle')}
            </Display>
            <div className="yn-prose">
              <p>{t('partners.acknowledgments')}</p>
            </div>
          </div>
        </div>
      </Section>
    </Page>
  )
}
