import { FiUsers, FiHome, FiDollarSign, FiBarChart2, FiCheckSquare } from 'react-icons/fi'

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: '1,240', icon: FiUsers, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Total Properties', value: '8,420', icon: FiHome, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Pending Approvals', value: '12', icon: FiCheckSquare, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Total Revenue', value: '$42,800', icon: FiDollarSign, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">
          System Analytics
        </h1>
        <p className="text-ink-500 dark:text-ink-400 mt-1">
          Overview of platform growth and moderation queue.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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
        <div className="card p-6 h-80 flex flex-col items-center justify-center text-center">
          <FiBarChart2 size={48} className="text-ink-200 mb-4" />
          <h3 className="font-bold text-ink-900 dark:text-white mb-1">Growth Chart</h3>
          <p className="text-sm text-ink-500">Visualization coming soon.</p>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-ink-900 dark:text-white mb-6">Recent User Registrations</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-ink-100 dark:border-ink-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ink-100 dark:bg-ink-800" />
                  <div>
                    <p className="text-sm font-bold text-ink-900 dark:text-white">User {i}</p>
                    <p className="text-xs text-ink-500">user{i}@example.com</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">2h ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
