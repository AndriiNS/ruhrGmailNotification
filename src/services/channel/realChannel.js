// Real channel status from Postgres (RLS) and Telegram actions through the MailPing server.
import { getClient } from '../../lib/supabase'
import { apiPost } from '../../lib/api'
import { ChannelServiceError } from './errors'

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

// Server errors carry a code; the UI maps it to a message.
async function post(path) {
  try {
    return await apiPost(path)
  } catch (e) {
    throw new ChannelServiceError(e.code || 'unknown')
  }
}

export const realChannel = {
  list: readChannels,
  async startTelegramConnect() {
    const { url, expiresInMinutes } = await post('/api/telegram/connect')
    return { channels: await readChannels(), url, expiresInMinutes }
  },
  async cancelTelegramConnect() {
    await post('/api/telegram/cancel')
    return readChannels()
  },
  async disconnectTelegram() {
    await post('/api/telegram/disconnect')
    return readChannels()
  },
  sendTestNotification: () => post('/api/telegram/test'),
}
