import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FiArrowLeft, FiUpload, FiX } from 'react-icons/fi'
import { propertyService } from '../../services/property.service'
import { uploadService } from '../../services/upload.service'
import { PROPERTY_CATEGORIES, PROPERTY_TYPES, AMENITIES } from '../../constants'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const DEFAULT_COORDS = { lat: 13.4549, lng: -16.5790 }

export default function PropertyFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState([])

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      type: PROPERTY_TYPES.SALE,
      category: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      area: 50,
      street: '',
      city: 'Banjul',
      state: 'Banjul',
      country: 'Gambia',
      zipCode: '',
      lat: DEFAULT_COORDS.lat,
      lng: DEFAULT_COORDS.lng,
      virtualTourUrl: '',
      amenities: [],
    },
  })

  useEffect(() => {
    if (!isEdit) return
    propertyService.getById(id)
      .then(({ data }) => {
        const property = data?.data?.property ?? data?.data
        if (!property) throw new Error('Property not found')
        const [lng, lat] = property.location?.coordinates || [DEFAULT_COORDS.lng, DEFAULT_COORDS.lat]
        reset({
          title: property.title,
          description: property.description,
          price: property.price,
          type: property.type,
          category: property.category,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          street: property.address?.street || '',
          city: property.address?.city || '',
          state: property.address?.state || '',
          country: property.address?.country || 'Gambia',
          zipCode: property.address?.zipCode || '',
          lat,
          lng,
          virtualTourUrl: property.virtualTourUrl || '',
          amenities: property.amenities || [],
        })
        setImages(property.images || [])
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load property')
        navigate('/agent/listings')
      })
      .finally(() => setLoading(false))
  }, [id, isEdit, navigate, reset])

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }
    setUploading(true)
    try {
      const { data } = await uploadService.uploadImages(files)
      const uploaded = data?.data?.images || []
      setImages((current) => [...current, ...uploaded])
      toast.success(`${uploaded.length} image(s) uploaded`)
    } catch (err) {
      toast.error(err?.message || 'Image upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = async (image) => {
    try {
      if (image.publicId) await uploadService.deleteImage(image.publicId)
    } catch { /* continue removing from form */ }
    setImages((current) => current.filter((img) => img.publicId !== image.publicId))
  }

  const onSubmit = async (formData) => {
    if (!images.length) {
      toast.error('Please upload at least one image')
      return
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      type: formData.type,
      category: formData.category,
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      area: Number(formData.area),
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode || undefined,
      },
      coordinates: {
        lat: Number(formData.lat),
        lng: Number(formData.lng),
      },
      amenities: formData.amenities || [],
      images,
      virtualTourUrl: formData.virtualTourUrl || undefined,
    }

    setSubmitting(true)
    try {
      if (isEdit) {
        await propertyService.update(id, payload)
        toast.success('Property updated successfully')
      } else {
        await propertyService.create(payload)
        toast.success('Property submitted for admin approval')
      }
      navigate('/agent/listings')
    } catch (err) {
      toast.error(err?.message || 'Failed to save property')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner /></div>

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link to="/agent/listings" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-emerald-600 mb-4">
          <FiArrowLeft /> Back to listings
        </Link>
        <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">
          {isEdit ? 'Edit Property' : 'Create New Listing'}
        </h1>
        <p className="text-ink-500 dark:text-ink-400 mt-1">
          {isEdit ? 'Update your property details.' : 'New listings require admin approval before going live.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1.5">Title</label>
            <input {...register('title', { required: 'Title is required', minLength: 5 })} className="input-field" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1.5">Description</label>
            <textarea rows={4} {...register('description', { required: 'Description is required', minLength: 20 })} className="input-field resize-none" />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Price (USD)</label>
            <input type="number" {...register('price', { required: 'Price is required', min: 1 })} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Listing Type</label>
            <select {...register('type')} className="input-field">
              <option value={PROPERTY_TYPES.SALE}>For Sale</option>
              <option value={PROPERTY_TYPES.RENT}>For Rent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Category</label>
            <select {...register('category')} className="input-field">
              {PROPERTY_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Area (m²)</label>
            <input type="number" {...register('area', { required: true, min: 1 })} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Bedrooms</label>
            <input type="number" {...register('bedrooms', { min: 0 })} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Bathrooms</label>
            <input type="number" {...register('bathrooms', { min: 0 })} className="input-field" />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-ink-900 dark:text-white mb-3">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <input placeholder="Street" {...register('street', { required: 'Street is required' })} className="input-field" />
            </div>
            <input placeholder="City" {...register('city', { required: true })} className="input-field" />
            <input placeholder="State/Region" {...register('state', { required: true })} className="input-field" />
            <input placeholder="Country" {...register('country', { required: true })} className="input-field" />
            <input placeholder="Zip code (optional)" {...register('zipCode')} className="input-field" />
            <input type="number" step="any" placeholder="Latitude" {...register('lat', { required: true })} className="input-field" />
            <input type="number" step="any" placeholder="Longitude" {...register('lng', { required: true })} className="input-field" />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-ink-900 dark:text-white mb-3">Images</h3>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((image) => (
              <div key={image.publicId} className="relative w-24 h-24 rounded-xl overflow-hidden">
                <img src={image.url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(image)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
          <label className="btn-secondary inline-flex cursor-pointer">
            <FiUpload className="mr-2" />
            {uploading ? 'Uploading...' : 'Upload Images'}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
        </div>

        <div>
          <h3 className="font-bold text-ink-900 dark:text-white mb-3">Amenities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AMENITIES.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 text-sm capitalize">
                <input type="checkbox" value={amenity} {...register('amenities')} className="rounded" />
                {amenity.replace(/([A-Z])/g, ' $1')}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Virtual Tour URL (optional)</label>
          <input type="url" {...register('virtualTourUrl')} className="input-field" placeholder="https://..." />
        </div>

        <button type="submit" disabled={submitting || uploading} className="btn-primary w-full !py-3.5">
          {submitting ? 'Saving...' : isEdit ? 'Update Property' : 'Submit for Approval'}
        </button>
      </form>
    </div>
  )
}
