import api from './api'

export const agentService = {
  getDashboard: () => api.get('/agent/dashboard'),
  getListings: (params) => api.get('/agent/listings', { params }),
  getAnalytics: () => api.get('/agent/analytics'),
  updateProfile: (payload) => api.patch('/agent/profile', payload),
}
