import { useSelector, useDispatch } from 'react-redux'
import { ROLES } from '../constants'

// Thin convenience wrapper around the auth slice — components import this
// instead of reaching into useSelector/useDispatch directly every time.
export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth)

  return {
    user,
    isAuthenticated,
    loading,
    error,
    dispatch,
    isBuyer: user?.role === ROLES.BUYER,
    isAgent: user?.role === ROLES.AGENT,
    isAdmin: user?.role === ROLES.ADMIN,
  }
}
