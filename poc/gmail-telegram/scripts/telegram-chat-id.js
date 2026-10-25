import { requireEnv, log } from '../src/util.js'
import { getUpdates } from '../src/telegram.js'

// Prints chat IDs from recent messages sent to your bot (press Start / send "hi" first).
try {
  const { TELEGRAM_BOT_TOKEN } = requireEnv('TELEGRAM_BOT_TOKEN')
  const updates = await getUpdates(TELEGRAM_BOT_TOKEN)
  const chats = new Map()
  for (const u of updates) {
    const c = u.message?.chat
    if (c) chats.set(c.id, c.username || c.first_name || '')
  }
  if (!chats.size) log('No messages found. Open your bot in Telegram, press Start, send "hi", and run this again.')
  for (const [id, name] of chats) log(`chat id: ${id}  ${name}`)
} catch (e) {
  console.error(`Error: ${e.message}`)
  process.exitCode = 1
}
