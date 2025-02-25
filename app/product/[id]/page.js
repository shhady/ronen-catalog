'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowRight, Edit } from 'lucide-react';
// import Product from '@/models/Product';
// import connectDB from '@/lib/db';
import { useProduct } from '@/contexts/ProductContext';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// export const revalidate = 60; // re-generate every 60 seconds

// async function getProduct(id) {
//   await connectDB();
//   return product;
// }

// Function to convert HTML to formatted text while preserving structure
const stripHtml = (html) => {
  if (!html) return '';
  
  // Create a temporary div
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  
  // Process block elements to add line breaks
  const blockElements = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'];
  blockElements.forEach(tag => {
    const elements = tmp.getElementsByTagName(tag);
    for (let el of elements) {
      el.innerHTML = el.innerHTML + '\n';
    }
  });

  // Get text content and trim extra whitespace
  let text = tmp.textContent || tmp.innerText || '';
  return text.replace(/\n\s*\n/g, '\n').trim(); // Remove multiple consecutive line breaks
};

export default function ProductPage({ params }) {
  const { id } = use(params);
  const { selectedProduct } = useProduct();
  const [product, setProduct] = useState(selectedProduct);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!selectedProduct) {
      // Only fetch product if not in context
      fetchProduct();
    } else {
      // If we have the product, just fetch related products
      fetchRelatedProducts(selectedProduct.brandId);
    }
  }, [id, selectedProduct]);

  async function fetchProduct() {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
      fetchRelatedProducts(data.brandId);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }

  async function fetchRelatedProducts(brandId) {
    if (!brandId) return;
    
    try {
      setLoadingRelated(true);
      const relatedRes = await fetch(`/api/products/brand/${brandId._id}?excludeId=${id}&limit=4`);
      if (!relatedRes.ok) {
        console.error('Failed to fetch related products');
        return;
      }
      const relatedData = await relatedRes.json();
      if (Array.isArray(relatedData)) {
        setRelatedProducts(relatedData);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoadingRelated(false);
    }
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Product Skeleton */}
        <div className="mb-6">
          <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Skeleton */}
          <div className="relative h-96 bg-white rounded-lg overflow-hidden">
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-40 animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
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
      {/* Main product content */}
      <div className="mb-6">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          חזור
        </Button>
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
                <div 
                  className="text-gray-600 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 items-center">
              {product.country && (
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">ארץ ייצור</h3>
                  <p className="text-gray-900">{product.country}</p>
                </div>
              )}
              {product.units && (
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">יחידות באריזה</h3>
                  <p className="text-gray-900">{product.units}</p>
                </div>
              )}
              {product.weight && (
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">משקל ליחידה</h3>
                  <p className="text-gray-900">
                    {product.weight} {product.weightUnit}
                  </p>
                </div>
              )}
              {/* {product.weight && product.units && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">משקל כולל</h3>
                  <p className="text-gray-900">
                    {parseFloat(product.weight) * parseInt(product.units)} {product.weightUnit}
                  </p>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {loadingRelated ? (
        <div className="mt-12">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 bg-gray-200 animate-pulse" />
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">מוצרים דומים</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct._id}
                href={`/product/${relatedProduct._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={relatedProduct.imageUrl || '/placeholder.png'}
                    alt={relatedProduct.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                  {relatedProduct.weight && relatedProduct.weightUnit && (
                    <p className="text-sm text-gray-600">
                      {relatedProduct.weight} {relatedProduct.weightUnit}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 