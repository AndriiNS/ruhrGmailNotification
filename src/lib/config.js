// Central app configuration. Real values come from environment variables later.
// VITE_DEMO_MODE only matters without Supabase keys (offline UI development). With keys, demo data is admin-only (lib/demo.js).
// Nothing in the UI may present a mock result as a real connection.
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'

export const PLAN = {
  name: 'MailPing',
  priceEur: 1.99,
  maxMailboxes: 3,
}

export const APP_NAME = 'MailPing'

// Placeholder contact address. Replace with the real support mailbox before launch.
export const SUPPORT_EMAIL = 'support@example.com'

// Real authentication is used whenever Supabase keys are present. Only the publishable key
// belongs in the browser; never put the secret/service_role key in a VITE_ variable.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
export const REAL_AUTH = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY)
// True while sign-in/sign-up are mock: demo labels and "no email sent" texts depend on this.
export const AUTH_DEMO = DEMO_MODE && !REAL_AUTH
