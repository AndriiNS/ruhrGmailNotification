// DEMO ONLY. This is NOT real authentication.
// - Nothing is verified, no account exists, and the password argument is never read or stored.
// - The only thing kept is the email, in sessionStorage, so the demo UI can show a signed-in state.
// - To preview error states, use an email that starts with: wrong@ (invalid credentials),
//   taken@ (email already used), error@ (network error).
import { AuthServiceError } from './errors'

const KEY = 'mailping.demoSession'
const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms))

function simulate(email, ...codes) {
  const prefix = email.trim().toLowerCase()
  if (prefix.startsWith('error@')) throw new AuthServiceError('network')
  if (prefix.startsWith('wrong@') && codes.includes('invalid_credentials')) throw new AuthServiceError('invalid_credentials')
  if (prefix.startsWith('taken@') && codes.includes('email_taken')) throw new AuthServiceError('email_taken')
}

export const mockAuth = {
  getSession() {
    try {
      const s = JSON.parse(sessionStorage.getItem(KEY))
      return s?.email ? { email: s.email, demo: true } : null
    } catch {
      return null
    }
  },
  async signIn(email) {
    await delay()
    simulate(email, 'invalid_credentials')
    sessionStorage.setItem(KEY, JSON.stringify({ email: email.trim() }))
    return { email: email.trim(), demo: true }
  },
  async signUp(email) {
    await delay()
    simulate(email, 'email_taken')
    return { email: email.trim(), needsVerification: true }
  },
  async requestPasswordReset(email) {
    await delay()
    simulate(email)
  },
  async resendVerification(email) {
    await delay()
    simulate(email)
  },
  async signOut() {
    sessionStorage.removeItem(KEY)
  },
}
