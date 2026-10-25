import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import FormMessage from '../components/common/FormMessage'
import Button from '../components/ui/Button'
import PasswordInput from '../components/ui/PasswordInput'
import Spinner from '../components/ui/Spinner'
import { useAuth } from '../hooks/useAuth'
import { authErrorMessage } from '../services/auth/errors'
import { validateNewPassword, validatePasswordMatch } from '../lib/validation'

// Opened from the link in the reset email. The link signs the user in temporarily, then they set a new password.
export default function ResetPasswordPage() {
  const { user, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  if (user === undefined) return <div className="p-8"><Spinner label="Checking your reset link" /></div>
  if (!user) {
    return (
      <AuthCard title="Reset link not valid" description="This link has expired or was already used. Request a new one." footer={<Link to="/login" className="font-semibold text-brand">Back to sign in</Link>}>
        <Button to="/forgot-password" className="w-full">Request a new link</Button>
      </AuthCard>
    )
  }

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const next = {
      password: validateNewPassword(values.password),
      confirm: validatePasswordMatch(values.password, values.confirm),
    }
    setErrors(next)
    setFormError('')
    const firstInvalid = Object.keys(next).find((k) => next[k])
    if (firstInvalid) return form.elements[firstInvalid]?.focus()
    setLoading(true)
    try {
      await updatePassword(values.password)
      navigate('/app', { replace: true })
    } catch (err) {
      setFormError(authErrorMessage(err.code))
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Choose a new password" description={`Signed in as ${user.email}.`}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormMessage>{formError}</FormMessage>
        <PasswordInput label="New password" name="password" autoComplete="new-password" hint="At least 8 characters." value={values.password} onChange={set('password')} error={errors.password} />
        <PasswordInput label="Repeat new password" name="confirm" autoComplete="new-password" value={values.confirm} onChange={set('confirm')} error={errors.confirm} />
        <Button type="submit" loading={loading} className="w-full">{loading ? 'Saving…' : 'Save password'}</Button>
      </form>
    </AuthCard>
  )
}
