import api from './api'

export const favoriteService = {
  toggle: (propertyId) => api.post(`/favorites/${propertyId}`),
  getMine: (params) => api.get('/favorites', { params }),
  check: (propertyId) => api.get(`/favorites/${propertyId}`),
}
