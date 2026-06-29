import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-white/10">

          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-lg text-white mb-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm">AMC</span>
              AMC Gambia
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-ink-400">
              The modern way to find, list, and manage real estate — connecting buyers, renters, and agents in one place.
            </p>
            <div className="flex gap-3 mt-5">
              {[FiInstagram, FiTwitter, FiLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-emerald-600 flex items-center justify-center transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-4">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/properties" className="hover:text-white transition-colors">Browse properties</Link></li>
              <li><Link to="/properties?type=sale" className="hover:text-white transition-colors">For sale</Link></li>
              <li><Link to="/properties?type=rent" className="hover:text-white transition-colors">For rent</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-4">Account</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/register" className="hover:text-white transition-colors">Get started</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign in</Link></li>
              <li><Link to="/agent/dashboard" className="hover:text-white transition-colors">Agent dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 text-xs text-ink-500">
          <span>© {new Date().getFullYear()} AMC Gambia. All rights reserved.</span>
          <span>Built with Madi</span>
        </div>
      </div>
    </footer>
  )
}
