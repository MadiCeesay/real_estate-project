import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { validateSession } from '../../redux/slices/authSlice'
import { fetchFavoriteIds } from '../../redux/slices/favoritesSlice'
import { STORAGE_KEYS } from '../../constants'

// Validates stored session on app load and syncs favorites when authenticated.
export default function SessionBootstrap() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) {
      dispatch(validateSession())
    }
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavoriteIds())
    }
  }, [dispatch, isAuthenticated])

  return null
}
