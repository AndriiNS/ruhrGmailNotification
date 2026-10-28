// Real mailbox list from Postgres (RLS: own rows). Connecting, editing and removing mailboxes
// needs the server (Gmail OAuth, encrypted tokens) and is not built yet.
import { getClient } from '../../lib/supabase'
import { MailboxServiceError } from './errors'

const notBuilt = async () => {
  throw new MailboxServiceError('not_configured')
}

export const realMailbox = {
  async list() {
    const { data, error } = await getClient()
      .from('mailboxes')
      .select('id, provider, address, status, channels')
      .order('created_at', { ascending: true })
    if (error) throw new MailboxServiceError('network')
    return data
  },
  connect: notBuilt,
  setChannels: notBuilt,
  disconnect: notBuilt,
}
