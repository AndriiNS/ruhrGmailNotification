// The single seam between UI and authentication.
// Real Supabase auth is used when VITE_SUPABASE_* keys exist; otherwise the demo mock (VITE_DEMO_MODE).
import { DEMO_MODE, REAL_AUTH } from '../../lib/config'
import { mockAuth } from './mockAuth'
import { supabaseAuth } from './supabaseAuth'
import { AuthServiceError } from './errors'

const notConfigured = async () => {
  throw new AuthServiceError('not_configured')
}

export const authService = REAL_AUTH
  ? supabaseAuth
  : DEMO_MODE
    ? mockAuth
    : {
        getSession: () => null,
        signIn: notConfigured,
        signUp: notConfigured,
        requestPasswordReset: notConfigured,
        updatePassword: notConfigured,
        resendVerification: notConfigured,
        signOut: async () => {},
      }
