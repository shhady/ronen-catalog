import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Brand from '@/models/Brand';
import Analytics from '@/models/Analytics';

export async function GET() {
  try {
    await connectDB();

    // Get counts from database
    const [productsCount, brandsCount, analytics] = await Promise.all([
      Product.countDocuments(),
      Brand.countDocuments(),
      Analytics.findOne()
    ]);

    return NextResponse.json({
      products: productsCount || 0,
      brands: brandsCount || 0,
      whatsappClicks: analytics?.whatsappClicks || 0,
      websiteViews: analytics?.websiteViews || 0
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { message: 'אירעה שגיאה בטעינת הנתונים' },
      { status: 500 }
    );
  }
} 