import { useEffect, useState } from 'react'
import { dashboardService } from '../services/dashboardService'

export function useDashboard(scenario) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, status: 'loading', data: null })
  const key = `${scenario}:${attempt}`

  useEffect(() => {
    let cancelled = false
    dashboardService.getDashboard(scenario)
      .then((data) => !cancelled && setResult({ key, status: 'ready', data }))
      .catch(() => !cancelled && setResult({ key, status: 'error', data: null }))
    return () => {
      cancelled = true
    }
  }, [scenario, key])

  // Until the response for the current request arrives, show the loading state.
  const current = result.key === key
  return {
    status: current ? result.status : 'loading',
    data: current ? result.data : null,
    retry: () => setAttempt((a) => a + 1),
  }
}
