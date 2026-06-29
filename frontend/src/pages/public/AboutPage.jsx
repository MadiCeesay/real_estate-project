import { FiCheckCircle, FiUsers, FiAward, FiMap } from 'react-icons/fi'

export default function AboutPage() {
  const stats = [
    { label: 'Active Listings', value: '500+', icon: FiMap },
    { label: 'Properties Sold', value: '250+', icon: FiAward },
    { label: 'Verified Agents', value: '100+', icon: FiUsers },
  ]

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Our Story</span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-ink-900 dark:text-white mt-2 mb-6">
            Redefining the real estate experience.
          </h1>
          <p className="text-lg text-ink-600 dark:text-ink-300 leading-relaxed">
            AMC Gambia was born out of a simple observation: finding a home should be as exciting as moving into one. 
            We've built a platform that combines cutting-edge technology with human expertise to make buying, 
            renting, and selling property seamless, transparent, and efficient.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <stat.icon size={24} />
              </div>
              <p className="text-3xl font-display font-extrabold text-ink-900 dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm text-ink-500 font-medium uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white mb-6">
              Why choose AMC Gambia?
            </h2>
            <div className="space-y-6">
              {[
                { title: 'Verified Listings', desc: 'Every property on our platform is manually verified by our team to ensure accuracy and prevent fraud.' },
                { title: 'Seamless Booking', desc: 'Schedule viewings directly through the platform with real-time availability from agents.' },
                { title: 'Expert Guidance', desc: 'Connect with the top 1% of licensed real estate agents in your preferred neighborhood.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 text-emerald-600">
                    <FiCheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-ink-600 dark:text-ink-300">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-card aspect-square lg:aspect-video">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80" 
              alt="Our office" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
