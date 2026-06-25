import { FiSearch, FiMoreVertical, FiUser, FiShield, FiUserCheck } from 'react-icons/fi'

export default function ManageUsersPage() {
  const users = [
    { id: 1, name: 'Fatimah Keita', email: 'Fatima@example.com', role: 'buyer', status: 'active', joined: '2026-05-12' },
    { id: 2, name: 'Pa Sulay Jobe', email: 'Jobe@example.com', role: 'agent', status: 'active', joined: '2026-04-20' },
    { id: 3, name: 'Fatou Jallow', email: 'fatou@example.com', role: 'agent', status: 'pending', joined: '2026-06-01' },
    { id: 4, name: 'Kebba Jobe', email: 'Kebba@example.com', role: 'buyer', status: 'suspended', joined: '2026-01-15' },
  ]

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400'
      case 'agent': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
      default:      return 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-400'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">
            Manage Users
          </h1>
          <p className="text-ink-500 dark:text-ink-400 mt-1">
            Total of {users.length} registered accounts.
          </p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input type="text" placeholder="Search users..." className="input-field !pl-11 !py-2.5 w-full md:w-64" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ink-50 dark:bg-ink-900/50 border-b border-ink-100 dark:border-ink-800">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400">Joined</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400">
                        <FiUser />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-ink-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : user.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <span className="text-xs text-ink-600 dark:text-ink-300 capitalize">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-ink-500">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors">
                      <FiMoreVertical />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
