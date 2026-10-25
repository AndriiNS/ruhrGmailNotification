import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import FormMessage from '../components/common/FormMessage'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { authErrorMessage } from '../services/auth/errors'
import { DEMO_MODE } from '../lib/config'

const COOLDOWN_SECONDS = 30

export default function VerifyEmailPage() {
  const { resendVerification } = useAuth()
  const email = useLocation().state?.email
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ tone: 'success', text: '' })
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  async function resend() {
    setLoading(true)
    setMessage({ tone: 'success', text: '' })
    try {
      await resendVerification(email)
      setMessage({ tone: 'success', text: DEMO_MODE ? 'Demo mode: no email was sent.' : 'A new verification link was sent.' })
      setCooldown(COOLDOWN_SECONDS)
    } catch (err) {
      setMessage({ tone: 'error', text: authErrorMessage(err.code) })
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return (
      <AuthCard title="Verify your email" description="Start by creating an account, and we will ask you to verify the address." footer={<Link to="/signup" className="font-semibold text-brand">Create an account</Link>}>
        <Button to="/login" variant="secondary" className="w-full">Go to sign in</Button>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Check your inbox"
      description={DEMO_MODE ? `In the live service we will email a verification link to ${email}. In demo mode no email is sent.` : `We sent a verification link to ${email}. Open it to activate your account.`}
      footer={<>Wrong address? <Link to="/signup" className="font-semibold text-brand">Start again</Link></>}
    >
      <div className="space-y-4">
        <FormMessage tone={message.tone}>{message.text}</FormMessage>
        <Button variant="secondary" className="w-full" onClick={resend} loading={loading} disabled={cooldown > 0}>
          {cooldown > 0 ? `Resend available in ${cooldown}s` : 'Resend verification email'}
        </Button>
        <Button to="/login" className="w-full">Continue to sign in</Button>
      </div>
    </AuthCard>
  )
}
