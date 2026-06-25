import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { FiSun, FiMoon, FiMenu, FiX, FiHeart, FiCalendar, FiGrid } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { logoutUser } from '../../redux/slices/authSlice'
import toast from 'react-hot-toast'

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
    isActive
      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
      : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800'
  }`

export default function Navbar() {
  const { user, isAuthenticated, isAgent, isAdmin, dispatch } = useAuth()
  const { mode, toggle } = useTheme()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    toast.success('Signed out successfully')
    navigate('/')
  }

  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : ''

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-glass'
          : 'bg-surface/0 dark:bg-surface-dark/0 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-lg text-ink-900 dark:text-white">
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm">AMC</span>
          AMC Gambia
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/properties" className={navLinkClass}>Browse</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          {isAgent && <NavLink to="/agent/dashboard" className={navLinkClass}>Agent Dashboard</NavLink>}
          {isAdmin && <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-500 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
          >
            {mode === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
          </button>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/favorites" aria-label="Saved properties" className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-500 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
                <FiHeart size={17} />
              </Link>
              <Link to="/bookings" aria-label="My viewings" className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-500 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
                <FiCalendar size={17} />
              </Link>
              <Link to="/account/profile" className="w-9 h-9 rounded-full bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center ml-1" title={`${user.firstName} ${user.lastName}`}>
                {initials}
              </Link>
              <button onClick={handleLogout} className="ml-2 text-sm font-medium text-ink-500 hover:text-red-600 transition-colors px-2">
                Sign out
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-ghost">Sign in</Link>
              <Link to="/register" className="btn-primary !py-2 !px-4">Get started</Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-ink-700 dark:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-ink-100 dark:border-ink-800 px-4 py-4 space-y-1 animate-fade-in">
          <NavLink to="/properties" className={navLinkClass} onClick={() => setMobileOpen(false)}>Browse</NavLink>
          <NavLink to="/about" className={navLinkClass} onClick={() => setMobileOpen(false)}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass} onClick={() => setMobileOpen(false)}>Contact</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/favorites" className={navLinkClass} onClick={() => setMobileOpen(false)}><FiHeart className="inline mr-2" />Saved</NavLink>
              <NavLink to="/bookings" className={navLinkClass} onClick={() => setMobileOpen(false)}><FiCalendar className="inline mr-2" />Viewings</NavLink>
              {isAgent && <NavLink to="/agent/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}><FiGrid className="inline mr-2" />Agent Dashboard</NavLink>}
              {isAdmin && <NavLink to="/admin/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>Admin</NavLink>}
              <button onClick={() => { setMobileOpen(false); handleLogout() }} className="w-full text-left px-3 py-2 text-sm font-medium text-red-600">
                Sign out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="btn-secondary flex-1" onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link to="/register" className="btn-primary flex-1" onClick={() => setMobileOpen(false)}>Get started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
