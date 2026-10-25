// Provider catalog (also what the real backend will report) and DEMO starting data.
export const providers = [
  { id: 'gmail', name: 'Gmail', available: true },
  { id: 'outlook', name: 'Outlook / Microsoft 365', available: false },
  { id: 'imap', name: 'Other email (IMAP)', available: false, note: 'Only for providers that allow third-party access.' },
]

export const channelCatalog = [
  { id: 'telegram', name: 'Telegram', available: true },
  { id: 'whatsapp', name: 'WhatsApp', available: false },
]

export const providerName = (id) => providers.find((p) => p.id === id)?.name ?? id
export const channelName = (id) => channelCatalog.find((c) => c.id === id)?.name ?? id

// DEMO DATA ONLY (fictional example.com addresses).
export const initialDemoMailboxes = [
  { id: 'm1', provider: 'gmail', address: 'anna.demo@example.com', status: 'connected', channels: ['telegram'], demo: true },
  { id: 'm2', provider: 'gmail', address: 'work.demo@example.com', status: 'needs_reconnect', channels: ['telegram'], demo: true },
]
