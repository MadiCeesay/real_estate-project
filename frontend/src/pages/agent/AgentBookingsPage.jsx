import { useState, useEffect } from 'react'
import { FiCalendar, FiClock, FiMapPin, FiCheck, FiX } from 'react-icons/fi'
import { bookingService } from '../../services/booking.service'
import { formatViewingTime } from '../../utils/time'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function AgentBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [filter, setFilter] = useState('')

  const loadBookings = () => {
    setLoading(true)
    const params = { limit: 50 }
    if (filter) params.status = filter
    bookingService.getAgentBookings(params)
      .then(({ data }) => setBookings(data.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadBookings() }, [filter])

  const updateStatus = async (id, status) => {
    setUpdatingId(id)
    try {
      await bookingService.updateStatus(id, { status })
      setBookings((current) => current.map((b) => (b._id === id ? { ...b, status } : b)))
      toast.success(`Booking ${status}`)
    } catch (err) {
      toast.error(err?.message || 'Failed to update booking')
    } finally {
      setUpdatingId(null)
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">
            Viewing Requests
          </h1>
          <p className="text-ink-500 dark:text-ink-400 mt-1">
            Manage viewing requests from potential buyers.
          </p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field !py-2.5 w-full md:w-48">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><LoadingSpinner /></div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={FiCalendar}
          title="No viewing requests"
          description="When buyers request viewings for your properties, they will appear here."
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card p-5 flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={booking.property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=60'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-ink-900 dark:text-white truncate">{booking.property?.title}</h3>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="flex items-center gap-1 text-xs text-ink-500 mb-2">
                  <FiMapPin size={12} />
                  {booking.property?.address?.city}, {booking.property?.address?.state}
                </p>
                <p className="text-sm font-semibold text-ink-700 dark:text-ink-200 mb-2">
                  {booking.buyer?.firstName} {booking.buyer?.lastName} · {booking.buyer?.email}
                </p>
                <div className="flex gap-4 text-xs text-ink-500">
                  <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(booking.viewingDate).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><FiClock size={12} /> {formatViewingTime(booking.viewingTime)}</span>
                </div>
                {booking.message && (
                  <p className="text-xs text-ink-500 mt-2 italic">"{booking.message}"</p>
                )}
              </div>

              {booking.status === 'pending' && (
                <div className="flex gap-2 lg:flex-col">
                  <button
                    onClick={() => updateStatus(booking._id, 'confirmed')}
                    disabled={updatingId === booking._id}
                    className="btn-primary !py-2 !px-4 text-xs"
                  >
                    <FiCheck className="inline mr-1" /> Confirm
                  </button>
                  <button
                    onClick={() => updateStatus(booking._id, 'cancelled')}
                    disabled={updatingId === booking._id}
                    className="btn-secondary !py-2 !px-4 text-xs text-red-600"
                  >
                    <FiX className="inline mr-1" /> Decline
                  </button>
                </div>
              )}
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => updateStatus(booking._id, 'completed')}
                  disabled={updatingId === booking._id}
                  className="btn-secondary !py-2 !px-4 text-xs self-start"
                >
                  Mark Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
