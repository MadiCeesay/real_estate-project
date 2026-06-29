import { FiStar } from 'react-icons/fi'

const TESTIMONIALS = [
  {
    rating:5,
    name: 'Muhammed Babou',
    role: 'First-time buyer',
    quote: "I found my apartment in three days. The viewing booking system made coordinating with the agent completely painless.",
    
  },
  {
    name: 'Mamadou Bah',
    role: 'Property investor',
    quote: 'The map search and filters saved me hours. I could narrow down to exactly the neighborhoods I was targeting.',
    rating: 5,
  },
  {
    name: 'Fatou Jallow',
    role: 'Licensed agent',
    quote: 'My dashboard shows exactly which listings are getting views and bookings. It changed how I prioritize my time.',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Testimonials</span>
        <h2 className="font-display font-extrabold text-3xl text-ink-900 dark:text-white mt-1">
          Loved by buyers and agents alike
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="card p-6">
            <div className="flex gap-0.5 mb-4 text-amber-400">
              {Array.from({ length: t.rating }).map((_, i) => <FiStar key={i} size={14} className="fill-amber-400" />)}
            </div>
            <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed mb-5">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-semibold text-sm">
                {t.name[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-ink-900 dark:text-white">{t.name}</div>
                <div className="text-xs text-ink-500 dark:text-ink-400">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
