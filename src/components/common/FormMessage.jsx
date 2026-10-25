import { cn } from '../../lib/cn'

export default function FormMessage({ tone = 'error', children }) {
  if (!children) return null
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-control px-3 py-2 text-sm',
        tone === 'error' ? 'bg-bad-soft text-bad' : 'bg-ok-soft text-ok',
      )}
    >
      {children}
    </p>
  )
}
