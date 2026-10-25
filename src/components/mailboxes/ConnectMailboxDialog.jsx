import { useState } from 'react'
import Dialog from '../ui/Dialog'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import FormMessage from '../common/FormMessage'
import { providers, providerName } from '../../data/mailboxes'
import { mailboxErrorMessage } from '../../services/mailbox/errors'
import { DEMO_MODE } from '../../lib/config'

export default function ConnectMailboxDialog({ reconnect, onConnect, onClose }) {
  const [step, setStep] = useState(reconnect ? 'authorize' : 'provider')
  const [provider, setProvider] = useState(reconnect?.provider ?? 'gmail')
  const [outcome, setOutcome] = useState('success')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function connect() {
    setLoading(true)
    setError('')
    try {
      await onConnect({ provider, outcome, reconnectId: reconnect?.id })
      onClose(true)
    } catch (e) {
      setError(mailboxErrorMessage(e.code))
      setLoading(false)
    }
  }

  const cancel = <Button variant="secondary" onClick={() => onClose(false)}>Cancel</Button>

  return (
    <Dialog
      open
      onClose={() => onClose(false)}
      title={reconnect ? 'Reconnect mailbox' : step === 'provider' ? 'Add a mailbox' : `Connect ${providerName(provider)}`}
      actions={
        step === 'provider' ? (
          <>{cancel}<Button onClick={() => setStep('authorize')}>Next</Button></>
        ) : (
          <>{cancel}<Button onClick={connect} loading={loading}>{DEMO_MODE ? 'Continue in demo mode' : 'Continue with Google'}</Button></>
        )
      }
    >
      {step === 'provider' ? (
        <fieldset className="space-y-2">
          <legend className="mb-2">Choose your email provider.</legend>
          {providers.map((p) => (
            <label key={p.id} className="flex items-start gap-3 rounded-control border border-line p-3 text-ink">
              <input
                type="radio"
                name="provider"
                value={p.id}
                checked={provider === p.id}
                disabled={!p.available}
                onChange={() => setProvider(p.id)}
                className="mt-1 size-4"
              />
              <span>
                <span className="font-semibold">{p.name}</span>{' '}
                {!p.available && <Badge tone="info">Planned</Badge>}
                {p.note && <span className="block text-xs text-muted">{p.note}</span>}
              </span>
            </label>
          ))}
        </fieldset>
      ) : (
        <div className="space-y-3">
          <ol className="list-decimal space-y-1 pl-5">
            <li>You go to Google’s own page and sign in there.</li>
            <li>Google asks you to allow MailPing to view message details: sender, subject and time. It does not include message text.</li>
            <li>You return here and the mailbox appears with its status.</li>
          </ol>
          <p>We never ask for your email password. You can withdraw access at any time in your Google account permissions.</p>
          {DEMO_MODE && (
            <div className="rounded-control bg-warn-soft p-3 text-warn">
              <p><strong>Demo mode.</strong> This does not contact Google and connects no real mailbox. Choose a result to preview:</p>
              <label className="mt-2 block">
                <span className="sr-only">Simulated result</span>
                <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="h-10 w-full rounded-control border border-line bg-paper px-3 text-ink">
                  <option value="success">Access approved</option>
                  <option value="cancelled">Access declined</option>
                  <option value="error">Provider error</option>
                </select>
              </label>
            </div>
          )}
          <FormMessage>{error}</FormMessage>
        </div>
      )}
    </Dialog>
  )
}
