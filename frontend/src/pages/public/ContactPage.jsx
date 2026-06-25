import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock submission
  }

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Side */}
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

          {/* Form Side */}
          <div className="card p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">First name</label>
                  <input type="text" placeholder="Madi" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Last name</label>
                  <input type="text" placeholder="Ceesay" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Email address</label>
                <input type="email" placeholder="cmadi3762@example.com" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 dark:text-ink-200 mb-1.5">Message</label>
                <textarea 
                  rows={4} 
                  placeholder="How can we help you?" 
                  className="input-field resize-none"
                ></textarea>
              </div>
              <button type="submit" className="btn-primary w-full !py-4">
                <FiSend className="mr-2" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
