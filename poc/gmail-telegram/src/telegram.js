import { sleep } from './util.js'

export class TelegramError extends Error {}

// Never let a bot token leak into logs or error messages.
const redact = (s) => String(s ?? '').replace(/\d{6,}:[\w-]{20,}/g, '[token]')

function explain(code, description) {
  const d = redact(description)
  if (code === 401) return 'Telegram rejected the bot token (401). Check TELEGRAM_BOT_TOKEN.'
  if (code === 400 && /chat not found/i.test(d))
    return 'Chat not found (400). Open your bot in Telegram, press Start, and check TELEGRAM_CHAT_ID (npm run telegram:chat-id).'
  if (code === 403)
    return 'The bot cannot message this chat (403). You blocked it, or never pressed Start.'
  if (code === 429) return 'Telegram rate limit (429) persisted after retries.'
  return `Telegram API error ${code}: ${d || 'no details'}`
}

async function call(token, method, body, retries = 3) {
  for (let attempt = 0; ; attempt++) {
    let res
    try {
      res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body ?? {}),
      })
    } catch {
      throw new TelegramError('Network error while contacting Telegram. Check your connection.')
    }
    const data = await res.json().catch(() => null)
    if (res.ok && data?.ok) return data.result
    const code = data?.error_code ?? res.status
    if (code === 429 && attempt < retries) {
      const wait = (data?.parameters?.retry_after ?? 5) + 1
      await sleep(wait * 1000)
      continue
    }
    throw new TelegramError(explain(code, data?.description))
  }
}

export const sendMessage = (token, chatId, text) =>
  call(token, 'sendMessage', { chat_id: chatId, text, disable_web_page_preview: true })

export const getUpdates = (token) => call(token, 'getUpdates', { limit: 20 }, 0)
