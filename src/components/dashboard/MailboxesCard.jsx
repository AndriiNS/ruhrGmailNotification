import Card from '../ui/Card'
import Button from '../ui/Button'
import StatusBadge from '../common/StatusBadge'

export default function MailboxesCard({ mailboxes, max }) {
  const used = mailboxes.length
  const full = used >= max // The backend must enforce this limit as well.
  return (
    <Card aria-labelledby="mb-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="mb-title" className="text-lg font-bold">Mailboxes</h2>
        <p className="text-sm font-semibold">{used} of {max} used</p>
      </div>
      <div
        role="progressbar"
        aria-label="Mailboxes used"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={used}
        className="mt-3 h-2 overflow-hidden rounded-full bg-surface"
      >
        <div className="h-full bg-brand" style={{ width: `${(used / max) * 100}%` }} />
      </div>

      {used === 0 ? (
        <div className="mt-5 rounded-control border border-dashed border-line p-6 text-center">
          <p className="font-semibold">No mailboxes connected</p>
          <p className="mt-1 text-sm text-muted">Connect a Gmail mailbox to start receiving alerts.</p>
          <Button to="/app/mailboxes" className="mt-4">Add mailbox</Button>
        </div>
      ) : (
        <>
          <ul className="mt-4 divide-y divide-line">
            {mailboxes.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{m.address}</p>
                  <p className="text-sm text-muted">{m.provider} · alerts to {m.channels.join(', ')}</p>
                </div>
                <StatusBadge status={m.status} />
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button to="/app/mailboxes" variant="secondary">Manage mailboxes</Button>
            {full ? (
              <p className="text-sm text-muted">Mailbox limit reached.</p>
            ) : (
              <Button to="/app/mailboxes">Add mailbox</Button>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
