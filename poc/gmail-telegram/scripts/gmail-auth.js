import { requireEnv, log } from '../src/util.js'
import { authorize, SCOPE } from '../src/oauth.js'

try {
  const env = requireEnv('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET')
  const granted = await authorize(
    { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
    (url) => log(`Open this link in your browser and approve access:\n\n${url}\n`),
  )
  log(`Signed in. Tokens saved to data/tokens.json (local only). Granted: ${granted}`)
  if (!granted?.includes(SCOPE)) log('Warning: the requested scope was not granted.')
} catch (e) {
  console.error(`Error: ${e.message}`)
  process.exitCode = 1
}
