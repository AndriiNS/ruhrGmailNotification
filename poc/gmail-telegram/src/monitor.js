import { formatNotification } from './format.js'
import { rememberNotified } from './state.js'

// One polling cycle. Dependencies are injected so it can be tested without network.
// Guarantees: first run only sets a baseline; checkpoint advances only after all sends succeed;
// already-notified IDs are never sent twice.
export async function pollOnce({ gmail, send, store, log }) {
  const state = store.load()

  if (!state.historyId) {
    state.historyId = await gmail.getCurrentHistoryId()
    store.save(state)
    log('Baseline set. Only emails arriving from now on will be notified.')
    return { sent: 0 }
  }

  const ids = new Set()
  let latest = state.historyId
  let pageToken
  try {
    do {
      const r = await gmail.listHistory({ startHistoryId: state.historyId, pageToken })
      for (const h of r.history ?? []) for (const m of h.messagesAdded ?? []) ids.add(m.message.id)
      latest = r.historyId ?? latest
      pageToken = r.nextPageToken
    } while (pageToken)
  } catch (e) {
    if (e.status !== 404) throw e
    state.historyId = await gmail.getCurrentHistoryId()
    store.save(state)
    log('Checkpoint was too old for Gmail. Reset it; emails received while offline may be missed.')
    return { sent: 0 }
  }

  let sent = 0
  for (const id of ids) {
    if (state.notified.includes(id)) continue
    const msg = await gmail.getMetadata(id)
    if (msg?.labelIds.includes('INBOX')) {
      await send(formatNotification(msg))
      sent++
    }
    rememberNotified(state, id)
    store.save(state)
  }

  state.historyId = latest
  store.save(state)
  if (sent) log(`Sent ${sent} notification(s).`)
  return { sent }
}
