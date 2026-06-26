import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiMapPin, FiCalendar, FiHeart, FiShare2, FiCheck, FiHome, FiUser } from 'react-icons/fi'
import { BiBed, BiBath, BiArea } from 'react-icons/bi'
import { propertyService } from '../../services/property.service'
import { isDemoPropertyId } from '../../data/mockProperties'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setError('Invalid property link.')
      setLoading(false)
      return
    }

    if (isDemoPropertyId(id)) {
      setError('This is a sample listing. Browse live properties to view full details.')
      setLoading(false)
      return
    }

    propertyService.getById(id)
      .then(({ data }) => {
        const resolved = data?.data?.property ?? data?.data
        if (!resolved?.title) {
          setError('Property details could not be loaded.')
          return
        }
        setProperty(resolved)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="pt-32 flex justify-center"><LoadingSpinner size="lg" /></div>
  if (error) return (
    <div className="pt-32 max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-2xl font-bold text-ink-900 dark:text-white mb-2">
        {isDemoPropertyId(id) ? 'Sample listing' : 'Oops!'}
      </h2>
      <p className="text-ink-500 dark:text-ink-400 mb-6 max-w-md mx-auto">{error}</p>
      <Link to="/properties" className="btn-primary">Browse all listings</Link>
    </div>
  )
  if (!property) return null

  const formatPrice = (price, type) => {
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
    return type === 'rent' ? `${formatted}/mo` : formatted
  }

  return (
    <div className="pt-24 pb-20">
      {/* Gallery / Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[300px] lg:h-[500px]">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-card">
            <img
              src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col gap-4">
            {property.images?.slice(1, 3).map((img, i) => (
              <div key={i} className="flex-1 rounded-2xl overflow-hidden shadow-card">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </div>
            )) || (
              <>
                <div className="flex-1 bg-ink-100 dark:bg-ink-800 rounded-2xl animate-pulse" />
                <div className="flex-1 bg-ink-100 dark:bg-ink-800 rounded-2xl animate-pulse" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                For {property.type}
              </span>
              <span className="px-3 py-1 rounded-lg bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-xs font-bold uppercase tracking-wider">
                {property.category}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink-900 dark:text-white mb-2">
              {property.title}
            </h1>
            <p className="flex items-center gap-1.5 text-ink-500 dark:text-ink-400">
              <FiMapPin className="text-emerald-600" />
              {property.address?.street}, {property.address?.city}, {property.address?.state}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-8 py-6 border-y border-ink-100 dark:border-ink-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-ink-50 dark:bg-ink-900 flex items-center justify-center text-emerald-600">
                <BiBed size={22} />
              </div>
              <div>
                <p className="text-xs text-ink-400 font-medium uppercase tracking-tight">Bedrooms</p>
                <p className="font-bold text-ink-900 dark:text-white">{property.bedrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-ink-50 dark:bg-ink-900 flex items-center justify-center text-emerald-600">
                <BiBath size={22} />
              </div>
              <div>
                <p className="text-xs text-ink-400 font-medium uppercase tracking-tight">Bathrooms</p>
                <p className="font-bold text-ink-900 dark:text-white">{property.bathrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-ink-50 dark:bg-ink-900 flex items-center justify-center text-emerald-600">
                <BiArea size={22} />
              </div>
              <div>
                <p className="text-xs text-ink-400 font-medium uppercase tracking-tight">Area</p>
                <p className="font-bold text-ink-900 dark:text-white">{property.area} m²</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-4">Description</h2>
            <p className="text-ink-600 dark:text-ink-300 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {property.amenities?.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.amenities.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300 capitalize">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <FiCheck size={12} />
                    </div>
                    {item.replace(/([A-Z])/g, ' $1')}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Actions */}
        <aside className="space-y-6">
          <div className="card p-6 lg:sticky lg:top-24">
            <div className="mb-6">
              <p className="text-sm text-ink-400 font-medium mb-1">Listing Price</p>
              <h3 className="font-display text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
                {formatPrice(property.price, property.type)}
              </h3>
            </div>

            <div className="space-y-3">
              <button className="btn-primary w-full !py-3.5">
                Book a Viewing
              </button>
              <button className="btn-secondary w-full !py-3.5">
                Contact Agent
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-ink-100 dark:border-ink-800 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors">
                <FiHeart size={16} /> Save
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-ink-100 dark:border-ink-800 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors">
                <FiShare2 size={16} /> Share
              </button>
            </div>

            {/* Agent Info */}
            <div className="mt-8 pt-8 border-t border-ink-100 dark:border-ink-800">
              <p className="text-xs text-ink-400 font-semibold uppercase tracking-wider mb-4">Listed by</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-ink-400">
                  <FiUser size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-ink-900 dark:text-white">
                    {property.agent?.firstName} {property.agent?.lastName}
                  </h4>
                  <p className="text-xs text-ink-500">Licensed Real Estate Agent</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
