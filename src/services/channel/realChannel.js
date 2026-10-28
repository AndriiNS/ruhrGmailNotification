// Real channel status from Postgres. Connecting Telegram needs the server (bot link, webhook/polling).
import { getClient } from '../../lib/supabase'
import { ChannelServiceError } from './errors'

const notBuilt = async () => {
  throw new ChannelServiceError('not_configured')
}

export async function readChannels() {
  const { data, error } = await getClient()
    .from('telegram_connections')
    .select('status, chat_name, connected_at')
    .maybeSingle()
  if (error) throw new ChannelServiceError('network')
  return {
    telegram: data
      ? { status: data.status, chatName: data.chat_name ?? 'your chat', connectedAt: data.connected_at }
      : { status: 'not_connected' },
    whatsapp: { status: 'planned' },
  }
}

export const realChannel = {
  list: readChannels,
  startTelegramConnect: notBuilt,
  cancelTelegramConnect: notBuilt,
  sendTestNotification: notBuilt,
  disconnectTelegram: notBuilt,
}
