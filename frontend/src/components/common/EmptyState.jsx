export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-ink-400" />
        </div>
      )}
      <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-ink-500 dark:text-ink-400 max-w-sm mb-5">{description}</p>
      )}
      {action}
    </div>
  )
}
