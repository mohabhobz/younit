import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Card, Grid } from '../components/ui/Card.jsx'
import { Display, PageHeading, Section } from '../components/ui/Pieces.jsx'

/**
 * The two Build sections that have no content yet. Both say so plainly rather
 * than showing invented listings — the same stance the original site took.
 */
const SECTIONS = {
  repositories: {
    title: 'Repositories',
    sub: 'Curated public repositories from EFG Hermes. Clone, fork, build.',
    empty: 'Repository listings loading soon.',
    cta: { label: 'github.com/efg-hermes →', href: 'https://github.com/efg-hermes' },
  },
  templates: {
    title: 'Templates',
    sub: 'Starter templates for building on the EFG API. Each links to GitHub.',
    categories: ['Strategies', 'Screeners', 'Portfolio Tools', 'Educational Notebooks'],
    empty: 'Templates loading soon.',
  },
}

export default function BuildSection({ section }) {
  const meta = SECTIONS[section]
  if (!meta) return <NotFound />

  return (
    <Page title={meta.title}>
      <Section>
        <Breadcrumb trail={[{ label: 'Build', to: '/build' }, { label: meta.title }]} />
        <PageHeading sub={meta.sub}>{meta.title}</PageHeading>

        {meta.categories ? (
          <Grid cols={2} gap={28}>
            {meta.categories.map((category) => (
              <Card key={category} style={{ height: '100%' }}>
                <Display size="track-title" as="h2">
                  {category}
                </Display>
                <p style={{ margin: '12px 0 0', fontSize: 'var(--yn-body-size)', color: 'var(--yn-grey-dark)' }}>
                  {meta.empty}
                </p>
              </Card>
            ))}
          </Grid>
        ) : (
          <Card>
            <p style={{ margin: 0, fontSize: 'var(--yn-body-size)', color: 'var(--yn-grey-dark)' }}>{meta.empty}</p>
            {meta.cta ? (
              <div style={{ marginTop: 24 }}>
                <Button tone="purple" href={meta.cta.href}>
                  {meta.cta.label}
                </Button>
              </div>
            ) : null}
          </Card>
        )}
      </Section>
    </Page>
  )
}
