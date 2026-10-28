import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import { requireUser } from './auth.js'
import { telegramRoutes } from './telegram/routes.js'

export function createApp(config, supabase = createClient(config.supabaseUrl, config.supabaseSecretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
}), { telegram } = {}) {
  const app = express()
  app.disable('x-powered-by')
  app.use(cors({ origin: config.corsOrigin }))
  app.use(express.json({ limit: '100kb' }))

  app.get('/health', (_req, res) => res.json({ ok: true }))

  // Example protected route. Gmail, Telegram and Stripe routes will be added here, all behind requireUser
  // (Stripe's webhook is the exception and is verified by its signature instead).
  app.get('/api/me', requireUser(supabase), (req, res) => res.json({ user: req.user }))

  // Telegram is optional: without a bot token these routes answer 503 instead of failing at startup.
  app.use('/api/telegram', requireUser(supabase), telegram
    ? telegramRoutes(telegram)
    : (_req, res) => res.status(503).json({ error: 'telegram_not_configured' }))

  app.use((_req, res) => res.status(404).json({ error: 'not_found' }))
  return app
}
