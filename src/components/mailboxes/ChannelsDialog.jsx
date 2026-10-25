import { useState } from 'react'
import Dialog from '../ui/Dialog'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import FormMessage from '../common/FormMessage'
import { channelCatalog } from '../../data/mailboxes'
import { mailboxErrorMessage } from '../../services/mailbox/errors'

export default function ChannelsDialog({ mailbox, onSave, onClose }) {
  const [selected, setSelected] = useState(mailbox.channels)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  async function save() {
    setLoading(true)
    setError('')
    try {
      await onSave(mailbox.id, selected)
      onClose()
    } catch (e) {
      setError(mailboxErrorMessage(e.code))
      setLoading(false)
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title="Notification channels"
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={save} loading={loading}>Save</Button>
        </>
      }
    >
      <p className="mb-3 break-all">Where should alerts for <strong>{mailbox.address}</strong> go?</p>
      <fieldset className="space-y-2">
        <legend className="sr-only">Channels</legend>
        {channelCatalog.map((c) => (
          <label key={c.id} className="flex items-center gap-3 rounded-control border border-line p-3 text-ink">
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              disabled={!c.available}
              onChange={() => toggle(c.id)}
              className="size-4"
            />
            <span className="font-semibold">{c.name}</span>
            {!c.available && <Badge tone="info">Planned</Badge>}
          </label>
        ))}
      </fieldset>
      {selected.length === 0 && <p className="mt-3 text-warn">With no channel selected, this mailbox sends no alerts.</p>}
      <div className="mt-3"><FormMessage>{error}</FormMessage></div>
    </Dialog>
  )
}
