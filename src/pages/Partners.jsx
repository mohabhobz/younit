import Page from '../components/layout/Page.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Badge, Display, PageHeading, Rule, Section } from '../components/ui/Pieces.jsx'

/** Both lists are the original site's, unchanged. */
const UNIVERSITIES = [
  { name: 'American University in Cairo (AUC)', status: 'Partner' },
  { name: 'German University in Cairo (GUC)', status: 'Partner' },
  { name: 'Cairo University — Faculty of Computers & AI', status: 'Partner' },
  { name: 'Ain Shams University — Faculty of Engineering', status: 'Partner' },
  { name: 'Nile University', status: 'Partner' },
]

const DIVISIONS = [
  'Research Division — content and editorial',
  'Corporate Data Science — platform and infrastructure',
  'Technology — API and data feeds',
]

export default function Partners() {
  return (
    <Page title="Partners">
      <Section>
        <PageHeading>Partners</PageHeading>

        <Display size="h3" as="h2" style={{ marginBottom: 24 }}>
          University Partners
        </Display>
        <div style={{ display: 'grid', gap: 12, marginBottom: 64 }}>
          {UNIVERSITIES.map((uni) => (
            <Card
              key={uni.name}
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
              <span style={{ fontSize: 15 }}>{uni.name}</span>
              <Badge tone="blue">{uni.status}</Badge>
            </Card>
          ))}
        </div>

        <Rule animate={false} />

        <div style={{ paddingTop: 64 }}>
          <Display size="h3" as="h2" style={{ marginBottom: 24 }}>
            EFG Hermes
          </Display>
          <div className="yn-prose" style={{ marginBottom: 64 }}>
            {DIVISIONS.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <Rule animate={false} />

          <div style={{ paddingTop: 64 }}>
            <Display size="h3" as="h2" style={{ marginBottom: 24 }}>
              Acknowledgments
            </Display>
            <div className="yn-prose">
              <p>
                The Hub exists because of the students, researchers, and practitioners who
                took the Foundation Series in its earliest form and asked what came next.
                Their feedback shaped this platform.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </Page>
  )
}
