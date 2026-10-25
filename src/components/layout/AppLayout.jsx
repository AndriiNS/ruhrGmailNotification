import { NavLink, Outlet } from 'react-router-dom'
import Logo from '../common/Logo'
import DemoBanner from '../common/DemoBanner'
import { cn } from '../../lib/cn'

const links = [
  { to: '/app', label: 'Dashboard', end: true },
  { to: '/app/mailboxes', label: 'Mailboxes' },
  { to: '/app/integrations', label: 'Channels' },
  { to: '/app/billing', label: 'Billing' },
  { to: '/app/settings', label: 'Settings' },
]

function AppLink({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'whitespace-nowrap rounded-control px-3 py-2 text-sm font-semibold',
          isActive ? 'bg-brand-soft text-brand-dark' : 'text-muted hover:text-ink',
        )
      }
    >
      {label}
    </NavLink>
  )
}

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <DemoBanner />
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo to="/app" />
          <nav aria-label="Account" className="hidden gap-1 md:flex">
            {links.map((l) => <AppLink key={l.to} {...l} />)}
          </nav>
        </div>
        <nav
          aria-label="Account mobile"
          className="flex gap-1 overflow-x-auto border-t border-line px-4 py-2 md:hidden"
        >
          {links.map((l) => <AppLink key={l.to} {...l} />)}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
