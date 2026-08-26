import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Micro, PageHeading, Section } from '../components/ui/Pieces.jsx'
import { useI18n } from '../lib/i18n.jsx'

/**
 * Repositories, which is the only Build page for now. Templates was the other
 * and marketing asked for it to go.
 */
const SECTIONS = {
  repositories: { key: 'repositories', href: 'https://github.com/efg-hermes' },
}

/** Three, because marketing asked for room for three links to start with. */
const SLOTS = [0, 1, 2]

export default function BuildSection({ section }) {
  const { t } = useI18n()
  const meta = SECTIONS[section]
  if (!meta) return <NotFound />

  const title = t(`build.${meta.key}Title`)

  return (
    <Page title={title}>
      <Section>
        <Breadcrumb trail={[{ label: t('build.title'), to: '/build' }, { label: title }]} />
        <PageHeading sub={t(`build.${meta.key}Sub`)}>{title}</PageHeading>

        <Card>
          <p
            className="yn-display"
            style={{ margin: 0, fontSize: 'var(--yn-h3)', lineHeight: 1.25 }}
          >
            {t('build.startupKitLead')}
          </p>

          {/* The three links are Raslan's to give. Until they arrive the page
              holds their places and says so, which is the honest version of a
              link that does not exist yet. */}
          <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
            {SLOTS.map((slot) => (
              <div
                key={slot}
                style={{
                  border: '1px dashed var(--yn-grey-dark)',
                  borderRadius: 'var(--yn-r-pill)',
                  padding: '14px 22px',
                  opacity: 0.6,
                }}
              >
                <Micro>{t('build.startupKitSlot')}</Micro>
              </div>
            ))}
          </div>

          {meta.href ? (
            <div style={{ marginTop: 24 }}>
              <Button tone="purple" href={meta.href}>
                {t('build.githubCta')}
              </Button>
            </div>
          ) : null}
        </Card>
      </Section>
    </Page>
  )
}
