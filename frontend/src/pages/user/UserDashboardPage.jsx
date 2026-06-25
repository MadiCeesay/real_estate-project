import { FiHeart, FiCalendar, FiHome, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function UserDashboardPage() {
  const { user } = useAuth()

  const stats = [
    { label: 'Saved Properties', value: '0', icon: FiHeart, to: '/favorites' },
    { label: 'My Inquiries', value: '0', icon: FiCalendar, to: '/bookings' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-ink-500 dark:text-ink-400 mt-1">
          Manage your saved properties and viewing requests from one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.to} className="card p-6 flex items-center gap-4 hover:border-emerald-500 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <stat.icon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-ink-400 font-semibold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">{stat.value}</p>
            </div>
            <FiArrowRight className="text-ink-300 group-hover:text-emerald-600 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Empty State Section */}
      <div className="card p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-ink-50 dark:bg-ink-900 flex items-center justify-center mx-auto mb-4 text-ink-300">
          <FiHome size={30} />
        </div>
        <h3 className="text-lg font-bold text-ink-900 dark:text-white mb-2">No recent activity</h3>
        <p className="text-sm text-ink-500 dark:text-ink-400 max-w-sm mx-auto mb-6">
          Start browsing properties to save your favorites or book a viewing with an agent.
        </p>
        <Link to="/properties" className="btn-primary">
          Browse Properties
        </Link>
      </div>
    </div>
  )
}
