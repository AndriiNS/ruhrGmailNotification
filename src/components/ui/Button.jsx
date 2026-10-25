import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'border border-line bg-paper text-ink hover:bg-surface',
  danger: 'bg-bad text-white hover:opacity-90',
  ghost: 'text-ink hover:bg-surface',
}
const sizes = { md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base' }

export default function Button({
  to,
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button
      className={classes}
      disabled={props.disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  )
}
