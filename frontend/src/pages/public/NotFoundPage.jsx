import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-6xl font-extrabold text-ink-900 dark:text-white">404</h1>
      <p className="text-ink-500 dark:text-ink-400 mt-2 mb-6">This page doesn't exist.</p>
      <Link to="/" className="btn-primary">Back home</Link>
    </div>
  )
}
