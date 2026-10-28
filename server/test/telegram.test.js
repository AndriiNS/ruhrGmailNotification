import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createTelegramService, TelegramServiceError } from '../src/telegram/service.js'
import { TelegramApiError, createBot } from '../src/telegram/bot.js'
import { createApp } from '../src/app.js'

// In-memory stand-ins so no network or database is needed.
function fakeRepo() {
  const rows = new Map()
  const owners = new Map() // chat_id -> user_id
  return {
    rows,
    async saveLink(userId, hash, expiresAt) { rows.set(userId, { status: 'pending', chat_id: null, hash, expiresAt }) },
    async findPendingByHash(hash) {
      for (const [id, r] of rows) if (r.status === 'pending' && r.hash === hash && new Date(r.expiresAt) > new Date(fakeNow.t)) return id
      return null
    },
    async markConnected(userId, hash, { chatId, chatName }) {
      const r = rows.get(userId)
      if (!r || r.hash !== hash) return 'gone'
      if (owners.has(chatId) && owners.get(chatId) !== userId) return 'chat_taken'
      owners.set(chatId, userId)
      rows.set(userId, { status: 'connected', chat_id: chatId, chat_name: chatName, hash: null })
      return 'ok'
    },
    async get(userId) { return rows.get(userId) ?? null },
    async markError(userId) { rows.set(userId, { ...rows.get(userId), status: 'error' }) },
    async remove(userId) { rows.delete(userId) },
  }
}
const fakeNow = { t: Date.parse('2026-10-28T12:00:00Z') }
function setup(botOverrides = {}) {
  const sent = []
  const bot = { getMe: async () => ({ username: 'MailPingBot' }), sendMessage: async (chatId, text) => { sent.push({ chatId, text }) }, ...botOverrides }
  const repo = fakeRepo()
  let n = 0
  const service = createTelegramService({ repo, bot, now: () => fakeNow.t, newToken: () => `tok${++n}` })
  return { service, repo, sent }
}
const startMsg = (text, chatId = 111, user = { username: 'anna' }) => ({ update_id: 1, message: { text, chat: { id: chatId, type: 'private' }, from: user } })

test('connect creates a deep link and stores only a hash of the token', async () => {
  const { service, repo } = setup()
  const r = await service.startConnect('u1')
  assert.equal(r.url, 'https://t.me/MailPingBot?start=tok1')
  assert.equal(r.expiresInMinutes, 15)
  assert.ok(!JSON.stringify([...repo.rows.values()]).includes('tok1'))
})

test('pressing Start with a valid token connects the chat', async () => {
  const { service, repo, sent } = setup()
  await service.startConnect('u1')
  await service.handleUpdate(startMsg('/start tok1'))
  assert.equal(repo.rows.get('u1').status, 'connected')
  assert.equal(repo.rows.get('u1').chat_id, 111)
  assert.equal(repo.rows.get('u1').chat_name, '@anna')
  assert.match(sent.at(-1).text, /Connected/)
})

test('a token works once and expires after 15 minutes', async () => {
  const { service, sent } = setup()
  await service.startConnect('u1')
  await service.handleUpdate(startMsg('/start tok1'))
  await service.handleUpdate(startMsg('/start tok1', 222))
  assert.match(sent.at(-1).text, /invalid or has expired/)
  await service.startConnect('u2')
  fakeNow.t += 16 * 60_000
  await service.handleUpdate(startMsg('/start tok2', 333))
  assert.match(sent.at(-1).text, /invalid or has expired/)
  fakeNow.t -= 16 * 60_000
})

test('an unknown token or plain /start never connects anything', async () => {
  const { service, repo, sent } = setup()
  await service.handleUpdate(startMsg('/start nope'))
  await service.handleUpdate(startMsg('/start'))
  await service.handleUpdate(startMsg('hello'))
  assert.equal(repo.rows.size, 0)
  assert.equal(sent.length, 2)
})

