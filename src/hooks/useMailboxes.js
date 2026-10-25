import { useCallback, useEffect, useState } from 'react'
import { mailboxService } from '../services/mailbox'

export function useMailboxes() {
  const [mailboxes, setMailboxes] = useState(null) // null = loading
  const [loadError, setLoadError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    mailboxService
      .list()
      .then((list) => !cancelled && setMailboxes(list))
      .catch(() => !cancelled && setLoadError(true))
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setLoadError(false)
    setMailboxes(null)
    setAttempt((a) => a + 1)
  }, [])

  // Each action throws MailboxServiceError on failure so the calling dialog can show it.
  const connect = useCallback(async (args) => {
    const m = await mailboxService.connect(args)
    setMailboxes((list) => (args.reconnectId ? list.map((x) => (x.id === m.id ? m : x)) : [...list, m]))
    return m
  }, [])
  const setChannels = useCallback(async (id, channels) => {
    const m = await mailboxService.setChannels(id, channels)
    setMailboxes((list) => list.map((x) => (x.id === id ? m : x)))
  }, [])
  const disconnect = useCallback(async (id) => {
    await mailboxService.disconnect(id)
    setMailboxes((list) => list.filter((x) => x.id !== id))
  }, [])

  return { mailboxes, loadError, retry, connect, setChannels, disconnect }
}
