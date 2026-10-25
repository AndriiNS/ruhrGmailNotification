import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Spinner from '../ui/Spinner'

export default function RequireAuth() {
  const { user } = useAuth()
  const location = useLocation()
  if (user === undefined) return <div className="p-8"><Spinner label="Checking your session" /></div>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
