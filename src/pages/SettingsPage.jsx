import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import FormMessage from '../components/common/FormMessage'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import DeleteAccountDialog from '../components/settings/DeleteAccountDialog'
import { useAuth } from '../hooks/useAuth'
import { accountService } from '../services/account'
import { accountErrorMessage } from '../services/account/errors'
import { authErrorMessage } from '../services/auth/errors'
import { DEMO_MODE, SUPPORT_EMAIL } from '../lib/config'

export default function SettingsPage() {
  const { user, signOut, requestPasswordReset } = useAuth()
  const navigate = useNavigate()
  const [prefs, setPrefs] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [saving, setSaving] = useState(false)
  const [prefMsg, setPrefMsg] = useState({ tone: 'success', text: '' })
  const [resetting, setResetting] = useState(false)
  const [resetMsg, setResetMsg] = useState({ tone: 'success', text: '' })
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    accountService
      .getPreferences()
      .then((p) => !cancelled && setPrefs(p))
      .catch(() => !cancelled && setLoadError(true))
    return () => {
      cancelled = true
    }
  }, [])

  async function savePrefs() {
    setSaving(true)
    setPrefMsg({ tone: 'success', text: '' })
    try {
      setPrefs(await accountService.savePreferences(prefs))
      setPrefMsg({ tone: 'success', text: 'Saved.' })
    } catch (e) {
      setPrefMsg({ tone: 'error', text: accountErrorMessage(e.code) })
    } finally {
      setSaving(false)
    }
  }

  async function sendReset() {
    setResetting(true)
    setResetMsg({ tone: 'success', text: '' })
    try {
      await requestPasswordReset(user.email)
      setResetMsg({ tone: 'success', text: DEMO_MODE ? 'Demo mode: no email was sent.' : 'We sent a password reset link to your email.' })
    } catch (e) {
      setResetMsg({ tone: 'error', text: authErrorMessage(e.code) })
    } finally {
      setResetting(false)
    }
  }

  async function deleteAccount() {
    await accountService.deleteAccount()
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <>
      <PageHeader title="Settings" description="Your account, what alerts contain, and your data." />
      {!prefs && !loadError && <Spinner label="Loading settings" />}
      {loadError && <div className="max-w-md"><FormMessage>We could not load your settings. Reload the page to try again.</FormMessage></div>}
      {prefs && (
        <div className="max-w-3xl space-y-6">
          <Card aria-labelledby="acc-title">
            <h2 id="acc-title" className="text-lg font-bold">Account</h2>
            <p className="mt-2 text-sm"><span className="text-muted">Email:</span> <strong>{user?.email}</strong></p>
            <Button variant="secondary" className="mt-4" onClick={sendReset} loading={resetting}>Send password reset link</Button>
            <div aria-live="polite" className="mt-3"><FormMessage tone={resetMsg.tone}>{resetMsg.text}</FormMessage></div>
          </Card>

          <Card aria-labelledby="alert-title">
            <h2 id="alert-title" className="text-lg font-bold">Alert content</h2>
            <label className="mt-3 flex items-start gap-3">
              <input
                type="checkbox"
                checked={prefs.includeSubject}
                onChange={(e) => setPrefs({ ...prefs, includeSubject: e.target.checked })}
                className="mt-1 size-4"
              />
              <span>
                <span className="font-semibold">Include the email subject in alerts</span>
                <span className="block text-sm text-muted">
                  When off, alerts show only the sender and time. Useful if subjects may contain sensitive details,
                  since alerts pass through Telegram’s servers.
                </span>
              </span>
            </label>
            <Button className="mt-4" onClick={savePrefs} loading={saving}>Save</Button>
            <div aria-live="polite" className="mt-3"><FormMessage tone={prefMsg.tone}>{prefMsg.text}</FormMessage></div>
          </Card>

          <Card aria-labelledby="priv-title">
            <h2 id="priv-title" className="text-lg font-bold">Privacy and data</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
              <li>MailPing can see the sender, subject and time of new emails. It cannot read message text or attachments, and it cannot send, change or delete mail.</li>
              <li>
                You can withdraw Google access at any time in your{' '}
                <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" className="font-semibold text-brand">Google account permissions</a>.
              </li>
              <li>To request a copy of your data or ask a privacy question, write to <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-brand">{SUPPORT_EMAIL}</a>.</li>
            </ul>
          </Card>

          <Card aria-labelledby="del-title" className="border-bad/40">
            <h2 id="del-title" className="text-lg font-bold text-bad">Delete account</h2>
            <p className="mt-2 text-sm text-muted">Permanently remove your account and disconnect everything. This cannot be undone.</p>
            <Button variant="danger" className="mt-4" onClick={() => setDeleteOpen(true)}>Delete account</Button>
          </Card>
        </div>
      )}
      {deleteOpen && <DeleteAccountDialog onConfirm={deleteAccount} onClose={() => setDeleteOpen(false)} />}
    </>
  )
}
