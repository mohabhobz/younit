import Page from '../components/layout/Page.jsx'
import { Button } from '../components/ui/Button.jsx'
import { PageHeading, Section } from '../components/ui/Pieces.jsx'

export default function NotFound() {
  return (
    <Page title="Page not found">
      <Section>
        <PageHeading sub="That page does not exist — or has not been built yet.">
          Not found
        </PageHeading>
        <Button tone="blue" to="/">
          Back to the homepage
        </Button>
      </Section>
    </Page>
  )
}
