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

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: 'המוצר לא נמצא' },
        { status: 404 }
      );
    }

    // Update product fields
    Object.assign(product, data);
    await product.save();

    // Return updated product with populated brand
    const updatedProduct = await Product.findById(id).populate('brandId', 'name logo');
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'אירעה שגיאה בעדכון המוצר' },
      { status: 500 }
    );
  }
} 