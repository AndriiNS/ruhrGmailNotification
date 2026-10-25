// DEMO DATA ONLY. Fictional addresses (example.com). Replace with API responses later;
// the shape below is what the UI expects from services/dashboardService.js.
const activity = [
  { id: 'a1', mailbox: 'anna.demo@example.com', from: 'Lena Fischer', subject: 'Invoice 2026-114 attached', channel: 'telegram', status: 'delivered', at: '2026-10-25T09:41:00Z' },
  { id: 'a2', mailbox: 'anna.demo@example.com', from: 'Deutsche Bahn', subject: 'Your booking confirmation', channel: 'telegram', status: 'delivered', at: '2026-10-25T08:12:00Z' },
  { id: 'a3', mailbox: 'work.demo@example.com', from: 'Team calendar', subject: 'Meeting moved to Thursday', channel: 'telegram', status: 'failed', at: '2026-10-24T16:03:00Z' },
]

const base = {
  limits: { maxMailboxes: 3 },
  channels: { telegram: { status: 'connected' }, whatsapp: { status: 'planned' } },
}

export const dashboardScenarios = {
  active: {
    ...base,
    subscription: { status: 'active', renewsOn: '2026-11-25' },
    mailboxes: [
      { id: 'm1', provider: 'Gmail', address: 'anna.demo@example.com', status: 'connected', channels: ['Telegram'] },
      { id: 'm2', provider: 'Gmail', address: 'work.demo@example.com', status: 'needs_reconnect', channels: ['Telegram'] },
    ],
    activity,
  },
  new: {
    ...base,
    subscription: { status: 'none' },
    channels: { telegram: { status: 'not_connected' }, whatsapp: { status: 'planned' } },
    mailboxes: [],
    activity: [],
  },
  trial: {
    ...base,
    subscription: { status: 'trial', trialEndsOn: '2026-11-01' },
    mailboxes: [{ id: 'm1', provider: 'Gmail', address: 'anna.demo@example.com', status: 'connected', channels: ['Telegram'] }],
    activity: activity.slice(0, 2),
  },
  payment_required: {
    ...base,
    subscription: { status: 'payment_required' },
    mailboxes: [
      { id: 'm1', provider: 'Gmail', address: 'anna.demo@example.com', status: 'connected', channels: ['Telegram'] },
      { id: 'm2', provider: 'Gmail', address: 'work.demo@example.com', status: 'connected', channels: ['Telegram'] },
      { id: 'm3', provider: 'Gmail', address: 'shop.demo@example.com', status: 'connected', channels: ['Telegram'] },
    ],
    activity,
  },
  expired: {
    ...base,
    subscription: { status: 'expired', endedOn: '2026-10-10' },
    mailboxes: [{ id: 'm1', provider: 'Gmail', address: 'anna.demo@example.com', status: 'connected', channels: ['Telegram'] }],
    activity: activity.slice(2),
  },
}

export const scenarioLabels = {
  active: 'Active, 2 of 3 mailboxes',
  new: 'New user (nothing connected)',
  trial: 'Trial',
  payment_required: 'Payment required, limit reached',
  expired: 'Expired',
  error: 'Loading error',
}
