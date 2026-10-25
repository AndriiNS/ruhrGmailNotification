// Interface the UI depends on (same in demo and real mode):
//   list() -> { subscription: { status, renewsOn?, endsOn?, endedOn?, paymentMethod? } }
//        status: none | active | canceling | payment_required | expired. The backend is the source of truth.
//   startCheckout() -> { url }   (real: Stripe Checkout Session; the UI redirects to url)
//   openPortal() -> { url }      (real: Stripe Customer Portal for card, invoices and cancellation)
// Returning from Checkout (?checkout=success) is NOT proof of payment: the UI re-reads list() and
// only shows "active" once the backend reports it (webhook-confirmed).
import { DEMO_MODE } from '../../lib/config'
import { mockBilling } from './mockBilling'
import { BillingServiceError } from './errors'

const notConfigured = async () => {
  throw new BillingServiceError('not_configured')
}

export const billingService = DEMO_MODE
  ? mockBilling
  : { list: notConfigured, startCheckout: notConfigured, openPortal: notConfigured }
