import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { registerUser } from '../../redux/slices/authSlice'
import { ROLES } from '../../constants'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)
  const [role, setRole] = useState(ROLES.BUYER)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { firstName: '', lastName: '', email: '', password: '' }
  })

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser({ ...data, role }))
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
              onClick={() => setRole(ROLES.BUYER)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${role === ROLES.BUYER ? 'bg-white dark:bg-ink-800 text-emerald-600 shadow-sm' : 'text-ink-400 hover:text-ink-600'}`}
            >
              <FiUser size={16} /> I'm a Buyer / Renter
            </button>
            <button
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">First name</label>
                <input
                  type="text"
                  placeholder="enter your first name"
                  {...register('firstName', { required: 'Required' })}
                  className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Last name</label>
                <input
                  type="text"
                  placeholder="enter your last name"
                  {...register('lastName', { required: 'Required' })}
                  className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register('email', { required: 'Email is required' })}
                  className={`input-field !pl-11 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  placeholder="password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' }
                  })}
                  className={`input-field !pl-11 ${errors.password ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3.5 mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
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
