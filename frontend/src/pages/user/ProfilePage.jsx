import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/useAuth'
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  })

  const onSubmit = (data) => {
    toast.success('Profile updated successfully!')
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-extrabold text-ink-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-ink-500 dark:text-ink-400 mt-1">
          Manage your personal information and account security.
        </p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <button type="button" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">
                Change avatar
              </button>
              <p className="text-xs text-ink-400 mt-1">JPG, GIF or PNG. Max size 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">First name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  {...register('firstName', { required: 'Required' })}
                  className="input-field !pl-11"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Last name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  {...register('lastName', { required: 'Required' })}
                  className="input-field !pl-11"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Email address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="email"
                disabled
                {...register('email')}
                className="input-field !pl-11 opacity-60 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-ink-400 mt-1.5">Email cannot be changed once verified.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Phone number</label>
            <div className="relative">
              <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register('phone')}
                className="input-field !pl-11"
              />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="btn-primary w-full sm:w-auto !px-8">
              <FiSave className="mr-2" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
