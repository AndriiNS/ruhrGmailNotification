// Interface the UI depends on (same in demo and real mode):
//   list() -> { telegram: { status, chatName?, connectedAt? }, whatsapp: { status: 'planned' } }
//   startTelegramConnect() -> { channels, url, expiresInMinutes }   (real: Telegram Bot API deep link
//        t.me/<bot>?start=<one-time token>; the backend webhook marks the channel connected)
//   cancelTelegramConnect() / disconnectTelegram() -> channels
//   sendTestNotification({ outcome? }) -> { acceptedAt }   (real: Bot API sendMessage; "accepted" is not "read")
// WhatsApp (Business Platform) is planned: no methods until templates, opt-in and costs are decided.
import { DEMO_MODE } from '../../lib/config'
import { mockChannel } from './mockChannel'
import { ChannelServiceError } from './errors'

const notConfigured = async () => {
  throw new ChannelServiceError('not_configured')
}

export const channelService = DEMO_MODE
  ? mockChannel
  : {
      list: notConfigured,
      startTelegramConnect: notConfigured,
      cancelTelegramConnect: notConfigured,
      sendTestNotification: notConfigured,
      disconnectTelegram: notConfigured,
    }
