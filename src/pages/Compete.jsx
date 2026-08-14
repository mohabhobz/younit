import { Link } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import { COMPETE_SECTIONS } from './CompeteSection.jsx'
import { Card, Grid } from '../components/ui/Card.jsx'
import { Badge, PageHeading, Section } from '../components/ui/Pieces.jsx'
import Photo from '../components/ui/Photo.jsx'
import competeJpg from '../assets/compete-team.jpg'
import competeWebp from '../assets/compete-team.webp'

/**
 * Nothing here has launched. The page describes what each section will be and
 * shows no ranks, no names and no figures — which is also what the design
 * specifies. The four entries link to their own pages, as the original site did.
 */
const ORDER = ['leaderboard', 'hackathons', 'seasons', 'wall-of-fame']

export default function Compete() {
  return (
    <Page title="Compete" footer="dark">
      <Section>
        <PageHeading sub="Opening in Phase 2. Here is what each section will be.">
          Compete
        </PageHeading>

        <Card radius="band" style={{ padding: 'clamp(24px, 4vw, 48px)', background: 'transparent' }}>
          <Grid cols={2} gap={28} style={{ marginBottom: 40 }}>
            {ORDER.map((key) => {
              const item = COMPETE_SECTIONS[key]
              return (
                <Link
                  key={key}
                  to={`/compete/${key}`}
                  style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
                >
                  <Badge tone="purple">{item.title}</Badge>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      color: 'var(--yn-grey-dark)',
                      flex: 1,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </p>
                </Link>
              )
            })}
          </Grid>

          <Photo
            webp={competeWebp}
            jpg={competeJpg}
            width={2432}
            height={811}
            alt="Two builders at a desk, one screen showing code"
          />
        </Card>
      </Section>
    </Page>
  )
}
