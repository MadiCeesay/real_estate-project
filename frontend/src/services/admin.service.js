import api from './api'

export const adminService = {
  getStats:               ()           => api.get('/admin/stats'),
  getUsers:               (params)     => api.get('/admin/users', { params }),
  updateUser:             (id, data)   => api.patch(`/admin/users/${id}`, data),
  getBookings:            (params)     => api.get('/admin/bookings', { params }),
  updateBookingStatus:    (id, status) => api.patch(`/admin/bookings/${id}/status`, { status }),
  deleteProperty:         (id)         => api.delete(`/admin/properties/${id}`),
  updatePropertyStatus:   (id, status) => api.patch(`/admin/properties/${id}/status`, { status }),
}