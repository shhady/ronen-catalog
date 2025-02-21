import { StatsGridSkeleton } from '../components/skeletons/StatsSkeleton';
import { ProductGridSkeleton } from '../components/skeletons/ProductSkeleton';
import { BrandGridSkeleton } from '../components/skeletons/BrandSkeleton';

export default function Loading() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-6">סטטיסטיקות</h2>
        <StatsGridSkeleton />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-6">מוצרים אחרונים</h2>
        <ProductGridSkeleton count={3} />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-6">מותגים אחרונים</h2>
        <BrandGridSkeleton count={3} />
      </div>
    </div>
  );
} 