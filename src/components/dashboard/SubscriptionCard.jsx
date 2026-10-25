import Card from '../ui/Card'
import Button from '../ui/Button'
import StatusBadge from '../common/StatusBadge'
import FormMessage from '../common/FormMessage'
import { PLAN } from '../../lib/config'

const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function detail(s) {
  switch (s.status) {
    case 'active': return `Renews on ${fmt(s.renewsOn)} for €${PLAN.priceEur.toFixed(2)}.`
    case 'trial': return `Trial ends on ${fmt(s.trialEndsOn)}.`
    case 'expired': return `Ended on ${fmt(s.endedOn)}. Alerts are off.`
    case 'payment_required': return 'The last payment did not go through.'
    default: return `€${PLAN.priceEur.toFixed(2)} per month, up to ${PLAN.maxMailboxes} mailboxes.`
  }
}

export default function SubscriptionCard({ subscription }) {
  const paused = ['payment_required', 'expired', 'none'].includes(subscription.status)
  const needsPurchase = ['expired', 'none'].includes(subscription.status)
  return (
    <Card aria-labelledby="sub-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="sub-title" className="text-lg font-bold">Subscription</h2>
        <StatusBadge status={subscription.status} />
      </div>
      <p className="mt-2 text-sm text-muted">{detail(subscription)}</p>
      {paused && (
        <div className="mt-3">
          <FormMessage>Email alerts are paused until the subscription is active.</FormMessage>
        </div>
      )}
      <Button to="/app/billing" variant={paused ? 'primary' : 'secondary'} className="mt-4">
        {needsPurchase ? 'Subscribe' : 'Manage subscription'}
      </Button>
    </Card>
  )
}
