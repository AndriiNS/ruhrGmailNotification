import { Link, Outlet } from 'react-router-dom'
import Logo from '../common/Logo'
import Button from '../ui/Button'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav aria-label="Main" className="flex items-center gap-2">
            <Button to="/login" variant="ghost">Sign in</Button>
            <Button to="/signup">Get started</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted">
          <p>© 2026 MailPing</p>
          <nav aria-label="Legal" className="flex gap-5">
            <Link to="/privacy" className="hover:text-ink">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-ink">Terms</Link>
            <a href="mailto:support@example.com" className="hover:text-ink">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
