import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiSearch } from 'react-icons/fi'
import { propertyService } from '../../services/property.service'
import { PROPERTY_CATEGORIES, PROPERTY_TYPES, SORT_OPTIONS } from '../../constants'
import PropertyGrid from '../../components/properties/PropertyGrid'

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  // Sync state with URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
  })

  useEffect(() => {
    let active = true
    setLoading(true)

    const params = Object.fromEntries([...searchParams])
    
    propertyService.getAll(params)
      .then(({ data }) => {
        if (active) {
          setProperties(data.data)
          setTotal(data.total || data.data.length)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [searchParams])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)

    // Update URL params
    const newParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) newParams.set(key, val)
    })
    setSearchParams(newParams)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900 dark:text-white">
            Browse Properties
          </h1>
          <p className="text-ink-500 dark:text-ink-400 mt-1">
            {loading ? 'Searching...' : `${total} properties found`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="card p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <FiFilter className="text-emerald-600" />
              <h2 className="font-bold text-ink-900 dark:text-white">Filters</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">Search</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    type="text"
                    name="search"
                    placeholder="City, title..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="input-field !pl-10 !py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange({ target: { name: 'type', value: '' } })}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${!filters.type ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-ink-800 border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange({ target: { name: 'type', value: PROPERTY_TYPES.SALE } })}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${filters.type === PROPERTY_TYPES.SALE ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-ink-800 border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300'}`}
                  >
                    Sale
                  </button>
                  <button
                    onClick={() => handleFilterChange({ target: { name: 'type', value: PROPERTY_TYPES.RENT } })}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${filters.type === PROPERTY_TYPES.RENT ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-ink-800 border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300'}`}
                  >
                    Rent
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="input-field !py-2"
                >
                  <option value="">Any category</option>
                  {PROPERTY_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">Min Price</label>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="input-field !py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">Max Price</label>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="input-field !py-2"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setFilters({ search: '', type: '', category: '', minPrice: '', maxPrice: '', sort: 'newest' })
                  setSearchParams(new URLSearchParams())
                }}
                className="w-full py-2 text-xs font-medium text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </aside>

        {/* Property Grid */}
        <main className="lg:col-span-3">
          <PropertyGrid
            properties={properties}
            loading={loading}
            skeletonCount={6}
            emptyMessage="Try adjusting your filters to find what you're looking for."
          />
        </main>
      </div>
    </div>
  )
}
