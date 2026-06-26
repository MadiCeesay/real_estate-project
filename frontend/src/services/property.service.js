import api from './api'

const sanitizeParams = (params = {}) => Object.entries(params).reduce((cleaned, [key, value]) => {
  if (value === undefined || value === null) return cleaned

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return cleaned
    cleaned[key] = trimmed
    return cleaned
  }

  if (Array.isArray(value)) {
    const filtered = value
      .map((item) => (typeof item === 'string' ? item.trim() : item))
      .filter((item) => item !== undefined && item !== null && item !== '')

    if (filtered.length) cleaned[key] = filtered
    return cleaned
  }

  cleaned[key] = value
  return cleaned
}, {})

export const propertyService = {
  getAll: (params) => api.get('/properties', { params: sanitizeParams(params) }),
  getById: (id) => api.get(`/properties/${id}`),
  getNearby: (lat, lng, radius) => api.get('/properties/nearby', { params: sanitizeParams({ lat, lng, radius }) }),
  create: (payload) => api.post('/properties', payload),
  update: (id, payload) => api.put(`/properties/${id}`, payload),
  remove: (id) => api.delete(`/properties/${id}`),
}
