import api from './api'

export const uploadService = {
  uploadImages: (files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteImage: (publicId) => {
    const encoded = btoa(publicId)
    return api.delete(`/upload/images/${encoded}`)
  },
}
