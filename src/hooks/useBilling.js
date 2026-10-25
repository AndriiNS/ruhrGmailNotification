import { useCallback, useEffect, useState } from 'react'
import { billingService } from '../services/billing'

export function useBilling() {
  const [billing, setBilling] = useState(null) // null = loading
  const [loadError, setLoadError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    billingService
      .list()
      .then((b) => !cancelled && setBilling(b))
      .catch(() => !cancelled && setLoadError(true))
    return () => {
      cancelled = true
    }
  }, [attempt])

  const reload = useCallback(() => {
    setLoadError(false)
    setBilling(null)
    setAttempt((a) => a + 1)
  }, [])
  const refresh = useCallback(() => billingService.list().then(setBilling).catch(() => {}), [])

  return {
    billing,
    loadError,
    reload,
    refresh,
    startCheckout: () => billingService.startCheckout(),
    openPortal: () => billingService.openPortal(),
    demoSetScenario: (name) => {
      billingService.demoSetScenario?.(name)
      reload()
    },
    demoCompleteCheckout: () => billingService.demoCompleteCheckout?.(),
  }
}
