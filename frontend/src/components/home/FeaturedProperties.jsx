import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { propertyService } from '../../services/property.service'
import PropertyGrid from '../properties/PropertyGrid'

const fallbackProperties = [
  {
    _id: 'sample-1',
    title: 'Jambur city apartment',
    description: 'Bright modern apartment with skyline views and a premium location.',
    price: 40000,
    type: 'sale',
    category: 'apartment',
    bedrooms: 4,
    bathrooms: 3,
    area: 90,
    address: { city: 'Banjul', state: 'Jambur' },
    images: [{ url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxhPmeYfhgw9rnmfA7Sv95cqOGxTTrHsFJo1TbajEPhg&s=10', publicId: 'sample-1' }],
    isFeatured: true,
  },
  {
    _id: 'sample-2',
    title: 'Elegant suburban house',
    description: 'Spacious family home with garden, garage, and calm neighborhood charm.',
    price: 42000,
    type: 'sale',
    category: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 210,
    address: { city: 'Banjul', state: 'Salagi' },
    images: [{ url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', publicId: 'sample-2' }],
    isFeatured: true,
  },
  {
    _id: 'sample-3',
    title: 'Premium downtown studio',
    description: 'Compact studio with premium finishes, perfect for city living.',
    price: 1900,
    type: 'rent',
    category: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    address: { city: 'Bijilo', state: 'BJ' },
    images: [{ url: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80', publicId: 'sample-3' }],
    isFeatured: true,
  },
]

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    propertyService.getAll({ limit: 6, sort: 'most_viewed', isFeatured: true })
      .then(({ data }) => {
        if (!active) return
        const fetched = data?.data || []
        setProperties(fetched.length ? fetched : fallbackProperties)
      })
      .catch(() => {
        if (active) setProperties(fallbackProperties)
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Handpicked</span>
          <h2 className="font-display font-extrabold text-3xl text-ink-900 dark:text-white mt-1">
            Featured properties
          </h2>
        </div>
        <Link to="/properties" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:gap-2.5 transition-all">
          View all <FiArrowRight size={15} />
        </Link>
      </div>

      <PropertyGrid properties={properties} loading={loading} skeletonCount={6} />

      <div className="sm:hidden mt-8 text-center">
        <Link to="/properties" className="btn-secondary">View all properties</Link>
      </div>
    </section>
  )
}
