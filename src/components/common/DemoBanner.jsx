import { DEMO_MODE } from '../../lib/config'

// Shown on every signed-in screen while data is mock data.
export default function DemoBanner() {
  if (!DEMO_MODE) return null
  return (
    <div role="note" className="bg-warn-soft px-4 py-2 text-center text-sm text-warn">
      <strong>Demo mode.</strong> Screens show sample data. No mailbox, channel or payment is
      actually connected.
    </div>
  )
}
