import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Heart, ArrowRight, Edit } from 'lucide-react';
import Product from '@/models/Product';
import connectDB from '@/lib/db';

async function getProduct(id) {
  await connectDB();
  const product = await Product.findById(id).populate('brandId', 'name logo');
  return product;
}

export default function ProductPage({ params }) {
  const id = use(params).id;
  const product = use(getProduct(id));

  if (!product) {
    return <div>המוצר לא נמצא</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 ">
        <Link href="/shop" className="flex items-center text-primary hover:underline">
          <ArrowRight className="w-4 h-4 ml-2" />
          חזרה לחנות
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
              <div >
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