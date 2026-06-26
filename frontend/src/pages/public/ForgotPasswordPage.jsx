import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { authService } from '../../services/auth.service'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ email }) => {
    setLoading(true)
    try {
      const { data } = await authService.forgotPassword(email)
      toast.success(data.message || 'If that email is registered, a reset link has been sent.')
    } catch (err) {
      toast.error(err.message || 'Unable to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto py-24 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-3xl p-10 shadow-sm">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-ink-900 dark:text-white">
            Forgot Password
          </h1>
          <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
            Enter the email address for your account and we’ll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-2">
              Email address
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input-field !pl-12 w-full"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="text-sm text-ink-500 dark:text-ink-400">
          Remembered your password?{' '}
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
