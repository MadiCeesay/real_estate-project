import { createSlice } from '@reduxjs/toolkit'
import { STORAGE_KEYS } from '../../constants'

const getInitialTheme = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME)
  if (stored) return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const initialState = { mode: getInitialTheme() }

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEYS.THEME, state.mode)
    },
    setTheme: (state, action) => {
      state.mode = action.payload
      localStorage.setItem(STORAGE_KEYS.THEME, action.payload)
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
