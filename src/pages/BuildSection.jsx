import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Card, Grid } from '../components/ui/Card.jsx'
import { Display, PageHeading, Section } from '../components/ui/Pieces.jsx'
import { useI18n } from '../lib/i18n.jsx'

/**
 * The two Build sections that have no content yet. Both say so plainly rather
 * than showing invented listings — the same stance the original site took.
 */
const SECTIONS = {
  repositories: { key: 'repositories', href: 'https://github.com/efg-hermes' },
  templates: { key: 'templates', categories: true },
}

export default function BuildSection({ section }) {
  const { t } = useI18n()
  const meta = SECTIONS[section]
  if (!meta) return <NotFound />

  const title = t(`build.${meta.key}Title`)
  const empty = t(`build.${meta.key}Empty`)
  const categories = meta.categories ? t('build.templateCategories') : null

  return (
    <Page title={title}>
      <Section>
        <Breadcrumb trail={[{ label: t('build.title'), to: '/build' }, { label: title }]} />
        <PageHeading sub={t(`build.${meta.key}Sub`)}>{title}</PageHeading>

        {categories ? (
          <Grid cols={2} gap={28}>
            {categories.map((category) => (
              <Card key={category} style={{ height: '100%' }}>
                <Display size="track-title" as="h2">
                  {category}
                </Display>
                <p style={{ margin: '12px 0 0', fontSize: 'var(--yn-body-size)', color: 'var(--yn-grey-dark)' }}>
                  {empty}
                </p>
              </Card>
            ))}
          </Grid>
        ) : (
          <Card>
            <p style={{ margin: 0, fontSize: 'var(--yn-body-size)', color: 'var(--yn-grey-dark)' }}>{empty}</p>
            {meta.href ? (
              <div style={{ marginTop: 24 }}>
                <Button tone="purple" href={meta.href}>
                  {t('build.githubCta')}
                </Button>
              </div>
            ) : null}
          </Card>
        )}
      </Section>
    </Page>
  )
}
