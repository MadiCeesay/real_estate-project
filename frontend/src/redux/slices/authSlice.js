import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/auth.service'
import { STORAGE_KEYS } from '../../constants'
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authService.login(credentials)
      return data.data
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Login failed. Please try again.'
      return rejectWithValue(message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.register(payload)
      return data.data
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.'
      return rejectWithValue(message)
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try { await authService.logout() } catch { /* logout locally regardless */ }
})

export const validateSession = createAsyncThunk(
  'auth/validateSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authService.getMe()
      return data.data.user
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Session expired')
    }
  }
)

// ── Async thunks — each wraps one auth API call with loading/error handling ──
const storedUser = (() => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) } catch { return null }
})()

const initialState = {
  user: storedUser || null,
  isAuthenticated: Boolean(storedUser),
  loading: false,
  error: null,
}

const persistSession = ({ accessToken, refreshToken, user }) => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user))
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        persistSession(action.payload)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        persistSession(action.payload)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        clearSession()
      })
      // Validate session
      .addCase(validateSession.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload))
      })
      .addCase(validateSession.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
        clearSession()
      })
  },
})

export const { clearError, updateUserProfile } = authSlice.actions
export default authSlice.reducer
