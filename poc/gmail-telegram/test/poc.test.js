import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pollOnce } from '../src/monitor.js'
import { formatNotification } from '../src/format.js'
import { sendMessage } from '../src/telegram.js'

const memStore = (init) => {
  let s = init
  return { load: () => structuredClone(s), save: (n) => { s = structuredClone(n) }, peek: () => s }
}
const msgs = { a: { id: 'a', labelIds: ['INBOX'], from: 'x@y.z', subject: 'Hi', internalDate: '1' }, s: { id: 's', labelIds: ['SENT'] } }
const fakeGmail = (events) => ({
  getCurrentHistoryId: async () => '100',
  listHistory: async () => ({ historyId: '200', history: [{ messagesAdded: events.map((id) => ({ message: { id } })) }] }),
  getMetadata: async (id) => msgs[id] ?? null,
})
const log = () => {}

test('first run sets baseline and sends nothing', async () => {
  const sent = []
  const store = memStore({ historyId: null, notified: [] })
  await pollOnce({ gmail: fakeGmail(['a']), send: async (t) => sent.push(t), store, log })
  assert.equal(sent.length, 0)
  assert.equal(store.peek().historyId, '100')
})

test('new inbox mail is sent once; repeated events do not duplicate; non-inbox skipped', async () => {
  const sent = []
  const store = memStore({ historyId: '100', notified: [] })
  const deps = { gmail: fakeGmail(['a', 'a', 's']), send: async (t) => sent.push(t), store, log }
  await pollOnce(deps)
  await pollOnce(deps)
  assert.equal(sent.length, 1)
  assert.match(sent[0], /Subject: Hi/)
  assert.equal(store.peek().historyId, '200')
})

test('failed send keeps the checkpoint so the mail is retried', async () => {
  const store = memStore({ historyId: '100', notified: [] })
  await assert.rejects(pollOnce({ gmail: fakeGmail(['a']), send: async () => { throw new Error('down') }, store, log }))
  assert.equal(store.peek().historyId, '100')
  const sent = []
  await pollOnce({ gmail: fakeGmail(['a']), send: async (t) => sent.push(t), store, log })
  assert.equal(sent.length, 1)
})

test('expired checkpoint (404) resets baseline without notifying', async () => {
  const gmail = { ...fakeGmail([]), listHistory: async () => { throw Object.assign(new Error('gone'), { status: 404 }) } }
  const store = memStore({ historyId: '1', notified: [] })
  const r = await pollOnce({ gmail, send: async () => assert.fail('must not send'), store, log })
  assert.equal(r.sent, 0)
  assert.equal(store.peek().historyId, '100')
})

test('notification text is sanitized and truncated', () => {
  const t = formatNotification({ from: 'a\nb', subject: 'x'.repeat(500), internalDate: '1' })
  assert.ok(!t.includes('a\nb'))
  assert.ok(t.split('\n')[2].length < 220)
})

test('Telegram errors are explained and never contain the token', async () => {
  const token = '123456789:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  const real = globalThis.fetch
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: false, error_code: 400, description: `Bad Request: chat not found ${token}` }), { status: 400 })
  try {
    await assert.rejects(sendMessage(token, '1', 'x'), (e) => /press Start/.test(e.message) && !e.message.includes(token))
  } finally { globalThis.fetch = real }
})
