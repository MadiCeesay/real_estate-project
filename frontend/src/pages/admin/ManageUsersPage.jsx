import { useState, useEffect } from 'react'
import { FiSearch, FiUser, FiUserCheck, FiUserX } from 'react-icons/fi'
import { adminService } from '../../services/admin.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ManageUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const loadUsers = (query = search) => {
    setLoading(true)
    adminService.getUsers({ limit: 50, search: query || undefined })
      .then(({ data }) => setUsers(data.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    loadUsers(search)
  }

  const updateUser = async (userId, payload) => {
    setUpdatingId(userId)
    try {
      const { data } = await adminService.updateUser(userId, payload)
      setUsers((current) => current.map((u) => (u._id === userId ? data.data.user : u)))
      toast.success('User updated')
    } catch (err) {
      toast.error(err?.message || 'Failed to update user')
    } finally {
      setUpdatingId(null)
    }
  }

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
            {loading ? 'Loading...' : `Total of ${users.length} registered accounts.`}
          </p>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="input-field !pl-11 !py-2.5 w-full md:w-64"
          />
        </form>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><LoadingSpinner /></div>
      ) : (
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
                  <tr key={user._id} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400">
                          <FiUser />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-ink-900 dark:text-white">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-ink-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        disabled={updatingId === user._id}
                        onChange={(e) => updateUser(user._id, { role: e.target.value })}
                        className="input-field !py-1.5 !text-xs !w-28"
                      >
                        <option value="buyer">buyer</option>
                        <option value="agent">agent</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className="text-xs text-ink-600 dark:text-ink-300 capitalize">{user.isActive ? 'active' : 'suspended'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-ink-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        disabled={updatingId === user._id}
                        onClick={() => updateUser(user._id, { isActive: !user.isActive })}
                        className="text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors"
                        title={user.isActive ? 'Suspend user' : 'Activate user'}
                      >
                        {user.isActive ? <FiUserX size={18} /> : <FiUserCheck size={18} />}
                      </button>
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
