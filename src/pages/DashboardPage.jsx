import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import FormMessage from '../components/common/FormMessage'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import SubscriptionCard from '../components/dashboard/SubscriptionCard'
import MailboxesCard from '../components/dashboard/MailboxesCard'
import ChannelsCard from '../components/dashboard/ChannelsCard'
import ActivityCard from '../components/dashboard/ActivityCard'
import { useAuth } from '../hooks/useAuth'
import { useDashboard } from '../hooks/useDashboard'
import { DEMO_MODE } from '../lib/config'
import { scenarioLabels } from '../data/dashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  const [scenario, setScenario] = useState('active')
  const { status, data, retry } = useDashboard(scenario)

  return (
    <>
      <PageHeader title="Dashboard" description={`Welcome back, ${user?.email}. Here is the state of your alerts.`}>
        {DEMO_MODE && (
          <label className="text-sm">
            <span className="mb-1 block font-semibold">Demo data</span>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="h-10 rounded-control border border-line bg-paper px-3"
            >
              {Object.entries(scenarioLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
        )}
      </PageHeader>

      {status === 'loading' && <Spinner label="Loading your dashboard" />}

      {status === 'error' && (
        <div className="max-w-md space-y-3">
          <FormMessage>We could not load your dashboard. Check your connection and try again.</FormMessage>
          <Button variant="secondary" onClick={retry}>Try again</Button>
        </div>
      )}

      {status === 'ready' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <SubscriptionCard subscription={data.subscription} />
          <ChannelsCard channels={data.channels} />
          <MailboxesCard mailboxes={data.mailboxes} max={data.limits.maxMailboxes} />
          <ActivityCard activity={data.activity} />
        </div>
      )}
    </>
  )
}
