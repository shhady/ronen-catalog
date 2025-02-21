import { ProductGridSkeleton } from '../../components/skeletons/ProductSkeleton';

export default function Loading() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">מוצרים</h1>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" /> {/* Placeholder for "הוסף מוצר" button */}
      </div>
      <ProductGridSkeleton count={12} />
    </div>
  );
} 