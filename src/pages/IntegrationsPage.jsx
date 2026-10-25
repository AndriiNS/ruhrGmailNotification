import PageHeader from '../components/common/PageHeader'
import FormMessage from '../components/common/FormMessage'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import TelegramCard from '../components/integrations/TelegramCard'
import WhatsAppCard from '../components/integrations/WhatsAppCard'
import { useChannels } from '../hooks/useChannels'

export default function IntegrationsPage() {
  const { channels, loadError, retry, ...actions } = useChannels()
  return (
    <>
      <PageHeader title="Channels" description="Choose where email alerts are delivered. Pick the channel for each mailbox on the Mailboxes page." />
      {!channels && !loadError && <Spinner label="Loading channels" />}
      {loadError && (
        <div className="max-w-md space-y-3">
          <FormMessage>We could not load your channels. Check your connection and try again.</FormMessage>
          <Button variant="secondary" onClick={retry}>Try again</Button>
        </div>
      )}
      {channels && (
        <div className="grid gap-6 lg:grid-cols-2">
          <TelegramCard telegram={channels.telegram} actions={actions} />
          <WhatsAppCard />
        </div>
      )}
    </>
  )
}
