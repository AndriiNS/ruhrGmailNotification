import Badge from '../ui/Badge'
import Button from '../ui/Button'
import StatusBadge from '../common/StatusBadge'
import { channelName, providerName } from '../../data/mailboxes'

export default function MailboxRow({ mailbox, onChannels, onReconnect, onDisconnect }) {
  const needsFix = mailbox.status !== 'connected'
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-semibold">{mailbox.address}</p>
          <StatusBadge status={mailbox.status} />
          {mailbox.demo && <Badge tone="warning">Demo</Badge>}
        </div>
        <p className="mt-1 text-sm text-muted">
          {providerName(mailbox.provider)} ·{' '}
          {mailbox.channels.length
            ? `alerts to ${mailbox.channels.map(channelName).join(', ')}`
            : 'no channel selected, no alerts will be sent'}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {needsFix && <Button onClick={onReconnect}>Reconnect</Button>}
        <Button variant="secondary" onClick={onChannels}>Channels</Button>
        <Button variant="secondary" className="text-bad" onClick={onDisconnect}>Disconnect</Button>
      </div>
    </li>
  )
}
