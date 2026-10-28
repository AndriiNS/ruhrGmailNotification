import { useAuth } from '../../hooks/useAuth'

// Shown on every signed-in screen while the screens use mock data (demo tools on).
export default function DemoBanner() {
  const { demoActive, isAdmin } = useAuth()
  if (!demoActive) return null
  return (
    <div role="note" className="bg-warn-soft px-4 py-2 text-center text-sm text-warn">
      <strong>Demo mode{isAdmin ? ' (admin)' : ''}.</strong> Screens show sample data. No mailbox, channel or
      payment is actually connected.
    </div>
  )
}
