import { BrandGridSkeleton } from '../../components/skeletons/BrandSkeleton';

export default function Loading() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">מותגים</h1>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" /> {/* Placeholder for "הוסף מותג" button */}
      </div>
      <BrandGridSkeleton count={12} />
    </div>
  );
} 