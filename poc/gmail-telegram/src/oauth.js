import http from 'node:http'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export const SCOPE = 'https://www.googleapis.com/auth/gmail.metadata'
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const TOKEN_FILE = path.join('data', 'tokens.json')

export class AuthError extends Error {}

const b64url = (buf) => buf.toString('base64url')

function loadTokens() {
  try {
    return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'))
  } catch {
    return null
  }
}

function saveTokens(tokens) {
  fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true })
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2))
}

async function tokenRequest(params) {
  let res
  try {
    res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params),
    })
  } catch {
    throw new Error('Network error while contacting Google OAuth.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (data.error === 'invalid_grant')
      throw new AuthError(
        'Google refresh token is expired or revoked. In Testing mode it expires after 7 days. Run: npm run gmail:auth',
      )
    throw new AuthError(`Google OAuth error: ${data.error || res.status} ${data.error_description || ''}`.trim())
  }
  return data
}

// One-time browser sign-in (loopback redirect + PKCE). Stores tokens locally.
export async function authorize({ clientId, clientSecret }, onUrl) {
  const verifier = b64url(crypto.randomBytes(32))
  const challenge = b64url(crypto.createHash('sha256').update(verifier).digest())
  const state = b64url(crypto.randomBytes(16))

  const server = http.createServer()
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const redirectUri = `http://127.0.0.1:${server.address().port}`

  const url = new URL(AUTH_URL)
  url.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state,
  }).toString()
  onUrl(url.toString())

  const code = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new AuthError('Timed out waiting for sign-in (5 min).')), 300_000)
    server.on('request', (req, res) => {
      const q = new URL(req.url, redirectUri).searchParams
      if (!q.has('code') && !q.has('error')) {
        res.writeHead(404).end()
        return
      }
      res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('You can close this tab and return to the terminal.')
      clearTimeout(timer)
      if (q.get('error')) return reject(new AuthError(`Google returned an error: ${q.get('error')}`))
      if (q.get('state') !== state) return reject(new AuthError('OAuth state mismatch. Try again.'))
      resolve(q.get('code'))
    })
  }).finally(() => server.close())

  const data = await tokenRequest({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    code_verifier: verifier,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  })
  if (!data.refresh_token) throw new AuthError('Google did not return a refresh token. Revoke the app access in your Google account and retry.')
  saveTokens({
    refresh_token: data.refresh_token,
    access_token: data.access_token,
    expiry: Date.now() + data.expires_in * 1000,
    scope: data.scope,
  })
  return data.scope
}

// Returns a function that yields a valid access token, refreshing when needed.
export function createTokenProvider({ clientId, clientSecret }) {
  return async function getAccessToken(force = false) {
    const t = loadTokens()
    if (!t?.refresh_token) throw new AuthError('Not signed in to Google. Run: npm run gmail:auth')
    if (!force && t.access_token && t.expiry > Date.now() + 60_000) return t.access_token
    const data = await tokenRequest({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: t.refresh_token,
      grant_type: 'refresh_token',
    })
    saveTokens({ ...t, access_token: data.access_token, expiry: Date.now() + data.expires_in * 1000 })
    return data.access_token
  }
}
