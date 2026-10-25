import { useState } from 'react'
import Input from './Input'

export default function PasswordInput(props) {
  const [visible, setVisible] = useState(false)
  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      endSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="rounded-control px-2 py-1 text-xs font-semibold text-muted hover:text-ink"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      }
    />
  )
}
