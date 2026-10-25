export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function log(...args) {
  console.log(`[${new Date().toLocaleTimeString()}]`, ...args)
}

export function requireEnv(...names) {
  const missing = names.filter((n) => !process.env[n]?.trim())
  if (missing.length) {
    throw new Error(
      `Missing environment variables: ${missing.join(', ')}. Copy .env.example to .env and fill them in.`,
    )
  }
  return Object.fromEntries(names.map((n) => [n, process.env[n].trim()]))
}

export function pollIntervalMs() {
  const sec = Number(process.env.POLL_INTERVAL_SECONDS || 60)
  if (!Number.isFinite(sec)) return 60_000
  return Math.max(15, sec) * 1000
}
