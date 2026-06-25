// Mimics the exact dimensions of PropertyCard so layout doesn't jump
// when real content replaces the skeleton.
export default function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-md" />
        <div className="skeleton h-4 w-1/2 rounded-md" />
        <div className="flex gap-3 pt-1">
          <div className="skeleton h-4 w-12 rounded-md" />
          <div className="skeleton h-4 w-12 rounded-md" />
          <div className="skeleton h-4 w-12 rounded-md" />
        </div>
      </div>
    </div>
  )
}
