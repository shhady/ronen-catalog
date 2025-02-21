import { ProductGridSkeleton } from '../components/skeletons/ProductSkeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" /> {/* Placeholder for back button */}
      </div>

      <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-8" /> {/* Placeholder for title */}

      <ProductGridSkeleton count={6} />
    </div>
  );
} 