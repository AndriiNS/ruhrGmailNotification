// The single seam between UI and authentication.
// Later: add supabaseAuth.js with the same methods and select it when DEMO_MODE is false.
import { DEMO_MODE } from '../../lib/config'
import { mockAuth } from './mockAuth'
import { AuthServiceError } from './errors'

const notConfigured = async () => {
  throw new AuthServiceError('not_configured')
}

export const authService = DEMO_MODE
  ? mockAuth
  : {
      getSession: () => null,
      signIn: notConfigured,
      signUp: notConfigured,
      requestPasswordReset: notConfigured,
      resendVerification: notConfigured,
      signOut: async () => {},
    }
