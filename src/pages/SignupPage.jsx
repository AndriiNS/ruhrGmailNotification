import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import FormMessage from '../components/common/FormMessage'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import PasswordInput from '../components/ui/PasswordInput'
import { useAuth } from '../hooks/useAuth'
import { authErrorMessage } from '../services/auth/errors'
import { validateEmail, validateNewPassword, validatePasswordMatch } from '../lib/validation'

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const next = {
      email: validateEmail(values.email),
      password: validateNewPassword(values.password),
      confirm: validatePasswordMatch(values.password, values.confirm),
    }
    setErrors(next)
    setFormError('')
    const firstInvalid = Object.keys(next).find((k) => next[k])
    if (firstInvalid) return form.elements[firstInvalid]?.focus()
    setLoading(true)
    try {
      const { email } = await signUp(values.email.trim(), values.password)
      navigate('/verify-email', { state: { email } })
    } catch (err) {
      setFormError(authErrorMessage(err.code))
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Create your account"
      description="Start forwarding Gmail alerts to Telegram."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-brand">Sign in</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormMessage>{formError}</FormMessage>
        <Input label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} />
        <PasswordInput label="Password" name="password" autoComplete="new-password" hint="At least 8 characters." value={values.password} onChange={set('password')} error={errors.password} />
        <PasswordInput label="Repeat password" name="confirm" autoComplete="new-password" value={values.confirm} onChange={set('confirm')} error={errors.confirm} />
        <Button type="submit" loading={loading} className="w-full">{loading ? 'Creating account…' : 'Create account'}</Button>
        <p className="text-xs text-muted">
          By creating an account you agree to the <Link to="/terms" className="underline">Terms</Link> and{' '}
          <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </form>
    </AuthCard>
  )
}
