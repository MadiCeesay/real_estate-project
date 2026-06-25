import { FiHome, FiCalendar, FiTrendingUp, FiEye, FiArrowUpRight } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

export default function AgentDashboardPage() {
  const { user } = useAuth()

  const stats = [
    { label: 'Active Listings', value: '0', icon: FiHome, trend: '+0%' },
    { label: 'Total Views', value: '0', icon: FiEye, trend: '+0%' },
    { label: 'Pending Requests', value: '0', icon: FiCalendar, trend: '0' },
    { label: 'Conversion Rate', value: '0%', icon: FiTrendingUp, trend: '+0%' },
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
        <button className="btn-primary">
          + Create New Listing
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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

      {/* Recent Activity Mock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-6 border-b border-ink-100 dark:border-ink-800 flex items-center justify-between">
            <h3 className="font-bold text-ink-900 dark:text-white">Recent Viewing Requests</h3>
            <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">View all</button>
          </div>
          <div className="p-10 text-center">
            <p className="text-sm text-ink-500">No pending viewing requests at the moment.</p>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="p-6 border-b border-ink-100 dark:border-ink-800">
            <h3 className="font-bold text-ink-900 dark:text-white">Top Performing</h3>
          </div>
          <div className="p-10 text-center">
            <p className="text-sm text-ink-500">List your first property to see performance metrics.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
