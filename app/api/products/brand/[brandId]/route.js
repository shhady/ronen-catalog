import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  const { brandId } = await params;
  const { searchParams } = new URL(request.url);
  const excludeId = searchParams.get('excludeId');
  const limit = searchParams.get('limit') || 4;

  try {
    await connectDB();
    
    // Build query to exclude current product if excludeId is provided
    const query = { 
      brandId,
      ...(excludeId && { _id: { $ne: excludeId } })
    };

    const products = await Product.find(query)
      .limit(parseInt(limit))
      .populate('brandId', 'name logo')
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching brand products:', error);
    return NextResponse.json(
      { error: 'Error fetching brand products' },
      { status: 500 }
    );
  }
} 