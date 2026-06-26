import axios from 'axios'
import { STORAGE_KEYS } from '../constants'

// ── Centralized Axios instance ────────────────────────────────────────────────
// Every API call in the app goes through this single instance. This is where
// the base URL, timeout, and default headers live — change once, applies everywhere.
const normalizeApiUrl = (rawUrl) => {
  if (!rawUrl) return '/api/v1'
  const host = rawUrl.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '')
  return `${host}/api/v1`
}

const api = axios.create({
  baseURL: normalizeApiUrl(import.meta.env.VITE_API_URL),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach access token to every request ───────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response interceptor: auto-refresh expired tokens, normalize errors ─────
let isRefreshing = false
let refreshQueue = []

const processQueue = (token) => {
  refreshQueue.forEach((cb) => cb(token))
  refreshQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Token expired — attempt silent refresh, queue concurrent requests
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !original._retry
    ) {
      if (isRefreshing) {
        // Wait for the in-flight refresh to finish, then retry this request
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(api(original))
          })
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        const { data } = await api.post('/auth/refresh', { refreshToken })
        const { accessToken, refreshToken: newRefresh } = data.data

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefresh)

        processQueue(accessToken)
        original.headers.Authorization = `Bearer ${accessToken}`
        return api(original)
      } catch (refreshError) {
        processQueue(null)
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Normalize error shape so every catch block can rely on `error.message`
    const message = error.response?.data?.message || 'Something went wrong. Please try again.'
    return Promise.reject({ ...error, message })
  }
)

export default api
