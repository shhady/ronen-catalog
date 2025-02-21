import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();

    const product = await Product.findById(id).populate('brandId', 'name logo');

    if (!product) {
      return NextResponse.json(
        { message: 'המוצר לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'אירעה שגיאה בטעינת המוצר' },
      { status: 500 }
    );
  }
} 