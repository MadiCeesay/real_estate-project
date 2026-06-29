import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { authService } from '../../services/auth.service'
import { FiMoon, FiSun, FiLock, FiBell } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { mode, toggle } = useTheme()
  const navigate = useNavigate()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    priceAlerts: false,
    newListings: false,
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success('Password changed. Please log in again.')
      reset()
      setShowPasswordForm(false)
      navigate('/login')
    } catch (err) {
      toast.error(err?.message || 'Failed to change password')
    }
  }

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
              type="button"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${mode === 'dark' ? 'bg-emerald-600' : 'bg-ink-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mode === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

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
              <button type="button" onClick={() => setShowPasswordForm(!showPasswordForm)} className="btn-secondary !py-2 !px-4 text-xs">
                {showPasswordForm ? 'Cancel' : 'Update'}
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4 pt-4 border-t border-ink-100 dark:border-ink-800">
                <div>
                  <input
                    type="password"
                    placeholder="Current password"
                    {...register('currentPassword', { required: 'Current password is required' })}
                    className="input-field"
                  />
                  {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="New password"
                    {...register('newPassword', { required: 'New password is required', minLength: 8 })}
                    className="input-field"
                  />
                  {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    {...register('confirmPassword', { required: 'Please confirm your password' })}
                    className="input-field"
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary !py-2.5">
                  {isSubmitting ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-ink-50 dark:bg-ink-900 text-emerald-600 flex items-center justify-center">
              <FiBell size={20} />
            </div>
            <h2 className="font-bold text-ink-900 dark:text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive updates about your bookings via email' },
              { key: 'priceAlerts', label: 'Price Alerts', desc: 'Get notified when saved properties change price' },
              { key: 'newListings', label: 'New Listings', desc: 'Daily digest of new properties in your area' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-ink-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-ink-500">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key] }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[item.key] ? 'bg-emerald-600' : 'bg-ink-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-400 mt-4">Notification preferences are saved locally on this device.</p>
        </section>
      </div>
    </div>
  )
}
