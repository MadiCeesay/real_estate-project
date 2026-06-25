import api from './api'

export const propertyService = {
  getAll: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  getNearby: (lat, lng, radius) => api.get('/properties/nearby', { params: { lat, lng, radius } }),
  create: (payload) => api.post('/properties', payload),
  update: (id, payload) => api.put(`/properties/${id}`, payload),
  remove: (id) => api.delete(`/properties/${id}`),
}
