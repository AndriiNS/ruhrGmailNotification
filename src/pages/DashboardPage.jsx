import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader title="Dashboard" description="Subscription, mailboxes and channel status at a glance." />
      <Card>
        <Badge tone="neutral">Placeholder</Badge>
        <p className="mt-3 text-sm text-muted">This screen is built in stage 4.</p>
      </Card>
    </div>
  )
}
