import { requireEnv, log } from '../src/util.js'
import { sendMessage } from '../src/telegram.js'

try {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = requireEnv('TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID')
  await sendMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, 'Test message from the Gmail → Telegram PoC.')
  log('Telegram accepted the message. Check your chat to confirm it arrived.')
} catch (e) {
  console.error(`Error: ${e.message}`)
  process.exitCode = 1
}
