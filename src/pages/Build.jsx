import Page from '../components/layout/Page.jsx'
import { ArchPyramid } from '../brand/marks.jsx'
import { Button, PillRow } from '../components/ui/Button.jsx'
import { Display, Section } from '../components/ui/Pieces.jsx'
import { useI18n } from '../lib/i18n.jsx'

/**
 * One section for now. Templates, Showcase, Capstones and Apps were the other
 * four and marketing asked for all of them to go; the counts they advertised
 * went with them.
 */
const SECTIONS = [{ key: 'build.repositoriesTitle', to: '/build/repositories' }]

export default function Build() {
  const { t } = useI18n()

  return (
    <Page title={t('build.title')}>
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
              {t('build.title')}
            </Display>
            <p className="yn-display" style={{ fontSize: 'var(--yn-h3)', margin: '10px 0 0' }}>
              {t('build.sub')}
            </p>

            <p style={{ margin: '24px 0 16px', fontSize: 'var(--yn-body-size)', color: 'var(--yn-grey-dark)' }}>
              {t('build.lead')}
            </p>
            <Button tone="purple" size="sm" href="https://github.com/efg-hermes">
              {t('build.githubCta')}
            </Button>

          </div>

          {/* It was still. They asked for it to move here too, and to wear
              the header's colour. */}
          <ArchPyramid tone="chrome" />
        </div>

        {/* Full width, as on Learn, so the two pages keep the same shape. */}
        <div style={{ display: 'grid', gap: 12, marginTop: 48 }}>
          {SECTIONS.map((section) => (
            <PillRow key={section.key} to={section.to} meta={section.meta}>
              {t(section.key)}
            </PillRow>
          ))}
        </div>
      </Section>
    </Page>
  )
}
