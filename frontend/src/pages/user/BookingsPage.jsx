import { useState, useEffect } from 'react'
import { FiCalendar, FiClock, FiMapPin, FiExternalLink, FiX } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { bookingService } from '../../services/booking.service'
import { formatViewingTime } from '../../utils/time'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  const loadBookings = () => {
    setLoading(true)
    bookingService.getMine()
      .then(({ data }) => setBookings(data.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadBookings() }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this viewing request?')) return
    setCancellingId(id)
    try {
      await bookingService.cancel(id)
      setBookings((current) => current.map((b) => (
        b._id === id ? { ...b, status: 'cancelled' } : b
      )))
      toast.success('Booking cancelled')
    } catch (err) {
      toast.error(err?.message || 'Failed to cancel booking')
    } finally {
      setCancellingId(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
      case 'pending':   return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
      default:          return 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-400'
    }
  }

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner /></div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">
          My Viewings
        </h1>
        <p className="text-ink-500 dark:text-ink-400 mt-1">
          Track the status of your property viewing requests.
        </p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={FiCalendar}
          title="No viewings booked"
          description="When you request a viewing for a property, it will appear here for you to track."
          action={<Link to="/properties" className="btn-primary">Browse Properties</Link>}
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={booking.property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=60'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-ink-900 dark:text-white truncate">
                    {booking.property?.title || 'Property Viewing'}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="flex items-center gap-1 text-xs text-ink-500 dark:text-ink-400 mb-3">
                  <FiMapPin size={12} />
                  {booking.property?.address?.city}, {booking.property?.address?.state}
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-medium text-ink-600 dark:text-ink-300">
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="text-emerald-600" />
                    {new Date(booking.viewingDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiClock className="text-emerald-600" />
                    {formatViewingTime(booking.viewingTime)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Link to={`/properties/${booking.property?._id}`} className="btn-secondary !py-2 !px-4 text-xs flex-1 md:flex-none">
                  <FiExternalLink className="mr-1.5" /> View Listing
                </Link>
                {['pending', 'confirmed'].includes(booking.status) && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancellingId === booking._id}
                    className="btn-secondary !py-2 !px-4 text-xs text-red-600 flex-1 md:flex-none"
                  >
                    <FiX className="mr-1.5" />
                    {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
