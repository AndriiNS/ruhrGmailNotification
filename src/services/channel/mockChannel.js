// DEMO ONLY. Nothing here talks to Telegram or WhatsApp. No message is ever sent.
import { ChannelServiceError } from './errors'

let telegram = { status: 'connected', chatName: 'Demo chat', connectedAt: '2026-10-20T12:00:00Z' }
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))
const snapshot = () => ({ telegram: { ...telegram }, whatsapp: { status: 'planned' } })

export const mockChannel = {
  async list() {
    await delay(300)
    return snapshot()
  },
  // Real version: backend creates a one-time token and returns a t.me deep link.
  async startTelegramConnect() {
    await delay()
    telegram = { status: 'pending' }
    return { channels: snapshot(), url: null, expiresInMinutes: 15 }
  },
  async cancelTelegramConnect() {
    await delay(200)
    telegram = { status: 'not_connected' }
    return snapshot()
  },
  // Demo-only stand-in for the user pressing Start in the bot (real mode: the backend webhook does this).
  async simulateTelegramStart() {
    await delay()
    telegram = { status: 'connected', chatName: 'Demo chat', connectedAt: new Date().toISOString() }
    return snapshot()
  },
  // outcome: 'accepted' | 'bot_blocked' | 'rate_limited' | 'network'
  async sendTestNotification({ outcome = 'accepted' }) {
    await delay(700)
    if (outcome === 'bot_blocked') {
      telegram = { ...telegram, status: 'error' }
      throw new ChannelServiceError('bot_blocked')
    }
    if (outcome === 'rate_limited' || outcome === 'network') throw new ChannelServiceError(outcome)
    return { acceptedAt: new Date().toISOString() }
  },
  async disconnectTelegram() {
    await delay(400)
    telegram = { status: 'not_connected' }
    return snapshot()
  },
}
