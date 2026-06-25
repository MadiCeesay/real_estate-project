import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiMapPin } from 'react-icons/fi'

export default function Hero() {
  const navigate = useNavigate()
  const [type, setType] = useState('sale')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [budget, setBudget] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    params.set('type', type)
    if (city) params.set('city', city)
    if (category) params.set('category', category)
    if (budget) {
      const [min, max] = budget.split('-')
      if (min) params.set('minPrice', min)
      if (max) params.set('maxPrice', max)
    }
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative pt-28 pb-40 md:pt-36 md:pb-48 overflow-hidden bg-ink-900">
      {/* Background image with gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/80 via-ink-900/70 to-ink-900" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl animate-fade-up">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Trusted by 1000+ buyers and agents
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-white mb-5 text-balance">
            Find a home that fits your <span className="text-emerald-400 italic">life.</span>
          </h1>

          <p className="text-ink-200 text-base sm:text-lg leading-relaxed max-w-lg">
            Browse thousands of verified listings — apartments, houses, villas, and commercial spaces — and schedule viewings in just a few clicks.
          </p>
        </div>
      </div>

      {/* Glassmorphic floating search bar — signature element, overlaps hero edge */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-1">
        <div className="glass rounded-2xl p-4 border border-white/20 bg-white/10 backdrop-blur-5xl ">

          <div className="flex gap-1 px-2 pt-1 pb-3">
            {['sale', 'rent'].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  type === t ? 'bg-emerald-600 text-white' : 'text-ink-600 dark:text-ink-300 hover:bg-white/50 dark:hover:bg-white/10'
                }`}
              >
                {t === 'sale' ? 'Buy' : 'Rent'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
            <div className="flex-[2] flex items-center gap-2 bg-white/80 dark:bg-ink-800/80 rounded-xl px-4 py-3">
              <FiMapPin className="text-ink-400 shrink-0" size={16} />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City or neighbourhood..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-ink-400 text-ink-900 dark:text-white"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 bg-white/80 dark:bg-ink-800/80 rounded-xl px-4 py-3 text-sm outline-none text-ink-700 dark:text-ink-200"
            >
              <option value="">Any type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>

            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="flex-1 bg-white/80 dark:bg-ink-800/80 rounded-xl px-4 py-3 text-sm outline-none text-ink-700 dark:text-ink-200"
            >
              <option value="">Any price</option>
              <option value="0-50000">Under $50k</option>
              <option value="50000-150000">$50k – $150k</option>
              <option value="150000-300000">$150k – $300k</option>
              <option value="300000-600000">$300k – $600k</option>
              <option value="600000-">$600k+</option>
            </select>

            <button type="submit" className="btn-primary !px-6 shrink-0">
              <FiSearch size={16} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 mt-10 px-3 animate-fade-up" style={{ animationDelay: '220ms' }}>
          {[
            ['550+', 'Active listings'],
            ['300+', 'Properties sold'],
            ['150+', 'Verified agents'],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="font-display text-2xl font-extrabold text-white">{num}</div>
              <div className="text-sm text-ink-300">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
