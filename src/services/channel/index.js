// Interface the UI depends on:
//   list() -> { telegram: { status, chatName?, connectedAt? }, whatsapp: { status: 'planned' } }
//   startTelegramConnect() -> { channels, url, expiresInMinutes }   (real, later: t.me deep link + server)
//   cancelTelegramConnect() / disconnectTelegram() -> channels, sendTestNotification() -> { acceptedAt }
// Demo (mock) or real is chosen per call, see lib/demo.js.
import { pickService } from '../../lib/demo'
import { mockChannel } from './mockChannel'
import { realChannel } from './realChannel'

export const channelService = pickService(mockChannel, realChannel)
