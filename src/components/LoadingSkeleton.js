export function MovieCardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden relative">
      <div className="aspect-[2/3] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>
        <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded w-2/3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  )
}

export function MovieGridSkeleton({ count = 20 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[80vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-4xl space-y-6">
          <div className="h-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg w-2/3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded w-3/4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </div>
            <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="flex space-x-4 pt-4">
            <div className="h-12 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg w-40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </div>
            <div className="h-12 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg w-32 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}