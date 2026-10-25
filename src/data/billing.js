// DEMO DATA ONLY. Real values come from the backend, which mirrors Stripe via webhooks.
// Card details are never handled by this app; Stripe Checkout and the Stripe portal own them.
const card = { brand: 'Visa', last4: '4242' }

export const billingScenarios = {
  active: { status: 'active', renewsOn: '2026-11-25', paymentMethod: card },
  canceling: { status: 'canceling', endsOn: '2026-11-25', paymentMethod: card },
  payment_required: { status: 'payment_required', paymentMethod: card },
  expired: { status: 'expired', endedOn: '2026-10-10' },
  none: { status: 'none' },
}

export const billingScenarioLabels = {
  active: 'Active',
  canceling: 'Cancels at period end',
  payment_required: 'Payment failed',
  expired: 'Expired',
  none: 'Never subscribed',
  error: 'Loading error',
}
