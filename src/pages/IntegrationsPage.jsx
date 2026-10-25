import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function IntegrationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader title="Channels" description="Connect Telegram and WhatsApp." />
      <Card>
        <Badge tone="neutral">Placeholder</Badge>
        <p className="mt-3 text-sm text-muted">This screen is built in stage 6.</p>
      </Card>
    </div>
  )
}
