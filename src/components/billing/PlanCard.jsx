import Card from '../ui/Card'
import { PLAN } from '../../lib/config'

export default function PlanCard() {
  return (
    <Card aria-labelledby="plan-title">
      <h2 id="plan-title" className="text-lg font-bold">Your plan</h2>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold">€{PLAN.priceEur.toFixed(2)}</span>
        <span className="text-muted">per month</span>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        <li>Up to {PLAN.maxMailboxes} Gmail mailboxes</li>
        <li>Telegram notifications</li>
        <li>Status checks for every mailbox and channel</li>
      </ul>
      <p className="mt-4 border-t border-line pt-3 text-xs text-muted">
        Payments are handled by Stripe. We never see or store your card details. Cancel any time; alerts
        continue until the end of the paid period.
      </p>
    </Card>
  )
}
