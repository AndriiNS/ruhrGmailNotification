import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import FormMessage from '../components/common/FormMessage'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { authErrorMessage } from '../services/auth/errors'
import { validateEmail } from '../lib/validation'
import { DEMO_MODE } from '../lib/config'

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const msg = validateEmail(email)
    setError(msg)
    setFormError('')
    if (msg) return form.elements.email?.focus()
    setLoading(true)
    try {
      await requestPasswordReset(email.trim())
      setDone(true)
    } catch (err) {
      setFormError(authErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your account email and we will send you a reset link."
      footer={<Link to="/login" className="font-semibold text-brand">Back to sign in</Link>}
    >
      {done ? (
        <FormMessage tone="success">
          {DEMO_MODE
            ? 'Demo mode: no email was sent.'
            : 'If an account exists for this address, a reset link is on its way. Check your inbox and spam folder.'}
        </FormMessage>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <FormMessage>{formError}</FormMessage>
          <Input label="Email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <Button type="submit" loading={loading} className="w-full">{loading ? 'Sending…' : 'Send reset link'}</Button>
        </form>
      )}
    </AuthCard>
  )
}
