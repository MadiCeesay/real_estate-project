import { Link } from 'react-router-dom'

// In a real build these counts would come from a backend aggregation
// (e.g. GET /properties/stats/cities). Hardcoded here as a sensible
// placeholder until that endpoint exists.
const LOCATIONS = [
  { city: 'Jambur',     count: '50', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxhPmeYfhgw9rnmfA7Sv95cqOGxTTrHsFJo1TbajEPhg&s=10' },
  { city: 'Jabang',     count: '34', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8O3YdtTk8puPY9jWx81zslDySO4BG1Ol4OAT3DVgVAQ&s=10' },
  { city: 'Salagi',    count: '20',   img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNgE9mizEUvKFpA0x3oiV3WIJexGxdQb3fMPx4bopqCQ&s=10' },
  { city: 'Younna',     count: '22', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQsF4xQkoBbjOWsLs9VDcO2HLuQNqo7elPLc8m0bE0uQ&s=10' },
]

export default function PopularLocations() {
  return (
    <section className="bg-ink-50 dark:bg-ink-800/40 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Where to look</span>
          <h2 className="font-display font-extrabold text-3xl text-ink-900 dark:text-white mt-1">
            Popular locations
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {LOCATIONS.map((loc) => (
            <Link
              key={loc.city}
              to={`/properties?city=${encodeURIComponent(loc.city)}`}
              className="group relative h-56 rounded-2xl overflow-hidden block"
            >
              <img
                src={loc.img}
                alt={loc.city}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display font-bold text-white text-lg">{loc.city}</h3>
                <p className="text-xs text-ink-200">{loc.count} listings</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
