export function VehicleCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_8px_16px_rgba(25,28,30,0.04)] animate-pulse">
      <div className="aspect-[4/3] bg-surface-container-high" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-surface-container-high rounded w-3/4" />
        <div className="h-4 bg-surface-container-high rounded w-1/2" />
        <div className="h-6 bg-surface-container-high rounded w-1/3" />
      </div>
    </div>
  );
}

export function VehicleGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-surface-container-high rounded-full" />
        <div className="space-y-2">
          <div className="h-6 bg-surface-container-high rounded w-48" />
          <div className="h-4 bg-surface-container-high rounded w-32" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-12 bg-surface-container-high rounded" />
        <div className="h-12 bg-surface-container-high rounded" />
      </div>
    </div>
  );
}