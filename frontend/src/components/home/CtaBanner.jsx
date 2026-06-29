import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

export default function CtaBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="relative rounded-3xl bg-ink-900 overflow-hidden px-8 py-14 md:px-16 md:py-16 text-center">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #10B981 0%, transparent 50%), radial-gradient(circle at 80% 70%, #10B981 0%, transparent 50%)'
        }} />
        <div className="relative">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mb-3 text-balance">
            Have a property to list?
          </h2>
          <p className="text-ink-300 max-w-md mx-auto mb-8">
            Join hundreds of agents reaching qualified buyers and renters every day.
          </p>
          <Link to="/register" className="btn-primary !px-7 !py-3.5 inline-flex">
            Get started as an agent <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
