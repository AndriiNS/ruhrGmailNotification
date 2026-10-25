export class BillingServiceError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

const messages = {
  checkout_failed: 'We could not start the payment page. You have not been charged. Try again.',
  portal_failed: 'We could not open the billing portal. Try again in a moment.',
  network: 'We could not reach the server. Check your connection and try again.',
  not_configured: 'Billing is not set up yet.',
}

export const billingErrorMessage = (code) => messages[code] || 'Something went wrong. Try again in a moment.'
