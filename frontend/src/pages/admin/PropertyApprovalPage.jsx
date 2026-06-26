import { useState, useEffect } from 'react'
import { FiCheck, FiX, FiEye, FiMapPin, FiClock } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { propertyService } from '../../services/property.service'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function PropertyApprovalPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)

    propertyService.getAll({ status: 'pending' })
      .then(({ data }) => {
        if (active) setProperties(data.data)
      })
      .catch(() => {
        if (active) setProperties([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  const handleApprove = async (id) => {
    try {
      await propertyService.update(id, { status: 'active' })
      setProperties((current) => current.filter((p) => p._id !== id))
      toast.success('Property approved and published!')
    } catch (err) {
      toast.error(err.message || 'Failed to approve property.')
    }
  }

  const handleReject = async (id) => {
    try {
      await propertyService.remove(id)
      setProperties((current) => current.filter((p) => p._id !== id))
      toast.success('Property rejected and removed.')
    } catch (err) {
      toast.error(err.message || 'Failed to reject property.')
    }
  }

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner /></div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">
          Property Approvals
        </h1>
        <p className="text-ink-500 dark:text-ink-400 mt-1">
          Review and moderate new property listings before they go live.
        </p>
      </div>

      {properties.length === 0 ? (
        <EmptyState
          icon={FiCheck}
          title="All caught up!"
          description="There are no pending property listings that require your approval at the moment."
        />
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property._id} className="card p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-full md:w-40 h-28 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=60'} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-ink-900 dark:text-white truncate">
                    {property.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    Pending
                  </span>
                </div>
                <p className="flex items-center gap-1 text-xs text-ink-500 dark:text-ink-400 mb-3">
                  <FiMapPin size={12} />
                  {property.address?.city}, {property.address?.state}
                </p>
                <div className="flex items-center gap-4 text-xs text-ink-600 dark:text-ink-300">
                  <span className="font-bold text-emerald-600">${property.price.toLocaleString()}</span>
                  <span className="flex items-center gap-1.5"><FiClock size={14} /> Submitted 2h ago</span>
                  <span className="text-ink-400">by {property.agent?.firstName} {property.agent?.lastName}</span>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Link to={`/properties/${property._id}`} className="btn-secondary !p-2.5 flex-1 md:flex-none" title="View Details">
                  <FiEye size={18} />
                </Link>
                <button 
                  onClick={() => handleReject(property._id)}
                  className="btn-secondary !p-2.5 text-red-600 hover:border-red-500 flex-1 md:flex-none" 
                  title="Reject"
                >
                  <FiX size={18} />
                </button>
                <button 
                  onClick={() => handleApprove(property._id)}
                  className="btn-primary !p-2.5 flex-1 md:flex-none" 
                  title="Approve"
                >
                  <FiCheck size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
