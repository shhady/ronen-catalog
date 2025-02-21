'use client';

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative h-48 bg-gray-200 animate-pulse" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="w-full">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full mt-4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-lg mx-auto">
      {Array(count).fill(null).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
} 