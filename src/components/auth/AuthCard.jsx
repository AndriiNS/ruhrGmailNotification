import Card from '../ui/Card'
import { AUTH_DEMO } from '../../lib/config'

export default function AuthCard({ title, description, children, footer }) {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <Card>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-2 text-muted">{description}</p>}
        {AUTH_DEMO && (
          <p role="note" className="mt-4 rounded-control bg-warn-soft px-3 py-2 text-xs text-warn">
            <strong>Demo mode.</strong> No real account is created or checked. Any valid email works.
            To preview errors, start the email with wrong@, taken@ or error@.
          </p>
        )}
        <div className="mt-6">{children}</div>
      </Card>
      {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
    </div>
  )
}
