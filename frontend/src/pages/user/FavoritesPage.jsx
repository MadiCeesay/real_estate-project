import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FiHeart } from 'react-icons/fi'
import { propertyService } from '../../services/property.service'
import PropertyGrid from '../../components/properties/PropertyGrid'

export default function FavoritesPage() {
  const favoriteIds = useSelector((state) => state.favorites.ids)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setProperties([])
      setLoading(false)
      return
    }

    setLoading(true)
    propertyService.getAll({ limit: 100 })
      .then(({ data }) => {
        const filtered = data.data.filter(p => favoriteIds.includes(p._id))
        setProperties(filtered)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [favoriteIds])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">
          Saved Properties
        </h1>
        <p className="text-ink-500 dark:text-ink-400 mt-1">
          You have {favoriteIds.length} properties saved to your list.
        </p>
      </div>

      <PropertyGrid
        properties={properties}
        loading={loading}
        skeletonCount={3}
        emptyMessage="You haven't saved any properties yet. Click the heart icon on any listing to save it here."
      />
    </div>
  )
}
