// Central app configuration. Real values come from environment variables later.
// DEMO_MODE stays true until real backend integrations exist.
// While true, nothing in the UI may present a mock result as a real connection.
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'

export const PLAN = {
  name: 'MailPing',
  priceEur: 1.99,
  maxMailboxes: 3,
}

export const APP_NAME = 'MailPing'
