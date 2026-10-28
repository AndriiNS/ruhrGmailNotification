import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Dialog from '../ui/Dialog'
import StatusBadge from '../common/StatusBadge'
import FormMessage from '../common/FormMessage'
import { channelErrorMessage } from '../../services/channel/errors'
import { useAuth } from '../../hooks/useAuth'

const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function TelegramCard({ telegram, actions }) {
  const { demoActive } = useAuth()
  const [busy, setBusy] = useState('')
  const [pendingUrl, setPendingUrl] = useState(null)
  const [message, setMessage] = useState({ tone: 'error', text: '' })
  const [outcome, setOutcome] = useState('accepted')
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function run(name, fn, onOk) {
    setBusy(name)
    setMessage({ tone: 'error', text: '' })
    try {
      const result = await fn()
      onOk?.(result)
    } catch (e) {
      setMessage({ tone: 'error', text: channelErrorMessage(e.code) })
    } finally {
      setBusy('')
    }
  }

  const { status } = telegram
  const connect = () => run('connect', actions.startConnect, (r) => setPendingUrl(r.url))

  return (
    <Card aria-labelledby="tg-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="tg-title" className="text-lg font-bold">Telegram</h2>
        <StatusBadge status={status} />
      </div>

      {status === 'not_connected' && (
        <>
          <p className="mt-3 text-sm text-muted">
            Receive an alert in Telegram for each new email. You will open our bot and press Start; we never
            see your Telegram password or contacts.
          </p>
          <Button className="mt-4" onClick={connect} loading={busy === 'connect'}>Connect Telegram</Button>
        </>
      )}

      {status === 'pending' && (
        <>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
            <li>Open the MailPing bot in Telegram.</li>
            <li>Press <strong>Start</strong>. The bot cannot message you before that.</li>
            <li>Come back here. This page updates once Telegram confirms the chat.</li>
          </ol>
          {pendingUrl && <Button href={pendingUrl} className="mt-4">Open Telegram</Button>}
          {!pendingUrl && !demoActive && (
            <p className="mt-4 text-sm text-muted">
              The link is shown only once. Cancel and start again to get a new link.
            </p>
          )}
          {demoActive && (
            <div className="mt-4 rounded-control bg-warn-soft p-3 text-sm text-warn">
              <p><strong>Demo mode.</strong> There is no real bot link. This button only pretends you pressed Start.</p>
              <Button className="mt-2" variant="secondary" onClick={() => run('start', actions.simulateStart)} loading={busy === 'start'}>
                Simulate pressing Start
              </Button>
            </div>
          )}
          <Button className="mt-4" variant="ghost" onClick={() => run('cancel', actions.cancelConnect)} loading={busy === 'cancel'}>
            Cancel
          </Button>
        </>
      )}

      {(status === 'connected' || status === 'error') && (
        <>
          <p className="mt-3 text-sm text-muted">
            {status === 'connected'
              ? `Alerts are delivered to ${telegram.chatName}${telegram.connectedAt ? `, connected on ${fmt(telegram.connectedAt)}` : ''}.`
              : 'Delivery to this chat is failing.'}
          </p>
          {status === 'error' && (
            <div className="mt-3">
              <FormMessage>{channelErrorMessage('bot_blocked')}</FormMessage>
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {status === 'error' ? (
              <Button onClick={connect} loading={busy === 'connect'}>Reconnect Telegram</Button>
            ) : (
              <Button
                onClick={() =>
                  run('test', () => actions.sendTest({ outcome }), () =>
                    setMessage({
                      tone: 'success',
                      text: demoActive
                        ? 'Demo mode: no message was sent to Telegram.'
                        : 'Telegram accepted the test message. Check your chat to confirm it arrived.',
                    }),
                  )
                }
                loading={busy === 'test'}
              >
                Send test notification
              </Button>
            )}
            <Button variant="secondary" className="text-bad" onClick={() => setConfirmOpen(true)}>Disconnect</Button>
          </div>
          {demoActive && status === 'connected' && (
            <label className="mt-3 block text-sm text-warn">
              <span className="font-semibold">Demo: simulate this test result</span>
              <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="mt-1 block h-10 rounded-control border border-line bg-paper px-3 text-ink">
                <option value="accepted">Telegram accepts the message</option>
                <option value="bot_blocked">Bot was blocked</option>
                <option value="rate_limited">Rate limited</option>
                <option value="network">Network error</option>
              </select>
            </label>
          )}
        </>
      )}

      <div aria-live="polite" className="mt-3">
        <FormMessage tone={message.tone}>{message.text}</FormMessage>
      </div>

      <p className="mt-4 border-t border-line pt-3 text-xs text-muted">
        Each alert contains the sender and subject, which pass through Telegram’s servers.
      </p>

      {confirmOpen && (
        <Dialog
          open
          onClose={() => setConfirmOpen(false)}
          title="Disconnect Telegram?"
          actions={
            <>
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Keep connected</Button>
              <Button
                variant="danger"
                loading={busy === 'disconnect'}
                onClick={async () => {
                  await run('disconnect', actions.disconnect)
                  setConfirmOpen(false)
                }}
              >
                Disconnect
              </Button>
            </>
          }
        >
          Mailboxes that send alerts to Telegram will stop notifying you until you connect it again.
          {demoActive && ' Demo mode: nothing real is disconnected.'}
        </Dialog>
      )}
    </Card>
  )
}
