// Interface the UI depends on:
//   list() -> { subscription: { status, renewsOn?, endsOn?, endedOn?, paymentMethod? } }
//   startCheckout() / openPortal() -> { url }   (real, later: Stripe Checkout and Customer Portal)
// Returning from Checkout is NOT proof of payment: the UI re-reads list() until the backend says active.
import { pickService } from '../../lib/demo'
import { mockBilling } from './mockBilling'
import { realBilling } from './realBilling'

export const billingService = pickService(mockBilling, realBilling)
