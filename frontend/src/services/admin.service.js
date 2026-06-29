import api from './api'

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, payload) => api.patch(`/admin/users/${id}`, payload),
  getBookings: (params) => api.get('/admin/bookings', { params }),
}
