import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHome, FiCalendar, FiTrendingUp, FiEye, FiArrowUpRight } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { agentService } from '../../services/agent.service'
import { formatViewingTime } from '../../utils/time'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AgentDashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [topProperties, setTopProperties] = useState([])

  useEffect(() => {
    Promise.all([
      agentService.getDashboard(),
      agentService.getAnalytics(),
    ])
      .then(([dashboardRes, analyticsRes]) => {
        const dashboard = dashboardRes.data?.data ?? {}
        setStats(dashboard.stats)
        setRecentBookings(dashboard.recentBookings || [])
        setTopProperties(analyticsRes.data?.data?.topProperties || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner /></div>

  const conversionRate = stats?.totalBookings && stats?.totalViews
    ? `${Math.round((stats.totalBookings / stats.totalViews) * 100)}%`
    : '0%'

  const statCards = [
    { label: 'Active Listings', value: stats?.activeListings ?? 0, icon: FiHome, trend: `${stats?.totalListings ?? 0} total` },
    { label: 'Total Views', value: stats?.totalViews ?? 0, icon: FiEye, trend: `${stats?.totalFavorites ?? 0} saves` },
    { label: 'Pending Requests', value: stats?.pendingBookings ?? 0, icon: FiCalendar, trend: `${stats?.totalBookings ?? 0} total` },
    { label: 'Conversion Rate', value: conversionRate, icon: FiTrendingUp, trend: 'views → bookings' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">
            Agent Dashboard
          </h1>
          <p className="text-ink-500 dark:text-ink-400 mt-1">
            Hello {user?.firstName}, here's what's happening with your listings today.
          </p>
        </div>
        <Link to="/agent/listings/new" className="btn-primary">
          + Create New Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <stat.icon size={20} />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                <FiArrowUpRight /> {stat.trend}
              </span>
            </div>
            <p className="text-xs text-ink-400 font-semibold uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-display font-extrabold text-ink-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-6 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
            <h3 className="font-bold text-ink-900 dark:text-white">Recent Viewing Requests</h3>
            <Link to="/agent/bookings" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">View all</Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-ink-500">No pending viewing requests at the moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-ink-100 dark:divide-ink-800">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="p-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-ink-900 dark:text-white truncate">{booking.property?.title}</p>
                    <p className="text-xs text-ink-500">
                      {booking.buyer?.firstName} {booking.buyer?.lastName} · {new Date(booking.viewingDate).toLocaleDateString()} · {formatViewingTime(booking.viewingTime)}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">{booking.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card overflow-hidden">
          <div className="p-6 border-b border-ink-100 dark:border-ink-800">
            <h3 className="font-bold text-ink-900 dark:text-white">Top Performing</h3>
          </div>
          {topProperties.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-ink-500">List your first property to see performance metrics.</p>
            </div>
          ) : (
            <div className="divide-y divide-ink-100 dark:divide-ink-800">
              {topProperties.map((property) => (
                <div key={property._id} className="p-5">
                  <p className="font-bold text-sm text-ink-900 dark:text-white truncate">{property.title}</p>
                  <p className="text-xs text-ink-500 mt-1">{property.views} views · {property.favoriteCount} saves</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
