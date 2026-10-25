import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function MailboxesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader title="Mailboxes" description="Connect up to 3 mailboxes and choose channels for each." />
      <Card>
        <Badge tone="neutral">Placeholder</Badge>
        <p className="mt-3 text-sm text-muted">This screen is built in stage 5.</p>
      </Card>
    </div>
  )
}
