const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Long-polls Telegram for messages sent to the bot (no public URL needed for local development).
// Returns a stop function. Only one consumer may poll a bot: a second one causes "409 Conflict".
export function startPoller({ bot, service, log = console }) {
  let stopped = false
  let controller
  let offset = 0

  ;(async () => {
    let failures = 0
    while (!stopped) {
      try {
        controller = new AbortController()
        const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(40_000)])
        const updates = await bot.getUpdates(offset, 25, signal)
        failures = 0
        for (const update of updates) {
          offset = update.update_id + 1
          try {
            await service.handleUpdate(update)
          } catch (e) {
            log.error(`Telegram update failed: ${e.message}`)
          }
        }
      } catch (e) {
        if (stopped) break
        failures += 1
        const hint = e.code === 409 ? ' (another process is polling this bot, or a webhook is set)' : ''
        log.error(`Telegram polling error ${failures}: ${e.message}${hint}`)
        await sleep(Math.min(2 ** failures * 1000, 60_000))
      }
    }
  })()

  return () => {
    stopped = true
    controller?.abort()
  }
}
