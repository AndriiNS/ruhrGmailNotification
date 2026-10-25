import { requireEnv, log, sleep, pollIntervalMs } from '../src/util.js'
import { createTokenProvider } from '../src/oauth.js'
import { createGmail } from '../src/gmail.js'
import { sendMessage } from '../src/telegram.js'
import { createStore } from '../src/state.js'
import { pollOnce } from '../src/monitor.js'

let env
try {
  env = requireEnv('TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET')
} catch (e) {
  console.error(`Error: ${e.message}`)
  process.exit(1)
}
const gmail = createGmail(createTokenProvider({ clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET }))
const send = (text) => sendMessage(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID, text)
const store = createStore()
const interval = pollIntervalMs()

let running = true
process.on('SIGINT', () => { running = false; log('Stopping after the current cycle...') })

log(`Monitoring Gmail every ${interval / 1000}s. Press Ctrl+C to stop.`)
let failures = 0
// Sequential loop: the next cycle starts only after the previous one has finished.
while (running) {
  try {
    await pollOnce({ gmail, send, store, log })
    failures = 0
  } catch (e) {
    if (e.name === 'AuthError') { console.error(`Error: ${e.message}`); process.exit(1) }
    failures++
    console.error(`Cycle failed (${failures}): ${e.message}`)
  }
  await sleep(Math.min(interval * 2 ** Math.min(failures, 4), 600_000))
}
