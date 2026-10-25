import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import NotificationPreview from '../components/landing/NotificationPreview'
import { PLAN } from '../lib/config'

const steps = [
  { title: 'Connect Gmail', text: 'Sign in with Google and approve read-only access to message details. You never share your password with us.' },
  { title: 'Choose where alerts go', text: 'Open our Telegram bot and press Start. Pick the channel for each mailbox.' },
  { title: 'Get notified', text: 'When a new email arrives, you receive its sender, subject and time in Telegram.' },
]

const features = [
  { title: 'Up to 3 mailboxes', text: 'Watch several Gmail accounts under one subscription and see each one’s status in a single dashboard.' },
  { title: 'Channel per mailbox', text: 'Send work mail to one chat and personal mail to another. WhatsApp is planned as an additional channel.' },
  { title: 'Not a mail app', text: 'We only tell you that mail arrived. We do not show, store or let you read message bodies on our site.' },
]

const faqs = [
  { q: 'Which email providers work?', a: 'Gmail is supported first. Outlook and other providers are planned, but availability depends on what each provider allows third-party apps to do.' },
  { q: 'What can MailPing see in my mailbox?', a: 'Only message details: sender, subject and time. We cannot read message text or attachments, and we cannot send, change or delete mail.' },
  { q: 'What happens to the sender and subject?', a: 'They are sent to your Telegram chat. That means they pass through Telegram’s servers, so consider this before connecting a very sensitive mailbox.' },
  { q: 'Do I need to give you my password?', a: 'No. You sign in on Google’s own page and can revoke access at any time in your Google account settings.' },
  { q: 'How do I cancel?', a: 'Cancel from the billing page whenever you like. Your alerts continue until the end of the paid period.' },
  { q: 'How do I set it up?', a: 'Create an account, connect a Gmail mailbox, then open our Telegram bot and press Start. Setup takes a few minutes.' },
]

function useScrollToHash() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])
}

export default function LandingPage() {
  useScrollToHash()
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            New Gmail messages, delivered to Telegram
          </h1>
          <p className="mt-5 max-w-prose text-lg text-muted">
            MailPing watches up to 3 Gmail mailboxes and sends you the sender and subject when new mail
            arrives. No inbox checking, no extra mail app.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/signup" size="lg">Get started</Button>
            <Button to="/#how-it-works" size="lg" variant="secondary">See how it works</Button>
          </div>
          <p className="mt-4 text-sm text-muted">€{PLAN.priceEur.toFixed(2)} per month. Cancel any time.</p>
        </div>
        <NotificationPreview />
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title}>
                <Card as="div" className="h-full">
                  <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand-dark">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-muted">{s.text}</p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Built for staying informed, not for reading mail</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="border-t-2 border-brand pt-4">
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">One simple plan</h2>
          <Card className="mt-8 max-w-md">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold">€{PLAN.priceEur.toFixed(2)}</span>
              <span className="text-muted">per month</span>
            </div>
            <ul className="mt-5 space-y-2 text-sm">
              <li>Up to {PLAN.maxMailboxes} Gmail mailboxes</li>
              <li>Telegram notifications</li>
              <li>Status check for every mailbox and channel</li>
              <li className="flex items-center gap-2">WhatsApp notifications <Badge tone="info">Planned</Badge></li>
              <li className="flex items-center gap-2">Outlook mailboxes <Badge tone="info">Planned</Badge></li>
            </ul>
            <Button to="/signup" className="mt-6 w-full">Get started</Button>
            <p className="mt-3 text-xs text-muted">Billing is handled securely by Stripe. We never see your card details.</p>
          </Card>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Questions</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">{f.q}</summary>
              <p className="mt-2 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
