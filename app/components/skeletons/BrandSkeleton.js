'use client';

export function BrandSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="relative h-40 mb-4 bg-gray-200 animate-pulse rounded-lg" />
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
      </div>
    </div>
  );
}

export function BrandGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array(count).fill(null).map((_, i) => (
        <BrandSkeleton key={i} />
      ))}
    </div>
  );
} 