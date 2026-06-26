import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiAlertCircle, FiRefreshCw } from 'react-icons/fi'
import { propertyService } from '../../services/property.service'
import { MOCK_PROPERTIES } from '../../data/mockProperties'
import PropertyGrid from '../properties/PropertyGrid'
import ErrorBoundary from '../common/ErrorBoundary'

const normalizePropertyList = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.properties)) return payload.properties
  return []
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const loadFeatured = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data } = await propertyService.getAll({
        page: 1,
        limit: 6,
        sort: 'most_viewed',
      })

      const fetched = normalizePropertyList(data?.data)

      if (fetched.length > 0) {
        setProperties(fetched)
        setUsingFallback(false)
      } else {
        setProperties(MOCK_PROPERTIES)
        setUsingFallback(true)
      }
    } catch (err) {
      setProperties(MOCK_PROPERTIES)
      setUsingFallback(true)
      setError(err?.message || 'Unable to load featured properties right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFeatured()
  }, [loadFeatured])

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

      {error && usingFallback && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3">
          <div className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200">
            <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
            <span>{error} Showing sample listings until the server is available.</span>
          </div>
          <button
            type="button"
            onClick={loadFeatured}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-100 hover:underline shrink-0"
          >
            <FiRefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {usingFallback && !error && !loading && (
        <p className="mb-6 text-sm text-ink-500 dark:text-ink-400">
          Sample listings — connect the backend to show live featured properties.
        </p>
      )}

      <ErrorBoundary resetKey={properties.map((p) => p._id).join(',')}>
        <PropertyGrid
          properties={properties}
          loading={loading}
          skeletonCount={6}
          emptyMessage="Featured listings will appear here once properties are available."
        />
      </ErrorBoundary>

      <div className="sm:hidden mt-8 text-center">
        <Link to="/properties" className="btn-secondary">View all properties</Link>
      </div>
    </section>
  )
}
