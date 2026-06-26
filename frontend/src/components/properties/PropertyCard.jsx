import { Link } from 'react-router-dom'
import { FiHeart, FiMapPin, FiHome } from 'react-icons/fi'
import { BiBed, BiBath, BiArea } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../hooks/useAuth'
import { toggleFavorite } from '../../redux/slices/favoritesSlice'
import { isDemoPropertyId } from '../../data/mockProperties'
import toast from 'react-hot-toast'

const formatPrice = (price, type) => {
  const safePrice = Number(price)
  if (!Number.isFinite(safePrice)) return 'Price on request'
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(safePrice)
  return type === 'rent' ? `${formatted}/mo` : formatted
}

export default function PropertyCard({ property }) {
  const dispatch = useDispatch()
  const { isAuthenticated } = useAuth()
  const favoriteIds = useSelector((state) => state.favorites.ids)
  const isFavorited = favoriteIds.includes(property._id)
  const isDemo = property.isDemo || isDemoPropertyId(property._id)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isDemo) {
      toast.error('Sign in and browse live listings to save properties')
      return
    }
    if (!isAuthenticated) {
      toast.error('Sign in to save properties')
      return
    }
    dispatch(toggleFavorite(property._id))
  }

  const coverImage = property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=60'

  const detailPath = isDemo
    ? `/properties?city=${encodeURIComponent(property.address?.city || '')}`
    : `/properties/${property._id}`

  return (
    <Link to={detailPath} className="card group overflow-hidden block">
      <div className="relative h-52 overflow-hidden">
        <img
          src={coverImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Status badge */}
        {property.type && (
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-lg bg-ink-900/80 text-white backdrop-blur-sm">
            {property.type === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
        )}

        {property.isFeatured && (
          <span className="absolute top-3 left-3 mt-7 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500 text-white">
            Featured
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={isFavorited ? 'Remove from saved' : 'Save property'}
          className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
        >
          <FiHeart
            size={15}
            className={isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-bold text-base text-ink-900 dark:text-white line-clamp-1">
            {property.title}
          </h3>
        </div>

        <p className="flex items-center gap-1 text-xs text-ink-500 dark:text-ink-400 mb-3">
          <FiMapPin size={12} />
          {[property.address?.city, property.address?.state].filter(Boolean).join(', ') || 'Location TBD'}
        </p>

        <div className="flex items-center gap-4 text-xs text-ink-600 dark:text-ink-300 mb-3">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1"><BiBed size={15} />{property.bedrooms} bd</span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1"><BiBath size={15} />{property.bathrooms} ba</span>
          )}
          {property.area != null && (
            <span className="flex items-center gap-1"><BiArea size={15} />{property.area} m²</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-ink-100 dark:border-ink-700">
          <span className="font-display font-extrabold text-lg text-emerald-700 dark:text-emerald-400">
            {formatPrice(property.price, property.type)}
          </span>
          <span className="text-xs font-medium text-ink-400 flex items-center gap-1">
            <FiHome size={12} /> {property.category}
          </span>
        </div>
      </div>
    </Link>
  )
}
