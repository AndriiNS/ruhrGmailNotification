export default function Spinner({ label = 'Loading' }) {
  return (
    <div role="status" className="flex items-center gap-3 text-sm text-muted">
      <span className="size-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      {label}
    </div>
  )
}
