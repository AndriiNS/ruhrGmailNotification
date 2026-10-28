import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from '../src/app.js'
import { loadConfig } from '../src/config.js'

const config = { port: 0, supabaseUrl: 'http://x', supabaseSecretKey: 'k', corsOrigin: 'http://localhost:5173' }
const fakeSupabase = (impl) => ({ auth: { getUser: impl } })

async function request(app, path, headers = {}) {
  const server = app.listen(0)
  try {
    const res = await fetch(`http://127.0.0.1:${server.address().port}${path}`, { headers })
    return { status: res.status, body: await res.json() }
  } finally {
    server.close()
  }
}

test('health is public', async () => {
  const r = await request(createApp(config, fakeSupabase(async () => { throw new Error('unused') })), '/health')
  assert.deepEqual(r, { status: 200, body: { ok: true } })
})

test('protected route rejects missing and invalid tokens', async () => {
  const app = createApp(config, fakeSupabase(async () => ({ data: { user: null }, error: { message: 'bad' } })))
  assert.equal((await request(app, '/api/me')).status, 401)
  assert.equal((await request(app, '/api/me', { authorization: 'Bearer nope' })).status, 401)
})

test('protected route accepts a token Supabase verifies', async () => {
  const app = createApp(config, fakeSupabase(async (t) => ({ data: { user: { id: 'u1', email: 'a@b.co' } }, error: t === 'good' ? null : { message: 'bad' } })))
  const r = await request(app, '/api/me', { authorization: 'Bearer good' })
  assert.equal(r.status, 200)
  assert.deepEqual(r.body.user, { id: 'u1', email: 'a@b.co', isAdmin: false })
})

test('auth service outage returns 503, not a pass', async () => {
  const app = createApp(config, fakeSupabase(async () => { throw new Error('down') }))
  assert.equal((await request(app, '/api/me', { authorization: 'Bearer x' })).status, 503)
})

test('config requires secrets', () => {
  assert.throws(() => loadConfig({}), /SUPABASE_URL, SUPABASE_SECRET_KEY/)
})
