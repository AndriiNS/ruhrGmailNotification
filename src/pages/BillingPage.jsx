import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import FormMessage from '../components/common/FormMessage'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import BillingStatusCard from '../components/billing/BillingStatusCard'
import PlanCard from '../components/billing/PlanCard'
import DemoBillingDialog from '../components/billing/DemoBillingDialog'
import { useBilling } from '../hooks/useBilling'
import { billingErrorMessage } from '../services/billing/errors'
import { billingScenarioLabels } from '../data/billing'
import { useAuth } from '../hooks/useAuth'

export default function BillingPage() {
  const { demoActive } = useAuth()
  const { billing, loadError, reload, refresh, startCheckout, openPortal, demoSetScenario, demoCompleteCheckout } = useBilling()
  const [params, setParams] = useSearchParams()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [demoDialog, setDemoDialog] = useState(null)
  const [scenario, setScenario] = useState('active')

  const checkout = params.get('checkout')
  const status = billing?.subscription.status

  // Returning from Stripe is not proof of payment: keep re-reading the status until the backend says active.
  useEffect(() => {
    if (checkout !== 'success' || !status || status === 'active') return
    let tries = 0
    const timer = setInterval(() => {
      tries += 1
      refresh()
      if (tries >= 10) clearInterval(timer)
    }, 3000)
    return () => clearInterval(timer)
  }, [checkout, status, refresh])

  async function go(kind) {
    setBusy(true)
    setError('')
    try {
      const { url } = await (kind === 'checkout' ? startCheckout() : openPortal())
      if (url) window.location.assign(url)
      else if (demoActive) setDemoDialog(kind)
    } catch (e) {
      setError(billingErrorMessage(e.code))
    } finally {
      setBusy(false)
    }
  }

  function simulate(result) {
    setDemoDialog(null)
    if (result === 'success') {
      demoCompleteCheckout()
      setScenario('active')
    }
    setParams({ checkout: result })
    reload()
  }

  const clearReturn = () => setParams({})

  return (
    <>
      <PageHeader title="Billing" description="See your subscription and manage payment details.">
        {demoActive && (
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Demo data</span>
            <select
              value={scenario}
              onChange={(e) => { setScenario(e.target.value); clearReturn(); demoSetScenario(e.target.value) }}
              className="h-10 rounded-control border border-line bg-paper px-3"
            >
              {Object.entries(billingScenarioLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
        )}
      </PageHeader>

      {checkout && (
        <div aria-live="polite" className="mb-6 flex max-w-2xl items-start justify-between gap-3 rounded-control bg-surface p-4 text-sm">
          <p>
            {checkout === 'cancelled'
              ? 'Checkout was cancelled. You have not been charged.'
              : status === 'active'
                ? 'Payment confirmed. Your subscription is active.'
                : 'We are confirming your payment with Stripe. This page updates automatically. If the status does not change within a few minutes, contact support.'}
          </p>
          <button type="button" onClick={clearReturn} className="font-semibold text-brand">Dismiss</button>
        </div>
      )}

      {!billing && !loadError && <Spinner label="Loading billing" />}
      {loadError && (
        <div className="max-w-md space-y-3">
          <FormMessage>We could not load your billing details. Check your connection and try again.</FormMessage>
          <Button variant="secondary" onClick={reload}>Try again</Button>
        </div>
      )}
      {billing && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <BillingStatusCard subscription={billing.subscription} busy={busy} onSubscribe={() => go('checkout')} onManage={() => go('portal')} />
            <FormMessage>{error}</FormMessage>
          </div>
          <PlanCard />
        </div>
      )}

      {demoDialog && <DemoBillingDialog kind={demoDialog} onClose={() => setDemoDialog(null)} onSimulate={simulate} />}
    </>
  )
}
