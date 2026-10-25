import { useEffect, useId, useRef } from 'react'
import Button from './Button'

// Built on the native <dialog> element: focus trap, Esc to close, backdrop.
export default function Dialog({ open, onClose, title, children, actions }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby={titleId}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-panel border border-line bg-paper p-6 shadow-overlay backdrop:bg-ink/40"
    >
      <h2 id={titleId} className="text-lg font-bold">
        {title}
      </h2>
      <div className="mt-2 text-sm text-muted">{children}</div>
      <div className="mt-6 flex justify-end gap-3">
        {actions || <Button variant="secondary" onClick={onClose}>Close</Button>}
      </div>
    </dialog>
  )
}
