import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import FormMessage from '../components/common/FormMessage'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import PasswordInput from '../components/ui/PasswordInput'
import { useAuth } from '../hooks/useAuth'
import { authErrorMessage } from '../services/auth/errors'
import { validateEmail } from '../lib/validation'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const next = {
      email: validateEmail(values.email),
      password: values.password ? '' : 'Enter your password.',
    }
    setErrors(next)
    setFormError('')
    const firstInvalid = Object.keys(next).find((k) => next[k])
    if (firstInvalid) return form.elements[firstInvalid]?.focus()
    setLoading(true)
    try {
      await signIn(values.email.trim(), values.password)
      navigate(location.state?.from || '/app', { replace: true })
    } catch (err) {
      setFormError(authErrorMessage(err.code))
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Sign in"
      description="Welcome back. Sign in to manage your mailboxes and alerts."
      footer={<>New here? <Link to="/signup" className="font-semibold text-brand">Create an account</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormMessage>{formError}</FormMessage>
        <Input label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} />
        <PasswordInput label="Password" name="password" autoComplete="current-password" value={values.password} onChange={set('password')} error={errors.password} />
        <div className="text-right text-sm">
          <Link to="/forgot-password" className="font-semibold text-brand">Forgot password?</Link>
        </div>
        <Button type="submit" loading={loading} className="w-full">{loading ? 'Signing in…' : 'Sign in'}</Button>
      </form>
    </AuthCard>
  )
}
