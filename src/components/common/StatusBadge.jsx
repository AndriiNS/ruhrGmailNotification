import Badge from '../ui/Badge'

const STATUS = {
  active: ['success', 'Active'],
  trial: ['info', 'Trial'],
  canceling: ['warning', 'Cancels at period end'],
  payment_required: ['warning', 'Payment required'],
  expired: ['danger', 'Expired'],
  none: ['neutral', 'Not subscribed'],
  connected: ['success', 'Connected'],
  needs_reconnect: ['warning', 'Reconnect needed'],
  error: ['danger', 'Error'],
  not_connected: ['neutral', 'Not connected'],
  pending: ['warning', 'Waiting for Start'],
  planned: ['info', 'Planned'],
  delivered: ['success', 'Delivered'],
  failed: ['danger', 'Failed'],
}

export default function StatusBadge({ status }) {
  const [tone, label] = STATUS[status] ?? ['neutral', status]
  return <Badge tone={tone}>{label}</Badge>
}
