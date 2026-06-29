import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/slices/themeSlice'

export const useTheme = () => {
  const mode = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()

  // Sync the `dark` class on <html> whenever mode changes — Tailwind's
  // darkMode:'class' strategy reads this class to switch palettes.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  return { mode, toggle: () => dispatch(toggleTheme()) }
}
