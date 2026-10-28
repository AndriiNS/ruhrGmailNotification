import Card from '../ui/Card'
import Button from '../ui/Button'
import StatusBadge from '../common/StatusBadge'
import FormMessage from '../common/FormMessage'

const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const copy = {
  none: () => 'You do not have a subscription yet. Subscribe to start receiving alerts.',
  active: (s) => (s.renewsOn ? `Your subscription renews on ${fmt(s.renewsOn)}.` : 'Your subscription is active.'),
  canceling: (s) => (s.endsOn ? `Your subscription ends on ${fmt(s.endsOn)}. Alerts continue until then.` : 'Your subscription will end. Alerts continue until the end of the paid period.'),
  payment_required: () => 'The last payment did not go through.',
  expired: (s) => (s.endedOn ? `Your subscription ended on ${fmt(s.endedOn)}.` : 'Your subscription has ended.'),
}

export default function BillingStatusCard({ subscription, onSubscribe, onManage, busy }) {
  const s = subscription
  const buy = s.status === 'none' || s.status === 'expired'
  const paused = ['payment_required', 'expired', 'none'].includes(s.status)
  return (
    <Card aria-labelledby="bill-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="bill-title" className="text-lg font-bold">Subscription</h2>
        <StatusBadge status={s.status} />
      </div>
      <p className="mt-2 text-sm text-muted">{copy[s.status]?.(s)}</p>
      {s.paymentMethod && (
        <p className="mt-1 text-sm text-muted">Payment method: {s.paymentMethod.brand} ending {s.paymentMethod.last4}</p>
      )}
      {paused && (
        <div className="mt-3">
          <FormMessage>Email alerts are paused until the subscription is active.</FormMessage>
        </div>
      )}
      <div className="mt-4">
        {buy ? (
          <Button onClick={onSubscribe} loading={busy}>Subscribe</Button>
        ) : (
          <Button variant={s.status === 'payment_required' ? 'primary' : 'secondary'} onClick={onManage} loading={busy}>
            {s.status === 'payment_required' ? 'Update payment method' : 'Manage subscription'}
          </Button>
        )}
      </div>
    </Card>
  )
}