test('a chat already used by another account is refused', async () => {
  const { service, repo, sent } = setup()
  await service.startConnect('u1'); await service.handleUpdate(startMsg('/start tok1', 111))
  await service.startConnect('u2'); await service.handleUpdate(startMsg('/start tok2', 111))
  assert.match(sent.at(-1).text, /already connected to another/)
  assert.equal(repo.rows.get('u2').status, 'pending')
})

test('test notification: not connected, success, blocked bot, rate limit', async () => {
  const ok = setup()
  await assert.rejects(ok.service.sendTest('u1'), (e) => e instanceof TelegramServiceError && e.code === 'not_connected')
  await ok.service.startConnect('u1'); await ok.service.handleUpdate(startMsg('/start tok1'))
  assert.ok((await ok.service.sendTest('u1')).acceptedAt)

  const blocked = setup({ sendMessage: async (id, t) => { if (/Test notification/.test(t)) throw new TelegramApiError(403, 'blocked') } })
  await blocked.service.startConnect('u1'); await blocked.service.handleUpdate(startMsg('/start tok1'))
  await assert.rejects(blocked.service.sendTest('u1'), { code: 'bot_blocked' })
  assert.equal(blocked.repo.rows.get('u1').status, 'error')

  const limited = setup({ sendMessage: async (id, t) => { if (/Test notification/.test(t)) throw new TelegramApiError(429, 'slow', 7) } })
  await limited.service.startConnect('u1'); await limited.service.handleUpdate(startMsg('/start tok1'))
  await assert.rejects(limited.service.sendTest('u1'), { code: 'rate_limited', retryAfter: 7 })
  assert.equal(limited.repo.rows.get('u1').status, 'connected') // rate limit does not break the channel
})

test('cancel only removes a pending link; disconnect removes the connection', async () => {
  const { service, repo } = setup()
  await service.startConnect('u1'); await service.cancel('u1'); assert.equal(repo.rows.size, 0)
  await service.startConnect('u1'); await service.handleUpdate(startMsg('/start tok2'))
  await service.cancel('u1'); assert.equal(repo.rows.get('u1').status, 'connected')
  await service.disconnect('u1'); assert.equal(repo.rows.size, 0)
})

test('the bot client never leaks the token in errors', async () => {
  const token = '123456789:SECRETSECRETSECRETSECRETSECRET'
  const bot = createBot(token, async () => new Response(JSON.stringify({ ok: false, error_code: 400, description: `bad ${token}` }), { status: 400 }))
  await assert.rejects(bot.sendMessage(1, 'x'), (e) => !e.message.includes(token) && e.code === 400)
  const down = createBot(token, async () => { throw new Error(`fetch failed for ${token}`) })
  await assert.rejects(down.getMe(), (e) => e.code === 0 && !e.message.includes(token))
})

async function http(app, path, headers = {}) {
  const server = app.listen(0)
  try {
    const res = await fetch(`http://127.0.0.1:${server.address().port}${path}`, { method: 'POST', headers })
    return { status: res.status, body: await res.json() }
  } finally { server.close() }
}
const config = { corsOrigin: 'http://localhost:5173' }
const auth = (ok = true) => ({ auth: { getUser: async () => (ok ? { data: { user: { id: 'u1', email: 'a@b.co' } }, error: null } : { data: { user: null }, error: {} }) } })

test('routes: need a verified user, answer 503 without a bot, map errors to JSON', async () => {
  assert.equal((await http(createApp(config, auth(false), {}), '/api/telegram/connect', { authorization: 'Bearer x' })).status, 401)
  const none = await http(createApp(config, auth(), {}), '/api/telegram/connect', { authorization: 'Bearer x' })
  assert.deepEqual(none, { status: 503, body: { error: 'telegram_not_configured' } })
  const { service } = setup()
  const app = createApp(config, auth(), { telegram: service })
  const conn = await http(app, '/api/telegram/connect', { authorization: 'Bearer x' })
  assert.equal(conn.status, 200); assert.match(conn.body.url, /^https:\/\/t\.me\/MailPingBot\?start=/)
  const test = await http(app, '/api/telegram/test', { authorization: 'Bearer x' })
  assert.deepEqual(test, { status: 409, body: { error: 'not_connected' } }) // still pending, not connected
})
