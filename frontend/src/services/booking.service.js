import api from './api'

export const bookingService = {
  create: (payload) => api.post('/bookings', payload),
  getMine: (params) => api.get('/bookings/mine', { params }),
  getAgentBookings: (params) => api.get('/bookings/agent', { params }),
  updateStatus: (id, payload) => api.patch(`/bookings/${id}/status`, payload),
  cancel: (id) => api.delete(`/bookings/${id}`),
}
