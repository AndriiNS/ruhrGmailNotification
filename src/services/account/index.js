// Interface the UI depends on (same in demo and real mode):
//   getPreferences() -> { includeSubject }
//   savePreferences(partial) -> preferences
//   deleteAccount() -> void   (real: backend disconnects mailboxes and channels, revokes Google access,
//        removes account data; billing handling must be decided with the backend)
import { DEMO_MODE } from '../../lib/config'
import { mockAccount } from './mockAccount'
import { AccountServiceError } from './errors'

const notConfigured = async () => {
  throw new AccountServiceError('not_configured')
}

export const accountService = DEMO_MODE
  ? mockAccount
  : { getPreferences: notConfigured, savePreferences: notConfigured, deleteAccount: notConfigured }
