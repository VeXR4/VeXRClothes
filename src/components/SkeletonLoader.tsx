export function SkeletonLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 animate-ping rounded-full bg-cta/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-cta/20 border-t-cta" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] rounded-sm bg-ink-900/5" />
          <div className="mt-4 h-4 w-3/4 rounded bg-ink-900/5" />
          <div className="mt-2 h-3 w-1/2 rounded bg-ink-900/5" />
          <div className="mt-3 h-4 w-2/3 rounded bg-ink-900/5" />
        </div>
      ))}
    </div>
  );
}