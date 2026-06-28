import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi'
import { registerUser } from '../../redux/slices/authSlice'
import { ROLES } from '../../constants'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)
  const [role, setRole] = useState(ROLES.BUYER)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' }
  })

  const password = watch('password')

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data
    const result = await dispatch(registerUser({ ...payload, role }))
    if (registerUser.fulfilled.match(result)) {
      toast.success(`Account created! Welcome, ${result.payload.user.firstName}`)
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-28 bg-surface dark:bg-surface-dark">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-extrabold text-2xl text-ink-900 dark:text-white mb-6">
            <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-base">AMC</span>
            AMC Gambia
          </Link>
          <h1 className="text-3xl font-display font-extrabold text-ink-900 dark:text-white">Create an account</h1>
          <p className="text-ink-500 dark:text-ink-400 mt-2">Join 10,000+ people finding their dream homes</p>
        </div>

        <div className="card p-8">
          {/* Role Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 bg-ink-50 dark:bg-ink-900 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setRole(ROLES.BUYER)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${role === ROLES.BUYER ? 'bg-white dark:bg-ink-800 text-emerald-600 shadow-sm' : 'text-ink-400 hover:text-ink-600'}`}
            >
              <FiUser size={16} /> I'm a Buyer / Renter
            </button>
            <button
              type="button"
              onClick={() => setRole(ROLES.AGENT)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${role === ROLES.AGENT ? 'bg-white dark:bg-ink-800 text-emerald-600 shadow-sm' : 'text-ink-400 hover:text-ink-600'}`}
            >
              <FiCheckCircle size={16} /> I'm an Agent
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">First name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={15} />
                  <input
                    type="text"
                    placeholder="First name"
                    {...register('firstName', { required: 'First name is required' })}
                    className={`input-field !pl-11 ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Last name</label>
                <input
                  type="text"
                  placeholder="Last name"
                  {...register('lastName', { required: 'Last name is required' })}
                  className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                  })}
                  className={`input-field !pl-11 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">
                Phone number <span className="text-ink-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="tel"
                  placeholder="+220 7XX XXXX"
                  {...register('phone', {
                    pattern: { value: /^[+\d\s\-()]{7,20}$/, message: 'Enter a valid phone number' }
                  })}
                  className={`input-field !pl-11 ${errors.phone ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  ...register('password', {
  required: 'Password is required',
  minLength: { value: 8, message: 'Minimum 8 characters' },
  pattern: {
    value: /^(?=.*[A-Z])(?=.*[0-9])/,
    message: 'Password must contain at least one uppercase letter and one number'
  }
})
                  className={`input-field !pl-11 !pr-11 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Confirm password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match'
                  })}
                  className={`input-field !pl-11 !pr-11 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <p className="text-xs text-ink-400">
              By creating an account you agree to our{' '}
              <Link to="/terms" className="underline hover:text-emerald-600 transition-colors">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="underline hover:text-emerald-600 transition-colors">Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3.5 mt-2"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-ink-100 dark:border-ink-800 text-center">
            <p className="text-sm text-ink-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-ink-900 dark:text-white hover:text-emerald-600 transition-colors">
                Sign in <FiArrowRight className="inline ml-1" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}