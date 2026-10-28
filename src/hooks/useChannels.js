import { useCallback, useEffect, useState } from 'react'
import { channelService } from '../services/channel'

export function useChannels() {
  const [channels, setChannels] = useState(null) // null = loading
  const [loadError, setLoadError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    channelService
      .list()
      .then((c) => !cancelled && setChannels(c))
      .catch(() => !cancelled && setLoadError(true))
    return () => {
      cancelled = true
    }
  }, [attempt])

  const pending = channels?.telegram.status === 'pending'
  const refresh = useCallback(() => channelService.list().then(setChannels).catch(() => {}), [])

  // While waiting for the user to press Start in Telegram, check the status every few seconds.
  useEffect(() => {
    if (!pending) return
    const timer = setInterval(refresh, 3000)
    return () => clearInterval(timer)
  }, [pending, refresh])

  const retry = useCallback(() => {
    setLoadError(false)
    setChannels(null)
    setAttempt((a) => a + 1)
  }, [])

  // Actions that change channel state. They throw ChannelServiceError so the card can show a message.
  const run = useCallback(async (fn) => {
    const result = await fn()
    setChannels(result.channels ?? result)
    return result
  }, [])
  return {
    channels,
    loadError,
    retry,
    startConnect: () => run(() => channelService.startTelegramConnect()),
    cancelConnect: () => run(() => channelService.cancelTelegramConnect()),
    simulateStart: () => run(() => channelService.simulateTelegramStart()),
    disconnect: () => run(() => channelService.disconnectTelegram()),
    sendTest: async (args) => {
      try {
        return await channelService.sendTestNotification(args)
      } catch (e) {
        await refresh() // a failed test can change the channel status (e.g. bot blocked)
        throw e
      }
    },
  }
}
