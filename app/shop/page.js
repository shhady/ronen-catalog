import ShopClient from './ShopClient';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
export const dynamic = 'force-dynamic';
export default async function ShopPage() {
  await connectDB();
  const initialProducts = await Product.find()
    .limit(20)
    .sort({ createdAt: -1 })
    .populate('brandId', 'name logo');

  // Convert _id to string and clean up the data
  const products = initialProducts.map(product => ({
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    brandId: product.brandId ? {
      _id: product.brandId._id.toString(),
      name: product.brandId.name,
      logo: product.brandId.logo
    } : null,
    imageUrl: product.imageUrl,
    country: product.country,
    units: product.units,
    weight: product.weight,
    weightUnit: product.weightUnit,
    createdAt: product.createdAt.toISOString()
  }));

  return <ShopClient initialProducts={products} />;
} 