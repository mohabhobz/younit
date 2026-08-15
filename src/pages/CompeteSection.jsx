import { useParams } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import { Card } from '../components/ui/Card.jsx'
import { PageHeading, Section } from '../components/ui/Pieces.jsx'

/**
 * Four sections that open in Phase 2. Each states what it will be and nothing
 * more — no ranks, no names, no figures. The description is the real one, which
 * is the point of the note at the bottom.
 */
export const COMPETE_SECTIONS = {
  leaderboard: {
    title: 'Leaderboard',
    description: 'Transparent, algorithmic rankings across all active participants.',
  },
  seasons: {
    title: 'Seasons',
    description: 'Structured competition windows with defined rules and prizes.',
  },
  hackathons: {
    title: 'Hackathons',
    description: 'Time-boxed building challenges open to all.',
  },
  'wall-of-fame': {
    title: 'Wall of Fame',
    description: 'A permanent record of exceptional builders and performances.',
  },
}

export default function CompeteSection() {
  const { section } = useParams()
  const meta = COMPETE_SECTIONS[section]
  if (!meta) return <NotFound />

  return (
    <Page title={meta.title} footer="dark">
      <Section>
        <Breadcrumb trail={[{ label: 'Compete', to: '/compete' }, { label: meta.title }]} />
        <PageHeading sub={meta.description}>{meta.title}</PageHeading>

        <Card tone="blue" outline="ink">
          <p style={{ margin: 0, fontSize: 'var(--yn-body-size)', lineHeight: 1.6 }}>
            This section opens in Phase 2. The description above is accurate — not a
            placeholder.
          </p>
        </Card>
      </Section>
    </Page>
  )
}
