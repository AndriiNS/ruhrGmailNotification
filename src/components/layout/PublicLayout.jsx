import { Link, Outlet } from 'react-router-dom'
import Logo from '../common/Logo'
import Button from '../ui/Button'
import SiteFooter from './SiteFooter'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
            {[['Features', '/#features'], ['Pricing', '/#pricing'], ['FAQ', '/#faq']].map(([label, to]) => (
              <Link key={to} to={to} className="hidden px-3 py-2 text-sm font-semibold text-muted hover:text-ink md:block">
                {label}
              </Link>
            ))}
            <Button to="/login" variant="ghost">Sign in</Button>
            <Button to="/signup">Get started</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
