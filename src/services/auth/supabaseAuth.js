// Real authentication through Supabase Auth (email + password, email confirmation).
// Interface matches mockAuth. getSession is async and subscribe() reports later changes.
import { getClient } from '../../lib/supabase'
import { AuthServiceError } from './errors'

// app_metadata can only be changed server-side, so is_admin cannot be set by the user.
const toUser = (session) =>
  session?.user
    ? { id: session.user.id, email: session.user.email, demo: false, isAdmin: session.user.app_metadata?.is_admin === true }
    : null

function mapError(error) {
  const code = error?.code || ''
  if (code === 'invalid_credentials') return new AuthServiceError('invalid_credentials')
  if (code === 'user_already_exists' || code === 'email_exists') return new AuthServiceError('email_taken')
  if (code === 'email_not_confirmed') return new AuthServiceError('email_not_confirmed')
  if (code === 'weak_password') return new AuthServiceError('weak_password')
  if (code.includes('rate_limit') || error?.status === 429) return new AuthServiceError('rate_limited')
  if (error?.name === 'AuthRetryableFetchError') return new AuthServiceError('network')
  return new AuthServiceError('unknown')
}

export const supabaseAuth = {
  async getSession() {
    const { data } = await getClient().auth.getSession()
    return toUser(data.session)
  },
  subscribe(callback) {
    const { data } = getClient().auth.onAuthStateChange((_event, session) => callback(toUser(session)))
    return () => data.subscription.unsubscribe()
  },
  async signIn(email, password) {
    const { data, error } = await getClient().auth.signInWithPassword({ email, password })
    if (error) throw mapError(error)
    return toUser(data.session)
  },
  async signUp(email, password) {
    const { data, error } = await getClient().auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/login` },
    })
    if (error) throw mapError(error)
    return { email, needsVerification: !data.session }
  },
  async requestPasswordReset(email) {
    const { error } = await getClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw mapError(error)
  },
  async updatePassword(password) {
    const { error } = await getClient().auth.updateUser({ password })
    if (error) throw mapError(error)
  },
  async resendVerification(email) {
    const { error } = await getClient().auth.resend({ type: 'signup', email })
    if (error) throw mapError(error)
  },
  async signOut() {
    await getClient().auth.signOut()
  },
}
