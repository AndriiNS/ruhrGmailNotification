import { Link } from 'react-router-dom'
import { APP_NAME } from '../../lib/config'

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-md bg-brand text-sm text-white"
      >
        M
      </span>
      {APP_NAME}
    </Link>
  )
}
