import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isLoggedIn } from '../auth'

export default function ProtectedRoute() {
  const location = useLocation()
  if (!isLoggedIn()) {
    return <Navigate to="/" replace state={{ from: location }} />
  }
  return <Outlet />
}

