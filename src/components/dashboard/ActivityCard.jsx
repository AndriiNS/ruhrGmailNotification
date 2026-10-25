import Card from '../ui/Card'
import StatusBadge from '../common/StatusBadge'

const fmt = (iso) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export default function ActivityCard({ activity }) {
  return (
    <Card aria-labelledby="act-title">
      <h2 id="act-title" className="text-lg font-bold">Recent notifications</h2>
      {activity.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Nothing yet. Notifications appear here once a mailbox and a channel are connected.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {activity.map((a) => (
            <li key={a.id} className="flex flex-wrap items-start justify-between gap-2 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{a.subject}</p>
                <p className="truncate text-sm text-muted">From {a.from} · {a.mailbox}</p>
                <p className="text-xs text-muted">{fmt(a.at)} · {a.channel === 'telegram' ? 'Telegram' : a.channel}</p>
              </div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
