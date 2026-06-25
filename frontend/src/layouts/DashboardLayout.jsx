import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { FiSun, FiMoon } from 'react-icons/fi'
import ErrorBoundary from '../components/common/ErrorBoundary'

// Shared shell for User/Agent/Admin dashboards. `links` is passed in by each
// role's route group so the sidebar content changes without duplicating layout.
export default function DashboardLayout({ links = [], title = 'Dashboard' }) {
  const { mode, toggle } = useTheme()
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex bg-ink-50 dark:bg-ink-900">
      <aside className="w-64 shrink-0 hidden md:flex flex-col bg-white dark:bg-ink-800 border-r border-ink-100 dark:border-ink-700">
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-lg text-ink-900 dark:text-white px-6 h-16 border-b border-ink-100 dark:border-ink-700">
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm">AMC</span>
          AMC Gambia
        </Link>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={toggle} className="m-3 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700">
          {mode === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
          {mode === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden h-16 flex items-center px-4 bg-white dark:bg-ink-800 border-b border-ink-100 dark:border-ink-700">
          <h1 className="font-display font-bold text-ink-900 dark:text-white">{title}</h1>
        </header>
        <ErrorBoundary resetKey={pathname}>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  )
}
