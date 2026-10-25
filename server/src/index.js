import { loadConfig } from './config.js'
import { createApp } from './app.js'

try {
  const config = loadConfig()
  createApp(config).listen(config.port, () => console.log(`MailPing server listening on http://localhost:${config.port}`))
} catch (e) {
  console.error(`Error: ${e.message}`)
  process.exit(1)
}
