import { createClient } from '@supabase/supabase-js'
import { loadConfig } from './config.js'
import { createApp } from './app.js'
import { createBot } from './telegram/bot.js'
import { createTelegramRepo } from './telegram/repo.js'
import { createTelegramService } from './telegram/service.js'
import { startPoller } from './telegram/poller.js'

try {
  const config = loadConfig()
  const supabase = createClient(config.supabaseUrl, config.supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let telegram
  let stopPoller = () => {}
  if (config.telegramToken) {
    const bot = createBot(config.telegramToken)
    telegram = createTelegramService({ repo: createTelegramRepo(supabase), bot })
    stopPoller = startPoller({ bot, service: telegram })
    console.log('Telegram integration enabled.')
  } else {
    console.log('TELEGRAM_BOT_TOKEN is not set: Telegram routes are disabled.')
  }

  const server = createApp(config, supabase, { telegram }).listen(config.port, () =>
    console.log(`MailPing server listening on http://localhost:${config.port}`),
  )
  process.on('SIGINT', () => {
    stopPoller()
    server.close(() => process.exit(0))
  })
} catch (e) {
  console.error(`Error: ${e.message}`)
  process.exit(1)
}
