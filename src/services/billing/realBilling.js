// Real subscription status from Postgres (written only by the server from verified Stripe webhooks).
// Checkout and the customer portal need the server and Stripe; not built yet.
import { getClient } from '../../lib/supabase'
import { BillingServiceError } from './errors'

const notBuilt = async () => {
  throw new BillingServiceError('not_configured')
}

export async function readSubscription() {
  const { data, error } = await getClient().from('subscriptions').select('status, current_period_end').maybeSingle()
  if (error) throw new BillingServiceError('network')
  if (!data) return { status: 'none' }
  return { status: data.status, renewsOn: data.current_period_end, endsOn: data.current_period_end, endedOn: data.current_period_end }
}

export const realBilling = {
  async list() {
    return { subscription: await readSubscription() }
  },
  startCheckout: notBuilt,
  openPortal: notBuilt,
}
