import { useState, useEffect } from 'react'
import { FiSearch, FiExternalLink, FiTrash2, FiCheckCircle } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { propertyService } from '../../services/property.service'
import { adminService } from '../../services/admin.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchProperties = () => {
    setLoading(true)
    const params = { limit: 50, status: statusFilter }
    if (search.trim()) params.search = search.trim()
    propertyService.getAll(params)
      .then(({ data }) => setProperties(data.data?.properties || data.data || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProperties() }, [search, statusFilter])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await adminService.deleteProperty(id)
      toast.success('Property deleted')
      setProperties(prev => prev.filter(p => p._id !== id))
    } catch {
      toast.error('Failed to delete property')
    }
  }

  const handleStatus = async (id, status) => {
    try {
      await adminService.updatePropertyStatus(id, status)
      toast.success(`Property marked as ${status}`)
      setProperties(prev => prev.map(p => p._id === id ? { ...p, status } : p))
    } catch {
      toast.error('Failed to update status')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
      case 'sold':    return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
      default:        return 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-400'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">Manage Properties</h1>
          <p className="text-ink-500 dark:text-ink-400 mt-1">
            {loading ? 'Loading...' : `${properties.length} listings in the system`}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/properties/new"
            className="btn-primary flex items-center gap-2 !py-2.5 !px-4"
          >
            + Add Property
          </Link>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field !py-2.5">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties..."
              className="input-field !pl-11 !py-2.5 w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><LoadingSpinner /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ink-50 dark:bg-ink-900/50 border-b border-ink-100 dark:border-ink-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400">Property</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400">Agent</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400">Type</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {properties.map((property) => (
                  <tr key={property._id} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-ink-100">
                          <img src={property.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-ink-900 dark:text-white truncate max-w-[200px]">{property.title}</p>
                          <p className="text-xs text-ink-500">{property.address?.city}, {property.address?.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-600 dark:text-ink-300">
                      {property.agent?.firstName} {property.agent?.lastName}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-ink-500 uppercase tracking-wider">
                      {property.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(property.status)}`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {property.status === 'pending' && (
                          <button
                            onClick={() => handleStatus(property._id, 'active')}
                            title="Approve"
                            className="text-emerald-500 hover:text-emerald-700 transition-colors"
                          >
                            <FiCheckCircle size={18} />
                          </button>
                        )}
                        {property.status === 'active' && (
                          <button
                            onClick={() => handleStatus(property._id, 'pending')}
                            title="Set to Pending"
                            className="text-amber-500 hover:text-amber-700 transition-colors text-xs font-semibold"
                          >
                            Suspend
                          </button>
                        )}
                        <Link to={`/properties/${property._id}`} className="text-ink-400 hover:text-emerald-600 transition-colors">
                          <FiExternalLink size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(property._id, property.title)}
                          className="text-ink-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
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