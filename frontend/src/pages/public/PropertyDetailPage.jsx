import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FiMapPin, FiHeart, FiShare2, FiCheck, FiUser, FiCalendar, FiClock, FiMessageSquare, FiX } from 'react-icons/fi'
import { BiBed, BiBath, BiArea } from 'react-icons/bi'
import { propertyService } from '../../services/property.service'
import { bookingService } from '../../services/booking.service'
import { isDemoPropertyId } from '../../data/mockProperties'
import { useAuth } from '../../hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '../../redux/slices/favoritesSlice'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { VIEWING_TIME_SLOTS } from '../../utils/time'

const formatPrice = (price, type) => {
  const safePrice = Number(price)
  if (!Number.isFinite(safePrice)) return 'Price on request'
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(safePrice)
  return type === 'rent' ? `${formatted}/mo` : formatted
}

export default function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const dispatch = useDispatch()
  const favoriteIds = useSelector((state) => state.favorites.ids)

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingSubmitting, setBookingSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const isFavorited = favoriteIds.includes(id)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { viewingDate: '', viewingTime: '', message: '' }
  })

  useEffect(() => {
    if (!id) { setError('Invalid property link.'); setLoading(false); return }
    if (isDemoPropertyId(id)) { setError('This is a sample listing. Browse live properties to view full details and book a viewing.'); setLoading(false); return }

    propertyService.getById(id)
      .then(({ data }) => {
        const resolved = data?.data?.property ?? data?.data
        if (!resolved?.title) { setError('Property details could not be loaded.'); return }
        setProperty(resolved)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleFavorite = () => {
    if (!isAuthenticated) { toast.error('Sign in to save properties'); return }
    dispatch(toggleFavorite(id))
    toast.success(isFavorited ? 'Removed from saved' : 'Saved to favourites')
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    toast.success('Link copied to clipboard')
  }

  const openBooking = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book a viewing')
      navigate('/login', { state: { from: { pathname: `/properties/${id}` } } })
      return
    }
    setBookingSuccess(false)
    reset()
    setShowBookingModal(true)
  }

  const onBookingSubmit = async (data) => {
    setBookingSubmitting(true)
    try {
      await bookingService.create({
        propertyId: id,
        viewingDate: data.viewingDate,
        viewingTime: data.viewingTime,
        message: data.message,
      })
      setBookingSuccess(true)
      toast.success('Viewing request submitted! The agent will confirm shortly.')
    } catch (err) {
      toast.error(err?.message || 'Failed to submit booking. Please try again.')
    } finally {
      setBookingSubmitting(false)
    }
  }

  if (loading) return <div className="pt-32 flex justify-center"><LoadingSpinner size="lg" /></div>

  if (error) return (
    <div className="pt-32 max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-2xl font-bold text-ink-900 dark:text-white mb-2">
        {isDemoPropertyId(id) ? 'Sample listing' : 'Oops!'}
      </h2>
      <p className="text-ink-500 dark:text-ink-400 mb-6 max-w-md mx-auto">{error}</p>
      <Link to="/properties" className="btn-primary">Browse all listings</Link>
    </div>
  )

  if (!property) return null

  // Tomorrow's date as the minimum selectable date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="pt-24 pb-20">
      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[300px] lg:h-[500px]">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-card">
            <img
              src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col gap-4">
            {property.images?.slice(1, 3).map((img, i) => (
              <div key={i} className="flex-1 rounded-2xl overflow-hidden shadow-card">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {(!property.images || property.images.length < 2) && (
              <>
                <div className="flex-1 bg-ink-100 dark:bg-ink-800 rounded-2xl animate-pulse" />
                <div className="flex-1 bg-ink-100 dark:bg-ink-800 rounded-2xl animate-pulse" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                For {property.type}
              </span>
              <span className="px-3 py-1 rounded-lg bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-xs font-bold uppercase tracking-wider">
                {property.category}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink-900 dark:text-white mb-2">
              {property.title}
            </h1>
            <p className="flex items-center gap-1.5 text-ink-500 dark:text-ink-400">
              <FiMapPin className="text-emerald-600" />
              {[property.address?.street, property.address?.city, property.address?.state].filter(Boolean).join(', ')}
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-8 py-6 border-y border-ink-100 dark:border-ink-800">
            {property.bedrooms != null && (
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-ink-50 dark:bg-ink-900 flex items-center justify-center text-emerald-600"><BiBed size={22} /></div>
                <div><p className="text-xs text-ink-400 font-medium uppercase tracking-tight">Bedrooms</p><p className="font-bold text-ink-900 dark:text-white">{property.bedrooms}</p></div>
              </div>
            )}
            {property.bathrooms != null && (
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-ink-50 dark:bg-ink-900 flex items-center justify-center text-emerald-600"><BiBath size={22} /></div>
                <div><p className="text-xs text-ink-400 font-medium uppercase tracking-tight">Bathrooms</p><p className="font-bold text-ink-900 dark:text-white">{property.bathrooms}</p></div>
              </div>
            )}
            {property.area != null && (
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-ink-50 dark:bg-ink-900 flex items-center justify-center text-emerald-600"><BiArea size={22} /></div>
                <div><p className="text-xs text-ink-400 font-medium uppercase tracking-tight">Area</p><p className="font-bold text-ink-900 dark:text-white">{property.area} m²</p></div>
              </div>
            )}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-4">Description</h2>
            <p className="text-ink-600 dark:text-ink-300 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {property.amenities?.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.amenities.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300 capitalize">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <FiCheck size={12} />
                    </div>
                    {item.replace(/([A-Z])/g, ' $1')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {property.location?.coordinates?.length === 2 && (
            <div>
              <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-4">Location</h2>
              <div className="rounded-2xl overflow-hidden h-64 bg-ink-100 dark:bg-ink-800">
                {import.meta.env.VITE_GOOGLE_MAPS_KEY ? (
                  <iframe
                    title="Property location"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&q=${property.location.coordinates[1]},${property.location.coordinates[0]}`}
                  />
                ) : (
                  <a
                    href={`https://www.google.com/maps?q=${property.location.coordinates[1]},${property.location.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-full text-emerald-600 font-semibold"
                  >
                    View on Google Maps
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="card p-6 lg:sticky lg:top-24">
            <div className="mb-6">
              <p className="text-sm text-ink-400 font-medium mb-1">Listing Price</p>
              <h3 className="font-display text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
                {formatPrice(property.price, property.type)}
              </h3>
            </div>

            <div className="space-y-3">
              <button onClick={openBooking} className="btn-primary w-full !py-3.5">
                <FiCalendar className="inline mr-2" /> Book a Viewing
              </button>
              <a
                href={`mailto:${property.agent?.email || ''}?subject=Enquiry about ${encodeURIComponent(property.title)}`}
                className="btn-secondary w-full !py-3.5 text-center block"
              >
                Contact Agent
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={handleFavorite}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${isFavorited ? 'border-red-200 bg-red-50 text-red-500 dark:border-red-500/30 dark:bg-red-500/10' : 'border-ink-100 dark:border-ink-800 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900'}`}
              >
                <FiHeart size={16} className={isFavorited ? 'fill-red-500' : ''} /> {isFavorited ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-ink-100 dark:border-ink-800 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors"
              >
                <FiShare2 size={16} /> Share
              </button>
            </div>

            {/* Agent Info */}
            {property.agent && (
              <div className="mt-8 pt-8 border-t border-ink-100 dark:border-ink-800">
                <p className="text-xs text-ink-400 font-semibold uppercase tracking-wider mb-4">Listed by</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400">
                    {property.agent.avatar ? <img src={property.agent.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : <FiUser size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-ink-900 dark:text-white">{property.agent.firstName} {property.agent.lastName}</h4>
                    <p className="text-xs text-ink-500">Licensed Real Estate Agent</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── Booking Modal ────────────────────────────────────────────── */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-ink-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-400 transition-colors"
            >
              <FiX size={18} />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <FiCheck size={32} className="text-emerald-600" />
                </div>
                <h3 className="font-display text-xl font-extrabold text-ink-900 dark:text-white mb-2">Viewing Requested!</h3>
                <p className="text-ink-500 dark:text-ink-400 text-sm mb-6">
                  Your request has been sent to the agent. You'll receive a confirmation once it's approved.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setShowBookingModal(false)} className="btn-secondary flex-1">Close</button>
                  <Link to="/bookings" className="btn-primary flex-1 text-center">My Bookings</Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="font-display text-xl font-extrabold text-ink-900 dark:text-white">Book a Viewing</h3>
                  <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 line-clamp-1">{property.title}</p>
                </div>

                <form onSubmit={handleSubmit(onBookingSubmit)} className="space-y-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">
                      <FiCalendar className="inline mr-1.5" />Preferred date
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      {...register('viewingDate', { required: 'Please pick a date' })}
                      className={`input-field ${errors.viewingDate ? 'border-red-500' : ''}`}
                    />
                    {errors.viewingDate && <p className="text-xs text-red-500 mt-1">{errors.viewingDate.message}</p>}
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">
                      <FiClock className="inline mr-1.5" />Preferred time
                    </label>
                    <select
                      {...register('viewingTime', { required: 'Please pick a time slot' })}
                      className={`input-field ${errors.viewingTime ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select a time slot</option>
                      {VIEWING_TIME_SLOTS.map((slot) => (
                        <option key={slot.value} value={slot.value}>{slot.label}</option>
                      ))}
                    </select>
                    {errors.viewingTime && <p className="text-xs text-red-500 mt-1">{errors.viewingTime.message}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">
                      <FiMessageSquare className="inline mr-1.5" />Message <span className="font-normal text-ink-400">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Any specific questions or requirements for the agent..."
                      {...register('message')}
                      className="input-field resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="btn-primary w-full !py-3.5"
                  >
                    {bookingSubmitting ? 'Submitting...' : 'Confirm Viewing Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}