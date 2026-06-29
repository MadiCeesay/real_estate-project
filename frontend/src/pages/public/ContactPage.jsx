import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck } from 'react-icons/fi'
import { contactService } from '../../services/contact.service'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await contactService.submit(data)
      setSubmitted(true)
      reset()
      toast.success('Message sent successfully!')
    } catch (err) {
      toast.error(err?.message || 'Failed to send message. Please try again.')
    }
  }

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Contact Us</span>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-ink-900 dark:text-white mt-2 mb-6">
              Get in touch with our team.
            </h1>
            <p className="text-lg text-ink-600 dark:text-ink-300 mb-10">
              Have questions about a listing or interested in becoming a partner?
              We're here to help. Reach out and we'll get back to you within 24 hours.
            </p>

            <div className="space-y-8">
              {[
                { icon: FiMail, label: 'Email', value: 'madiCeesay@gmail.com' },
                { icon: FiPhone, label: 'Phone', value: '+220-3737962' },
                { icon: FiMapPin, label: 'Office', value: 'Sukuta_Salagi, Banjul, Gambia' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-ink-50 dark:bg-ink-900 text-emerald-600 flex items-center justify-center">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-ink-400 font-semibold uppercase tracking-wider">{item.label}</p>
                    <p className="font-bold text-ink-900 dark:text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-8 md:p-10">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <FiCheck size={32} className="text-emerald-600" />
                </div>
                <h3 className="font-display text-xl font-extrabold text-ink-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-ink-500 text-sm mb-6">Thank you for reaching out. We'll respond within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">First name</label>
                    <input
                      type="text"
                      placeholder="Madi"
                      {...register('firstName', { required: 'First name is required', minLength: 2 })}
                      className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Last name</label>
                    <input
                      type="text"
                      placeholder="Ceesay"
                      {...register('lastName', { required: 'Last name is required', minLength: 2 })}
                      className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Email address</label>
                  <input
                    type="email"
                    placeholder="cmadi3762@example.com"
                    {...register('email', { required: 'Email is required' })}
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    placeholder="How can we help you?"
                    {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Message must be at least 10 characters' } })}
                    className={`input-field resize-none ${errors.message ? 'border-red-500' : ''}`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full !py-4">
                  <FiSend className="mr-2" /> {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
