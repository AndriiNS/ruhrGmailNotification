import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader title="Page not found" description="The address does not exist. Check the link or go back to the start." />
      <Card>
        <Badge tone="neutral">Placeholder</Badge>
        <p className="mt-3 text-sm text-muted">This screen is built in stage 1.</p>
      </Card>
    </div>
  )
}
