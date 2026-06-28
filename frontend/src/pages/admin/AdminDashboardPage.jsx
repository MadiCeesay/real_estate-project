import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiUsers, FiHome, FiDollarSign, FiBarChart2, FiCheckSquare, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi'
import { bookingService } from '../../services/booking.service'
import api from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
    case 'pending':   return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
    case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
    case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
    default:          return 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-400'
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: '—', properties: '—', pendingApprovals: '—', bookings: '—' })
  const [recentBookings, setRecentBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)

  useEffect(() => {
    // Load recent bookings (admin sees all via agent endpoint fallback)
    bookingService.getAgentBookings({ page: 1, limit: 5 })
      .then(({ data }) => {
        const list = data?.data ?? []
        setRecentBookings(list)
      })
      .catch(() => {})
      .finally(() => setLoadingBookings(false))

    // Load platform stats if endpoint exists
    api.get('/admin/stats').then(({ data }) => {
      const s = data?.data ?? {}
      setStats({
        users: s.totalUsers?.toLocaleString() ?? '—',
        properties: s.totalProperties?.toLocaleString() ?? '—',
        pendingApprovals: s.pendingApprovals ?? '—',
        bookings: s.totalBookings?.toLocaleString() ?? '—',
      })
    }).catch(() => {})
  }, [])

  const statCards = [
    { label: 'Total Users',        value: stats.users,           icon: FiUsers,       color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Total Properties',   value: stats.properties,      icon: FiHome,        color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Pending Approvals',  value: stats.pendingApprovals, icon: FiCheckSquare, color: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Total Bookings',     value: stats.bookings,        icon: FiCalendar,    color: 'text-purple-600',  bg: 'bg-purple-50 dark:bg-purple-500/10' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">System Analytics</h1>
        <p className="text-ink-500 dark:text-ink-400 mt-1">Overview of platform growth and activity.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs text-ink-400 font-semibold uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-display font-extrabold text-ink-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-ink-900 dark:text-white">Recent Booking Requests</h3>
            <Link to="/dashboard/admin/bookings" className="text-xs font-semibold text-emerald-600 hover:underline">
              View all
            </Link>
          </div>

          {loadingBookings ? (
            <div className="py-10 flex justify-center"><LoadingSpinner /></div>
          ) : recentBookings.length === 0 ? (
            <div className="py-10 text-center text-sm text-ink-400">
              No bookings yet. They will appear here once users start requesting viewings.
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-b border-ink-100 dark:border-ink-800 last:border-0">
                  {/* Property Image */}
                  <div className="w-full sm:w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-ink-100 dark:bg-ink-800">
                    <img
                      src={booking.property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=200&q=60'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm text-ink-900 dark:text-white truncate">
                        {booking.property?.title || 'Property'}
                      </p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-xs text-ink-500 flex items-center gap-1 mb-1">
                      <FiMapPin size={11} />
                      {booking.property?.address?.city}, {booking.property?.address?.state}
                    </p>
                    <div className="flex gap-3 text-xs text-ink-500">
                      <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(booking.viewingDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><FiClock size={11} /> {booking.viewingTime}</span>
                    </div>
                  </div>

                  {/* Buyer */}
                  <div className="text-xs text-ink-500 dark:text-ink-400 shrink-0">
                    <p className="font-semibold text-ink-700 dark:text-ink-200">
                      {booking.buyer?.firstName} {booking.buyer?.lastName}
                    </p>
                    <p>{booking.buyer?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}