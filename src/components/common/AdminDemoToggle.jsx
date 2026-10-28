import Button from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { toggleDemoTools } from '../../lib/demo'

// Admin only. Switches screens between real data and demo data (reloads the page).
export default function AdminDemoToggle() {
  const { isAdmin, demoActive } = useAuth()
  if (!isAdmin) return null
  return (
    <Button variant="ghost" aria-pressed={demoActive} onClick={toggleDemoTools} title="Admin: switch between real data and demo data">
      Demo tools: {demoActive ? 'on' : 'off'}
    </Button>
  )
}
