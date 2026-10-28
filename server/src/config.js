// Reads and validates environment variables once at startup. Secrets never leave this process.
const required = ['SUPABASE_URL', 'SUPABASE_SECRET_KEY']

export function loadConfig(env = process.env) {
  const missing = required.filter((k) => !env[k]?.trim())
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}. Copy .env.example to .env and fill them in.`)
  }
  return {
    port: Number(env.PORT || 3001),
    supabaseUrl: env.SUPABASE_URL.trim(),
    supabaseSecretKey: env.SUPABASE_SECRET_KEY.trim(), // service role: bypasses RLS, server only
    telegramToken: env.TELEGRAM_BOT_TOKEN?.trim() || '', // optional; enables the Telegram integration
    corsOrigin: (env.CORS_ORIGIN || 'http://localhost:5173').trim(),
  }
}
