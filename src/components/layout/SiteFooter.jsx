import { Link } from 'react-router-dom'
import { APP_NAME, SUPPORT_EMAIL } from '../../lib/config'

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted">
        <p>© 2026 {APP_NAME}</p>
        <nav aria-label="Legal" className="flex gap-5">
          <Link to="/privacy" className="hover:text-ink">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-ink">Terms</Link>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-ink">Contact</a>
        </nav>
      </div>
    </footer>
  )
}
