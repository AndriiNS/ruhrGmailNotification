// Dashboard data. Demo: fictional scenarios. Real: assembled from the user's own database rows (RLS).
import { dashboardScenarios } from '../data/dashboard'
import { channelName } from '../data/mailboxes'
import { getClient } from '../lib/supabase'
import { PLAN } from '../lib/config'
import { pickService } from '../lib/demo'
import { readChannels } from './channel/realChannel'
import { readSubscription } from './billing/realBilling'

const mock = {
  async getDashboard(scenario = 'active') {
    await new Promise((resolve) => setTimeout(resolve, 400))
    if (scenario === 'error') throw new Error('demo error')
    return structuredClone(dashboardScenarios[scenario] ?? dashboardScenarios.active)
  },
}

const real = {
  async getDashboard() {
    const client = getClient()
    const [subscription, channels, mailboxes, activity] = await Promise.all([
      readSubscription(),
      readChannels(),
      client.from('mailboxes').select('id, provider, address, status, channels').order('created_at', { ascending: true }),
      client
        .from('notification_log')
        .select('id, channel, status, created_at, mailboxes(address)')
        .order('created_at', { ascending: false })
        .limit(10),
    ])
    if (mailboxes.error || activity.error) throw new Error('dashboard load failed')
    return {
      limits: { maxMailboxes: PLAN.maxMailboxes },
      subscription,
      channels,
      mailboxes: mailboxes.data.map((m) => ({ ...m, provider: 'Gmail', channels: m.channels.map(channelName) })),
      activity: activity.data.map((a) => ({
        id: String(a.id),
        mailbox: a.mailboxes?.address ?? 'a mailbox',
        channel: a.channel,
        status: a.status,
        at: a.created_at,
      })),
    }
  },
}

export const dashboardService = pickService(mock, real)
