'use client';

export function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-2" />
          <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
        <div className="p-3 bg-gray-200 rounded-full animate-pulse">
          <div className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(4).fill(null).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
} 