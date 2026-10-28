export class ChannelServiceError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

const messages = {
  bot_blocked: 'Telegram cannot deliver to this chat. The bot was blocked or stopped. Reconnect Telegram to fix it.',
  rate_limited: 'Telegram asked us to slow down. Wait a minute and try again.',
  network: 'We could not reach the server. Check your connection and try again.',
  not_configured: 'Telegram is not set up yet.',
  telegram_not_configured: 'Telegram is not set up on the server yet.',
  telegram_unavailable: 'Telegram did not respond. Try again in a moment.',
  not_connected: 'Telegram is not connected yet. Connect it first.',
  unauthorized: 'Your session expired. Sign in again.',
}

export const channelErrorMessage = (code) => messages[code] || 'Something went wrong. Try again in a moment.'
