// Interface the UI depends on:
//   getPreferences() -> { includeSubject }, savePreferences(partial) -> preferences, deleteAccount() -> void
// Demo (mock) or real (Postgres via Supabase) is chosen per call, see lib/demo.js.
import { pickService } from '../../lib/demo'
import { mockAccount } from './mockAccount'
import { realAccount } from './realAccount'

export const accountService = pickService(mockAccount, realAccount)
