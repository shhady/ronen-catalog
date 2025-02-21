import dbConnect from './db';
import Brand from '../models/Brand';

export async function getBrands() {
  try {
    await dbConnect();
    const brands = await Brand.find({ status: 'shown' }).sort({ createdAt: -1 });
    // Convert _id to string and remove any MongoDB-specific fields
    return brands.map(brand => ({
      _id: brand._id.toString(),
      name: brand.name,
      description: brand.description,
      logo: brand.logo,
      status: brand.status,
      createdAt: brand.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
} 