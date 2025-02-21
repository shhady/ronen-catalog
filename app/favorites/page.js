'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { formatPrice } from '../lib/utils';
import { Heart, ArrowRight } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/skeletons/ProductSkeleton';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
    if (storedFavorites.length > 0) {
      fetchFavoriteProducts(storedFavorites);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFavoriteProducts = async (favoriteIds) => {
    try {
      const promises = favoriteIds.map((id) =>
        fetch(`/api/products/${id}`).then((res) => res.json())
      );
      const products = await Promise.all(promises);
      setProducts(products.filter((p) => p._id)); // Filter out any failed requests
    } catch (error) {
      setError('אירעה שגיאה בטעינת המוצרים המועדפים');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (productId) => {
    const newFavorites = favorites.filter((id) => id !== productId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setProducts(products.filter((p) => p._id !== productId));
  };

  if (loading) return <div><div className="container mx-auto px-4 py-8">
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
</div></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/shop" className="flex items-center text-primary hover:underline">
          <ArrowRight className="w-4 h-4 ml-2" />
          חזרה לחנות
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">מוצרים מועדפים</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">אין מוצרים מועדפים</p>
          <Link href="/shop">
            <Button className="mt-4">לצפייה במוצרים</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white  rounded-lg shadow overflow-hidden"
            >
              <Link href={`/product/${product._id}`}>
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
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    {product.brandId && (
                      <p className="text-sm text-gray-600 ">
                        {product.brandId.name}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFavorite(product._id)}
                    className="text-red-500"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>
                {product.price && (
                  <p className="text-lg font-semibold mt-2">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 