import { useState, useEffect } from 'react'
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi'
import { adminService } from '../../services/admin.service'
import { formatViewingTime } from '../../utils/time'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = { limit: 50 }
    if (filter) params.status = filter
    adminService.getBookings(params)
      .then(({ data }) => setBookings(data.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [filter])

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
          <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">All Bookings</h1>
          <p className="text-ink-500 dark:text-ink-400 mt-1">Platform-wide viewing requests.</p>
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
        <EmptyState icon={FiCalendar} title="No bookings" description="No booking requests match your filter." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-ink-50 dark:bg-ink-900/50 border-b border-ink-100 dark:border-ink-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400">Property</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400">Buyer</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400">Agent</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400">Schedule</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-ink-900 dark:text-white">{booking.property?.title}</p>
                      <p className="text-xs text-ink-500 flex items-center gap-1"><FiMapPin size={10} /> {booking.property?.address?.city}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">{booking.buyer?.firstName} {booking.buyer?.lastName}</td>
                    <td className="px-6 py-4 text-sm">{booking.agent?.firstName} {booking.agent?.lastName}</td>
                    <td className="px-6 py-4 text-xs text-ink-500">
                      <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(booking.viewingDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1 mt-1"><FiClock size={11} /> {formatViewingTime(booking.viewingTime)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(booking.status)}`}>{booking.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
