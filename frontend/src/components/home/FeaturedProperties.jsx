import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { propertyService } from '../../services/property.service'
import PropertyGrid from '../properties/PropertyGrid'

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    propertyService.getAll({ limit: 6, sort: 'most_viewed' })
      .then(({ data }) => { if (active) setProperties(data.data) })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-end justify-between mb-10">
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
