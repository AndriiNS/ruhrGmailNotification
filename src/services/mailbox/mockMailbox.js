// DEMO ONLY. Nothing here contacts Google or any provider; no real mailbox is ever connected.
// Mailboxes created here carry demo: true so the UI can label them.
import { initialDemoMailboxes } from '../../data/mailboxes'
import { PLAN } from '../../lib/config'
import { MailboxServiceError } from './errors'

let store = structuredClone(initialDemoMailboxes)
let counter = 0
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockMailbox = {
  async list() {
    await delay(300)
    return structuredClone(store)
  },
  // outcome: 'success' | 'cancelled' | 'error' (chosen by the user in the demo dialog)
  async connect({ provider, outcome = 'success', reconnectId }) {
    await delay(700)
    if (outcome === 'cancelled') throw new MailboxServiceError('access_denied')
    if (outcome === 'error') throw new MailboxServiceError('provider_error')
    if (reconnectId) {
      store = store.map((m) => (m.id === reconnectId ? { ...m, status: 'connected' } : m))
      return structuredClone(store.find((m) => m.id === reconnectId))
    }
    // The real backend must enforce this limit as well.
    if (store.length >= PLAN.maxMailboxes) throw new MailboxServiceError('limit_reached')
    counter += 1
    const mailbox = {
      id: `demo-${counter}`,
      provider,
      address: `demo-mailbox-${counter}@example.com`,
      status: 'connected',
      channels: ['telegram'],
      demo: true,
    }
    store = [...store, mailbox]
    return structuredClone(mailbox)
  },
  async setChannels(id, channels) {
    await delay(300)
    store = store.map((m) => (m.id === id ? { ...m, channels } : m))
    return structuredClone(store.find((m) => m.id === id))
  },
  async disconnect(id) {
    await delay(400)
    store = store.filter((m) => m.id !== id)
  },
}
