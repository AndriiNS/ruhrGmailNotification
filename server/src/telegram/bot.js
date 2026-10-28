// Minimal Telegram Bot API client. The token never appears in errors or logs.
export class TelegramApiError extends Error {
  constructor(code, description, retryAfter) {
    super(description || `telegram_${code}`)
    this.code = code // 0 = network failure
    this.retryAfter = retryAfter
  }
}

export function createBot(token, fetchImpl = fetch) {
  const redact = (s) => String(s ?? '').split(token).join('[token]')

  async function call(method, body = {}, signal) {
    let res
    try {
      res = await fetchImpl(`https://api.telegram.org/bot${token}/${method}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal,
      })
    } catch {
      throw new TelegramApiError(0, 'network')
    }
    const data = await res.json().catch(() => null)
    if (res.ok && data?.ok) return data.result
    throw new TelegramApiError(data?.error_code ?? res.status, redact(data?.description), data?.parameters?.retry_after)
  }

  let me
  return {
    getMe() {
      me ??= call('getMe').catch((e) => {
        me = undefined
        throw e
      })
      return me
    },
    sendMessage: (chatId, text) => call('sendMessage', { chat_id: chatId, text, disable_web_page_preview: true }),
    getUpdates: (offset, timeoutSeconds, signal) =>
      call('getUpdates', { offset, timeout: timeoutSeconds, allowed_updates: ['message'] }, signal),
  }
}
