'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Heart, Search, Filter, X } from 'lucide-react';

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    query: searchParams.get('query') || '',
    sort: searchParams.get('sort') || 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Update filters when URL parameters change
  useEffect(() => {
    const newFilters = {
      brand: searchParams.get('brand') || '',
      query: searchParams.get('query') || '',
      sort: searchParams.get('sort') || 'newest',
    };
    setFilters(newFilters);
  }, [searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        brand: filters.brand,
        query: filters.query,
        sort: filters.sort,
      });

      const res = await fetch(`/api/products?${queryParams}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      setError('אירעה שגיאה בטעינת המוצרים');
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      setError('אירעה שגיאה בטעינת המותגים');
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const queryParams = new URLSearchParams(newFilters);
    router.push(`/shop?${queryParams}`);
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      query: '',
      sort: 'newest',
    });
    router.push('/shop');
  };

  const toggleFavorite = (productId) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-4 rounded-lg shadow animate-pulse mb-8">
        <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="w-full">
            <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Filters Sidebar */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">סינון</h2>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              נקה סינון
            </Button>
          </div>

          <div className="flex flex-col md:flex-row justify-start items-start md:items-center gap-4">
            <div className="w-full">
              <label className="w-full text-sm font-medium mb-2">מותג</label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">כל המותגים</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="w-full text-sm font-medium mb-2">מיון</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="newest">חדש ביותר</option>
                <option value="oldest">ישן ביותר</option>
                {/* <option value="price-low">מחיר: נמוך לגבוה</option>
                <option value="price-high">מחיר: גבוה לנמוך</option> */}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
               <Link href={`/product/${product._id}`} key={product._id}> <div
                
                className="bg-white rounded-lg shadow border border-gray-400 overflow-hidden"
              >
              
                  <div className="relative h-48">
                    {product.imageUrl && (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <button
                      onClick={() => toggleFavorite(product._id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(product._id)
                            ? 'fill-red-500 text-red-500'
                            : ''
                        }`}
                      />
                    </button>
                  </div>
                  {product.brandId && (
                    <p className="text-sm text-gray-600">
                      {product.brandId.name}
                    </p>
                  )}
                </div>
             
              </div>
              </Link>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">לא נמצאו מוצרים</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 