import { createHash, randomBytes } from 'node:crypto'
import { TelegramApiError } from './bot.js'

export class TelegramServiceError extends Error {
  constructor(code, status = 400, retryAfter) {
    super(code)
    this.code = code
    this.status = status
    this.retryAfter = retryAfter
  }
}

const LINK_MINUTES = 15
const sha256 = (value) => createHash('sha256').update(value).digest('hex')

export function createTelegramService({ repo, bot, now = Date.now, newToken = () => randomBytes(24).toString('base64url') }) {
  return {
    // Creates a one-time deep link. The user opens it and presses Start; handleUpdate completes the link.
    async startConnect(userId) {
      const token = newToken()
      await repo.saveLink(userId, sha256(token), new Date(now() + LINK_MINUTES * 60_000).toISOString())
      const me = await bot.getMe()
      return { url: `https://t.me/${me.username}?start=${token}`, expiresInMinutes: LINK_MINUTES }
    },

    async cancel(userId) {
      const row = await repo.get(userId)
      if (row?.status === 'pending') await repo.remove(userId)
    },

    async disconnect(userId) {
      await repo.remove(userId)
    },

    async sendTest(userId) {
      const row = await repo.get(userId)
      if (row?.status !== 'connected' || !row.chat_id) throw new TelegramServiceError('not_connected', 409)
      try {
        await bot.sendMessage(row.chat_id, 'Test notification from MailPing. If you can read this, alerts will arrive here.')
      } catch (e) {
        if (!(e instanceof TelegramApiError)) throw e
        if (e.code === 403) {
          await repo.markError(userId)
          throw new TelegramServiceError('bot_blocked', 409)
        }
        if (e.code === 429) throw new TelegramServiceError('rate_limited', 429, e.retryAfter)
        throw e
      }
      return { acceptedAt: new Date(now()).toISOString() }
    },

    // Handles one Telegram update (a message sent to the bot).
    async handleUpdate(update) {
      const msg = update.message
      if (!msg?.text || msg.chat?.type !== 'private') return
      const [command, token] = msg.text.trim().split(/\s+/)
      if (!command.startsWith('/start')) return
      const reply = (text) => bot.sendMessage(msg.chat.id, text).catch(() => {})

      if (!token) return reply('Hi! To connect this chat, open MailPing, go to Channels and press "Connect Telegram".')
      const hash = sha256(token)
      const userId = await repo.findPendingByHash(hash)
      if (!userId) return reply('This link is invalid or has expired. Open MailPing, go to Channels and start again.')

      const chatName = msg.from?.username ? `@${msg.from.username}` : msg.from?.first_name || 'Telegram chat'
      const result = await repo.markConnected(userId, hash, { chatId: msg.chat.id, chatName })
      if (result === 'chat_taken') return reply('This Telegram chat is already connected to another MailPing account. Disconnect it there first.')
      if (result === 'gone') return reply('This link was already used. Open MailPing, go to Channels and start again.')
      return reply('Connected. MailPing will send your email alerts here.')
    },
  }
}
