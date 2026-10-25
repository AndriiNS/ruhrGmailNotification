import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader title="Terms of Service" description="The rules for using the service." />
      <Card>
        <Badge tone="neutral">Placeholder</Badge>
        <p className="mt-3 text-sm text-muted">This screen is built in stage 8.</p>
      </Card>
    </div>
  )
}
