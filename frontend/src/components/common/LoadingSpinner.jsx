export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-[3px]' }
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`${sizes[size]} rounded-full border-ink-200 dark:border-ink-700 border-t-emerald-600 animate-spin ${className}`}
    />
  )
}
