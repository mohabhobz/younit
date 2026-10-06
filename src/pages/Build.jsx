import Page from '../components/layout/Page.jsx'
import { BlockForms } from '../brand/marks.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Display, Section } from '../components/ui/Pieces.jsx'
import { useI18n } from '../lib/i18n.jsx'

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
            {/* Raslan gave both the words and the address: the button names
                the organisation and opens the SDK, which is the repository a
                reader coming off this page actually wants. */}
            <Button
              tone="purple"
              size="sm"
              href="https://github.com/efg-hermes-younit/younit-python-sdk"
            >
              {t('build.githubCta')}
            </Button>

          </div>

          {/* The branding deck's block forms. They stood on the homepage for
              a day and came off it; this is the page they were kept for, and
              the only page that carries them. They drop in a row at a time and
              then keep floating. */}
          <BlockForms />
        </div>

        {/* The Repositories row stood here and led to a page that listed what
            the button above already opens. Raslan struck both out: the button
            is the way in now, so the row and its page are gone. */}
      </Section>
    </Page>
  )
}
