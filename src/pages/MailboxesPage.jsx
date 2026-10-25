import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import FormMessage from '../components/common/FormMessage'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Dialog from '../components/ui/Dialog'
import Spinner from '../components/ui/Spinner'
import MailboxRow from '../components/mailboxes/MailboxRow'
import ChannelsDialog from '../components/mailboxes/ChannelsDialog'
import ConnectMailboxDialog from '../components/mailboxes/ConnectMailboxDialog'
import { useMailboxes } from '../hooks/useMailboxes'
import { mailboxErrorMessage } from '../services/mailbox/errors'
import { DEMO_MODE, PLAN } from '../lib/config'

export default function MailboxesPage() {
  const { mailboxes, loadError, retry, connect, setChannels, disconnect } = useMailboxes()
  const [dialog, setDialog] = useState(null) // { type: 'connect'|'channels'|'disconnect', mailbox? }
  const [notice, setNotice] = useState('')
  const [disconnecting, setDisconnecting] = useState(false)
  const [disconnectError, setDisconnectError] = useState('')

  const full = mailboxes && mailboxes.length >= PLAN.maxMailboxes // The backend must enforce this too.
  const close = () => { setDialog(null); setDisconnectError('') }

  async function confirmDisconnect() {
    setDisconnecting(true)
    setDisconnectError('')
    try {
      await disconnect(dialog.mailbox.id)
      setNotice(`${dialog.mailbox.address} was disconnected.`)
      setDialog(null)
    } catch (e) {
      setDisconnectError(mailboxErrorMessage(e.code))
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <>
      <PageHeader title="Mailboxes" description={`Connect up to ${PLAN.maxMailboxes} Gmail mailboxes and choose where alerts for each one go.`}>
        {mailboxes && (full ? (
          <p className="text-sm text-muted">Mailbox limit reached ({PLAN.maxMailboxes} of {PLAN.maxMailboxes}).</p>
        ) : (
          <Button onClick={() => setDialog({ type: 'connect' })}>Add mailbox</Button>
        ))}
      </PageHeader>

      <div aria-live="polite" className="mb-4 max-w-2xl">
        <FormMessage tone="success">{notice}</FormMessage>
      </div>

      {!mailboxes && !loadError && <Spinner label="Loading mailboxes" />}
      {loadError && (
        <div className="max-w-md space-y-3">
          <FormMessage>We could not load your mailboxes. Check your connection and try again.</FormMessage>
          <Button variant="secondary" onClick={retry}>Try again</Button>
        </div>
      )}

      {mailboxes?.length === 0 && (
        <Card className="max-w-2xl text-center">
          <p className="font-semibold">No mailboxes connected</p>
          <p className="mt-1 text-sm text-muted">Connect a Gmail mailbox to start receiving alerts.</p>
          <Button className="mt-4" onClick={() => setDialog({ type: 'connect' })}>Add mailbox</Button>
        </Card>
      )}

      {mailboxes?.length > 0 && (
        <Card className="max-w-3xl py-2">
          <ul className="divide-y divide-line">
            {mailboxes.map((m) => (
              <MailboxRow
                key={m.id}
                mailbox={m}
                onChannels={() => setDialog({ type: 'channels', mailbox: m })}
                onReconnect={() => setDialog({ type: 'connect', mailbox: m })}
                onDisconnect={() => setDialog({ type: 'disconnect', mailbox: m })}
              />
            ))}
          </ul>
        </Card>
      )}

      {dialog?.type === 'connect' && (
        <ConnectMailboxDialog
          reconnect={dialog.mailbox}
          onConnect={connect}
          onClose={(ok) => {
            if (ok) setNotice(DEMO_MODE ? 'Demo mailbox connected. Nothing real was connected.' : 'Mailbox connected.')
            close()
          }}
        />
      )}
      {dialog?.type === 'channels' && <ChannelsDialog mailbox={dialog.mailbox} onSave={setChannels} onClose={close} />}
      {dialog?.type === 'disconnect' && (
        <Dialog
          open
          onClose={close}
          title="Disconnect this mailbox?"
          actions={
            <>
              <Button variant="secondary" onClick={close}>Keep mailbox</Button>
              <Button variant="danger" onClick={confirmDisconnect} loading={disconnecting}>Disconnect</Button>
            </>
          }
        >
          <p className="break-all"><strong>{dialog.mailbox.address}</strong></p>
          <p className="mt-2">Alerts for this mailbox will stop and its access will be removed.{DEMO_MODE && ' Demo mode: nothing real is removed.'}</p>
          <div className="mt-3"><FormMessage>{disconnectError}</FormMessage></div>
        </Dialog>
      )}
    </>
  )
}
