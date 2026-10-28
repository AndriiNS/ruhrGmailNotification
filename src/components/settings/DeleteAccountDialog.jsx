import { useState } from 'react'
import Dialog from '../ui/Dialog'
import Button from '../ui/Button'
import Input from '../ui/Input'
import FormMessage from '../common/FormMessage'
import { accountErrorMessage } from '../../services/account/errors'
import { useAuth } from '../../hooks/useAuth'

const WORD = 'DELETE'

export default function DeleteAccountDialog({ onConfirm, onClose }) {
  const { demoActive } = useAuth()
  const [typed, setTyped] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function confirm() {
    setLoading(true)
    setError('')
    try {
      await onConfirm()
    } catch (e) {
      setError(accountErrorMessage(e.code))
      setLoading(false)
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title="Delete your account?"
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>Keep my account</Button>
          <Button variant="danger" onClick={confirm} loading={loading} disabled={typed !== WORD}>Delete account</Button>
        </>
      }
    >
      <p>
        This disconnects all mailboxes and channels and removes your account. It cannot be undone. Cancel your
        subscription in Billing first so you are not charged again.
        {demoActive && ' Demo mode: nothing is actually deleted.'}
      </p>
      <div className="mt-4 text-ink">
        <Input label={`Type ${WORD} to confirm`} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
      </div>
      <div className="mt-3"><FormMessage>{error}</FormMessage></div>
    </Dialog>
  )
}
