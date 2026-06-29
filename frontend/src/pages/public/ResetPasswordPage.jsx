import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiLock, FiArrowLeft } from 'react-icons/fi'
import { authService } from '../../services/auth.service'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = async ({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { data } = await authService.resetPassword(token, password)
      toast.success(data.message || 'Password reset successful. Please log in.')
    } catch (err) {
      toast.error(err.message || 'Unable to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto py-24 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-3xl p-10 shadow-sm">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-ink-900 dark:text-white">
            Reset Password
          </h1>
          <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
            Set a new password for your account. Your reset link will expire shortly.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-2">
              New password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password should be at least 8 characters' } })}
                className="input-field !pl-12 w-full"
                placeholder="Enter new password"
              />
            </div>
            {errors.password && (
              <p className="mt-2 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-2">
              Confirm password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="password"
                {...register('confirmPassword', { required: 'Confirm your password' })}
                className="input-field !pl-12 w-full"
                placeholder="Confirm new password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-xs text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Resetting...' : 'Reset password'}
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
