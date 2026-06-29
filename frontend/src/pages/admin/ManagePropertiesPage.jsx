import { useState, useEffect } from 'react'
import { FiSearch, FiMoreVertical, FiHome, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi'
import { propertyService } from '../../services/property.service'

export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    propertyService.getAll({ limit: 100 })
      .then(({ data }) => setProperties(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
      case 'sold':    return 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-400'
      default:        return 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-400'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">
            Manage Properties
          </h1>
          <p className="text-ink-500 dark:text-ink-400 mt-1">
            {loading ? 'Loading...' : `Total of ${properties.length} listings in the system.`}
          </p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input type="text" placeholder="Search properties..." className="input-field !pl-11 !py-2.5 w-full md:w-64" />
        </div>
      </div>

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
                      <div className="w-12 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={property.images?.[0]?.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink-900 dark:text-white truncate max-w-[200px]">{property.title}</p>
                        <p className="text-xs text-ink-500 truncate">{property.address?.city}, {property.address?.state}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-ink-600 dark:text-ink-300">{property.agent?.firstName} {property.agent?.lastName}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-ink-500 uppercase tracking-wider">
                    {property.type}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(property.status)}`}>
                      {property.status}
                    </span>
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
