import { Link } from 'react-router-dom'

const LOCATIONS = [
  {
    city: 'Banjul',
    count: '48',
    img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Serrekunda',
    count: '62',
    img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Bakau',
    count: '35',
    img: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Kololi',
    count: '28',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    city: 'Brusubi',
    count: '41',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
  },
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
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">
            Explore listings across The Gambia&apos;s most sought-after areas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {LOCATIONS.map((loc) => (
            <Link
              key={loc.city}
              to={`/properties?city=${encodeURIComponent(loc.city)}`}
              className="group relative h-56 rounded-2xl overflow-hidden block glass border border-white/10 shadow-card"
            >
              <img
                src={loc.img}
                alt={`${loc.city}, The Gambia`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent" />
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
