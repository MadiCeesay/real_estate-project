import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiAlertCircle, FiRefreshCw } from 'react-icons/fi'
import { propertyService } from '../../services/property.service'
import { MOCK_PROPERTIES } from '../../data/mockProperties'
import PropertyGrid from '../properties/PropertyGrid'
import ErrorBoundary from '../common/ErrorBoundary'

// Safely extract a flat array of properties from any API response shape
const normalizePropertyList = (payload) => {
  if (Array.isArray(payload)) return payload.filter(Boolean)
  if (payload && Array.isArray(payload.properties)) return payload.properties.filter(Boolean)
  if (payload && Array.isArray(payload.data)) return payload.data.filter(Boolean)
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
      const response = await propertyService.getAll({
        page: 1,
        limit: 6,
        sort: 'most_viewed',
      })

      // Handle both { data: { data: [...] } } and { data: [...] } shapes
      const raw = response?.data?.data ?? response?.data ?? null
      const fetched = normalizePropertyList(raw)

      if (fetched.length > 0) {
        setProperties(fetched)
        setUsingFallback(false)
      } else {
        // Backend is reachable but returned no properties — show mock data
        setProperties(MOCK_PROPERTIES)
        setUsingFallback(true)
      }
    } catch (err) {
      // Backend unreachable — always show mock data so page isn't blank
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
        <Link
          to="/properties"
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:gap-2.5 transition-all"
        >
          View all <FiArrowRight size={15} />
        </Link>
      </div>

      {/* Error banner — only show when there's an actual error message */}
      {error && usingFallback && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3">
          <div className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200">
            <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
            <span>Showing sample listings — live properties will appear once the server is connected.</span>
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

      {/* Soft notice when backend is up but has no properties yet */}
      {usingFallback && !error && !loading && (
        <div className="mb-6 flex items-center gap-2 text-sm text-ink-500 dark:text-ink-400 bg-ink-50 dark:bg-ink-800/50 rounded-xl px-4 py-3">
          <FiAlertCircle size={15} className="shrink-0" />
          <span>
            Sample listings below — real properties will appear here once listings go live.{' '}
            <Link to="/properties" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              Browse all properties
            </Link>
          </span>
        </div>
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