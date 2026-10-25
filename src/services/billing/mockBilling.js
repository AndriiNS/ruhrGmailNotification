// DEMO ONLY. No payment is processed and Stripe is never contacted.
import { billingScenarios } from '../../data/billing'
import { BillingServiceError } from './errors'

let scenario = 'active'
let current = structuredClone(billingScenarios.active)
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockBilling = {
  async list() {
    await delay()
    if (scenario === 'error') throw new BillingServiceError('network')
    return { subscription: structuredClone(current) }
  },
  // Real version: backend creates a Stripe Checkout Session and returns its URL.
  async startCheckout() {
    await delay()
    return { url: null }
  },
  // Real version: backend creates a Stripe Customer Portal session and returns its URL.
  async openPortal() {
    await delay()
    return { url: null }
  },
  // Demo-only controls. Real subscription changes arrive from Stripe via backend webhooks.
  demoSetScenario(name) {
    scenario = name
    if (billingScenarios[name]) current = structuredClone(billingScenarios[name])
  },
  demoCompleteCheckout() {
    scenario = 'active'
    current = { ...structuredClone(billingScenarios.active), renewsOn: '2026-11-26' }
  },
}
