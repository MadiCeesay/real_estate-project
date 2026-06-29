import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Wraps any route group that requires a logged-in user, regardless of role.
// If `roles` is passed, also enforces that the user's role is in the list —
// this is how we reuse one component for both ProtectedRoute and AdminRoute.
export default function ProtectedRoute({ roles }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Remember where the user was headed so login can redirect back
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
