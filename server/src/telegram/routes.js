import { Router } from 'express'
import { TelegramApiError } from './bot.js'
import { TelegramServiceError } from './service.js'

function toHttp(error) {
  if (error instanceof TelegramServiceError) return { status: error.status, body: { error: error.code, retryAfter: error.retryAfter } }
  if (error instanceof TelegramApiError) return { status: 502, body: { error: error.code === 0 ? 'network' : 'telegram_unavailable' } }
  console.error(`Telegram route error: ${error.message}`)
  return { status: 500, body: { error: 'unknown' } }
}

// Mounted behind requireUser, so req.user.id is a verified Supabase user.
export function telegramRoutes(service) {
  const router = Router()
  const handle = (fn) => async (req, res) => {
    try {
      res.json(await fn(req.user.id))
    } catch (e) {
      const { status, body } = toHttp(e)
      res.status(status).json(body)
    }
  }
  router.post('/connect', handle((id) => service.startConnect(id)))
  router.post('/cancel', handle(async (id) => (await service.cancel(id), { ok: true })))
  router.post('/disconnect', handle(async (id) => (await service.disconnect(id), { ok: true })))
  router.post('/test', handle((id) => service.sendTest(id)))
  return router
}
