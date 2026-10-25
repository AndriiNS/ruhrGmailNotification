import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Dialog from '../ui/Dialog'
import StatusBadge from '../common/StatusBadge'

export default function ChannelsCard({ channels }) {
  const [whatsappOpen, setWhatsappOpen] = useState(false)
  const tg = channels.telegram.status
  const wa = channels.whatsapp.status
  return (
    <Card aria-labelledby="ch-title">
      <h2 id="ch-title" className="text-lg font-bold">Notification channels</h2>
      <ul className="mt-4 space-y-4">
        <li className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold">Telegram</span>
            <StatusBadge status={tg} />
          </div>
          <Button to="/app/integrations" variant={tg === 'connected' ? 'secondary' : 'primary'}>
            {tg === 'connected' ? 'Manage' : 'Connect Telegram'}
          </Button>
        </li>
        <li className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold">WhatsApp</span>
            <StatusBadge status={wa} />
          </div>
          <Button variant="secondary" onClick={() => setWhatsappOpen(true)}>Connect WhatsApp</Button>
        </li>
      </ul>
      <Dialog open={whatsappOpen} onClose={() => setWhatsappOpen(false)} title="WhatsApp is not available yet">
        WhatsApp notifications are planned. Nothing has been connected. For now, alerts are delivered to Telegram.
      </Dialog>
    </Card>
  )
}
