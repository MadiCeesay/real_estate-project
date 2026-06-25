import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiMapPin } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { agentService } from '../../services/agent.service'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AgentListingsPage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    agentService.getMine()
      .then(({ data }) => setListings(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner /></div>

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">
            My Listings
          </h1>
          <p className="text-ink-500 dark:text-ink-400 mt-1">
            Manage and track the performance of your properties.
          </p>
        </div>
        <button className="btn-primary">
          <FiPlus className="mr-2" /> Add Property
        </button>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          icon={FiPlus}
          title="No listings yet"
          description="Start by adding your first property listing to reach thousands of potential buyers."
          action={<button className="btn-primary">Create Listing</button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="card group overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=60'} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-ink-900 dark:text-white hover:bg-white transition-colors">
                    <FiEdit2 size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-red-600 hover:bg-white transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-ink-900 dark:text-white truncate pr-2">{listing.title}</h3>
                  <span className="text-xs font-bold text-emerald-600">${listing.price.toLocaleString()}</span>
                </div>
                <p className="flex items-center gap-1 text-[10px] text-ink-400 uppercase font-semibold tracking-wider mb-4">
                  <FiMapPin size={10} /> {listing.address?.city}, {listing.address?.state}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-ink-100 dark:border-ink-800">
                  <div className="flex items-center gap-4 text-xs text-ink-500">
                    <span className="flex items-center gap-1"><FiEye size={14} /> 0 views</span>
                  </div>
                  <Link to={`/properties/${listing._id}`} className="text-xs font-bold text-ink-900 dark:text-white flex items-center gap-1 hover:text-emerald-600 transition-colors">
                    View <FiEye size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
