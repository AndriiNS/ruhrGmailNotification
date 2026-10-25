import Dialog from '../ui/Dialog'
import Button from '../ui/Button'

// Shown only in demo mode instead of redirecting to Stripe.
export default function DemoBillingDialog({ kind, onClose, onSimulate }) {
  if (kind === 'portal') {
    return (
      <Dialog open onClose={onClose} title="Billing portal (demo)">
        In the live service this opens Stripe’s secure portal, where you update your card, see invoices and
        cancel. In demo mode nothing opens and nothing changes.
      </Dialog>
    )
  }
  return (
    <Dialog
      open
      onClose={onClose}
      title="Checkout (demo)"
      actions={
        <>
          <Button variant="secondary" onClick={() => onSimulate('cancelled')}>Simulate: cancelled</Button>
          <Button onClick={() => onSimulate('success')}>Simulate: paid</Button>
        </>
      }
    >
      In the live service you are taken to Stripe’s secure payment page. In demo mode no payment is made and
      nothing is charged. Choose how you would return:
    </Dialog>
  )
}
