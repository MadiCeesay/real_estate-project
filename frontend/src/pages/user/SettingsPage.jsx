import { useTheme } from '../../hooks/useTheme'
import { FiMoon, FiSun, FiLock, FiBell, FiShield } from 'react-icons/fi'

export default function SettingsPage() {
  const { mode, toggle } = useTheme()

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">
          Settings
        </h1>
        <p className="text-ink-500 dark:text-ink-400 mt-1">
          Customize your experience and manage account security.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-ink-50 dark:bg-ink-900 text-emerald-600 flex items-center justify-center">
              {mode === 'dark' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </div>
            <h2 className="font-bold text-ink-900 dark:text-white">Appearance</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-ink-900 dark:text-white">Dark Mode</p>
              <p className="text-xs text-ink-500">Switch between light and dark themes</p>
            </div>
            <button 
              onClick={toggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${mode === 'dark' ? 'bg-emerald-600' : 'bg-ink-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mode === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        {/* Security */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-ink-50 dark:bg-ink-900 text-emerald-600 flex items-center justify-center">
              <FiLock size={20} />
            </div>
            <h2 className="font-bold text-ink-900 dark:text-white">Security</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-ink-900 dark:text-white">Password</p>
                <p className="text-xs text-ink-500">Change your account password</p>
              </div>
              <button className="btn-secondary !py-2 !px-4 text-xs">Update</button>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-ink-100 dark:border-ink-800">
              <div>
                <p className="text-sm font-bold text-ink-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-xs text-ink-500">Add an extra layer of security</p>
              </div>
              <button className="btn-secondary !py-2 !px-4 text-xs">Enable</button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-ink-50 dark:bg-ink-900 text-emerald-600 flex items-center justify-center">
              <FiBell size={20} />
            </div>
            <h2 className="font-bold text-ink-900 dark:text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Email Notifications', desc: 'Receive updates about your bookings via email' },
              { label: 'Price Alerts', desc: 'Get notified when saved properties change price' },
              { label: 'New Listings', desc: 'Daily digest of new properties in your area' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-ink-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-ink-500">{item.desc}</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
