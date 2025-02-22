'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowRight, Edit } from 'lucide-react';
// import Product from '@/models/Product';
// import connectDB from '@/lib/db';
import { useProduct } from '@/contexts/ProductContext';
import { useEffect, useState } from 'react';
import { use } from 'react';

// export const revalidate = 60; // re-generate every 60 seconds

// async function getProduct(id) {
//   await connectDB();
//   return product;
// }

export default function ProductPage({ params }) {
  // Properly unwrap the params promise using React.use()
  const { id } = use(params);
  const { selectedProduct } = useProduct();
  const [product, setProduct] = useState(selectedProduct);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!selectedProduct) {
        try {
          const response = await fetch(`/api/products/${id}`);
          if (!response.ok) throw new Error('Failed to fetch product');
          const data = await response.json();
          setProduct(data);
        } catch (err) {
          setError(true);
        }
      }
    }
    
    if (!selectedProduct) {
      fetchProduct();
    }
  }, [id, selectedProduct]);

  if (error) {
    return <div>המוצר לא נמצא</div>;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Back to catalog link skeleton */}
        <div className="mb-8">
          <div className="flex items-center text-primary">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image skeleton */}
          <div className="relative h-96 bg-white rounded-lg overflow-hidden animate-pulse">
            <div className="w-full h-full bg-gray-200"></div>
          </div>

          {/* Product Info skeleton */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-40"></div>
              </div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-4">
              <div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded w-full"></div>
              </div>
            </div>

            {/* Details skeleton */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-6 items-center">
                <div className="pt-2">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-28 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 ">
        <Link href="/shop" className="flex items-center text-primary hover:underline">
          <ArrowRight className="w-4 h-4 ml-2" />
          חזרה לקטלוג
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative h-96 bg-white rounded-lg overflow-hidden">
          {product.imageUrl ? (
           <Image
             src={product.imageUrl}
             alt={product.name}
             fill
             className="object-contain px-4"
             placeholder="blur"
             blurDataURL="/placeholder.png"
           />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              אין תמונה
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.brandId && (
                <p className="text-lg text-gray-600">
                  {product.brandId.name}
                </p>
              )}
            </div>
          </div>

          {product.description && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">תיאור המוצר</h2>
                <p className="text-gray-600">
                  {product.description}
                </p>
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <div className="grid grid-cols-2 gap-6 items-center">
              {product.country && (
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-gray-500">ארץ ייצור</h3>
                  <p className="text-gray-900">{product.country}</p>
                </div>
              )}
              {product.units && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">יחידות באריזה</h3>
                  <p className="text-gray-900">{product.units}</p>
                </div>
              )}
              {product.weight && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">משקל ליחידה</h3>
                  <p className="text-gray-900">
                    {product.weight} {product.weightUnit}
                  </p>
                </div>
              )}
              {product.weight && product.units && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">משקל כולל</h3>
                  <p className="text-gray-900">
                    {parseFloat(product.weight) * parseInt(product.units)} {product.weightUnit}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 