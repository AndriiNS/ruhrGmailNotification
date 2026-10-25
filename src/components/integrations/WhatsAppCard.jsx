import Card from '../ui/Card'
import StatusBadge from '../common/StatusBadge'

export default function WhatsAppCard() {
  return (
    <Card aria-labelledby="wa-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="wa-title" className="text-lg font-bold">WhatsApp</h2>
        <StatusBadge status="planned" />
      </div>
      <p className="mt-3 text-sm text-muted">
        WhatsApp notifications are planned but not available yet. Nothing can be connected today, and we
        will not ask for your phone number until the channel is ready.
      </p>
      <p className="mt-3 text-sm text-muted">
        WhatsApp business messaging has its own rules, such as approved message templates and opt-in,
        so we will launch it separately after Telegram is proven.
      </p>
    </Card>
  )
}
