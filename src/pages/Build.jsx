import Page from '../components/layout/Page.jsx'
import { ArchPyramid } from '../brand/marks.jsx'
import { Button, PillRow } from '../components/ui/Button.jsx'
import { Display, Section } from '../components/ui/Pieces.jsx'
import { counts } from '../lib/content.js'

/** The five sections, in the original site's order. */
const SECTIONS = [
  { label: 'Repositories', to: '/build/repositories' },
  { label: 'Templates', to: '/build/templates' },
  { label: 'Showcase', to: '/build/showcase', meta: `${counts.showcase}` },
  { label: 'Capstones', to: '/build/capstones', meta: `${counts.capstones}` },
  { label: 'Apps', to: '/build/apps', meta: `${counts.apps}` },
]

export default function Build() {
  return (
    <Page title="Build">
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
              Build
            </Display>
            <p className="yn-display" style={{ fontSize: 'var(--yn-h3)', margin: '10px 0 0' }}>
              This is where building happens, in the open.
            </p>

            <p style={{ margin: '24px 0 16px', fontSize: 15, color: 'var(--yn-grey-dark)' }}>
              Start by exploring EFG&apos;s public repositories.
            </p>
            <Button tone="purple" size="sm" href="https://github.com/efg-hermes">
              github.com/efg-hermes →
            </Button>

            <div style={{ display: 'grid', gap: 12, marginTop: 40 }}>
              {SECTIONS.map((section) => (
                <PillRow key={section.label} to={section.to} meta={section.meta}>
                  {section.label}
                </PillRow>
              ))}
            </div>
          </div>

          <ArchPyramid tone="purple" animate={false} />
        </div>
      </Section>
    </Page>
  )
}
