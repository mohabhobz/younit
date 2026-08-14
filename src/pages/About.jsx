import Page from '../components/layout/Page.jsx'
import { Display, PageHeading, Rule, Section } from '../components/ui/Pieces.jsx'

/** Copy carried over verbatim from the original site's About page. */
export default function About() {
  return (
    <Page title="About">
      <Section>
        <PageHeading>About</PageHeading>
        <div className="yn-prose">
          <p>
            EFG Innovation Hub is Egypt&rsquo;s open initiative for capital markets
            education, infrastructure, and community. It is built and maintained by EFG
            Holding, and it is free, permanently.
          </p>
          <p>
            The Hub is not a trading platform. It does not execute trades, hold positions,
            or provide investment advice. It is an educational initiative built on
            EFG&rsquo;s open market data API — the same infrastructure that powers
            EFG&rsquo;s own research and technology operations.
          </p>
          <p>
            The three pillars — Learn, Build, Compete — reflect the three things the Hub
            enables. Content in the Learn pillar is written by the EFG research and data
            science team. The Build pillar points to real code in real repositories. The
            Compete pillar, opening in Phase 2, provides transparent, algorithmic rankings
            of participant-built strategies running on live EGX data.
          </p>
          <p>
            Users own their work. Everything built on EFG infrastructure belongs to the
            builders. EFG does not claim ownership of student projects, capstone papers, or
            community applications.
          </p>
        </div>
      </Section>

      <Rule animate={false} />

      <Section>
        <Display size="h3" as="h2" style={{ marginBottom: 24 }}>
          Why this exists
        </Display>
        <div className="yn-prose">
          <p>
            Egypt has no shortage of brilliant people. It has had a shortage of access. The
            Innovation Hub exists to remove one specific barrier: the infrastructure to
            build real things on real markets. Not a sandbox. Not a toy. The actual API,
            open to anyone willing to learn.
          </p>
        </div>
      </Section>
    </Page>
  )
}
