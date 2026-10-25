// Interface the UI depends on (same in demo and real mode):
//   getPreferences() -> { includeSubject }
//   savePreferences(partial) -> preferences
//   deleteAccount() -> void   (real: backend disconnects mailboxes and channels, revokes Google access,
//        removes account data; billing handling must be decided with the backend)
import { DEMO_MODE, REAL_AUTH } from '../../lib/config'
import { mockAccount } from './mockAccount'
import { AccountServiceError } from './errors'

const notConfigured = async () => {
  throw new AccountServiceError('not_configured')
}

// With real auth, a mock must never pretend to delete a real account: deleteAccount stays unavailable
// until the server implements it.
export const accountService = DEMO_MODE
  ? { ...mockAccount, ...(REAL_AUTH ? { deleteAccount: notConfigured } : {}) }
  : { getPreferences: notConfigured, savePreferences: notConfigured, deleteAccount: notConfigured }
