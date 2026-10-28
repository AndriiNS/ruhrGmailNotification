// Real account preferences, stored in Postgres under Row Level Security (own row only).
import { getClient } from '../../lib/supabase'
import { AccountServiceError } from './errors'

const fail = () => {
  throw new AccountServiceError('unknown')
}

export const realAccount = {
  async getPreferences() {
    const { data, error } = await getClient().from('user_preferences').select('include_subject').maybeSingle()
    if (error) fail()
    return { includeSubject: data?.include_subject ?? true }
  },
  async savePreferences({ includeSubject }) {
    const client = getClient()
    const { data: session } = await client.auth.getSession()
    const userId = session.session?.user?.id
    if (!userId) fail()
    // Update first, insert if the row does not exist yet (clients may only update include_subject).
    const upd = await client.from('user_preferences').update({ include_subject: includeSubject }).eq('user_id', userId).select('user_id')
    if (upd.error) fail()
    if (!upd.data.length) {
      const ins = await client.from('user_preferences').insert({ user_id: userId, include_subject: includeSubject })
      if (ins.error) fail()
    }
    return { includeSubject }
  },
  // Needs a server endpoint (deletes the auth user, revokes Google access). Not built yet.
  async deleteAccount() {
    throw new AccountServiceError('not_configured')
  },
}
