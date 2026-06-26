import { Link } from 'react-router-dom'

const LOCATIONS = [
  {
    city: 'Banjul',
    count: '48',
    img: 'https://gambiapropertyshop.com/wp-content/uploads/2020/04/Houses-For-Rent.jpg',
  },
  {
    city: 'Serrekunda',
    count: '62',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiHO7-GKHBpDZFiRdPUFmo_Ryz1hDlZi9LUSW2JTACWg&s=10',
  },
  {
    city: 'Bakau',
    count: '35',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMcRK1K1UCOTgePTx_3DH5WTjjMAJaWlb7ynyIg6OHwJ5pvZOpDHaEjd0&s=10',
  },
  {
    city: 'Kololi',
    count: '28',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8O3YdtTk8puPY9jWx81zslDySO4BG1Ol4OAT3DVgVAQ&s=10',
  },
  {
    city: 'Brusubi',
    count: '41',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxhPmeYfhgw9rnmfA7Sv95cqOGxTTrHsFJo1TbajEPhg&s=10',
  },
  {
    city: 'Salagi',
    count: '19',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoHR6lbnpMmgxTcg3rJNKMi8XoaBUOSxiHRrmbrGR6kQ&s=10'
  }
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
