import PropertyCard from './PropertyCard'
import SkeletonCard from '../common/SkeletonCard'
import EmptyState from '../common/EmptyState'
import { FiHome } from 'react-icons/fi'

export default function PropertyGrid({ properties, loading, skeletonCount = 6, emptyMessage = 'No properties found' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!properties || properties.length === 0) {
    return (
      <EmptyState
        icon={FiHome}
        title="No properties found"
        description={emptyMessage}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  )
}
