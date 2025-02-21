import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Brand from '@/models/Brand';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json(
        { message: 'המותג לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { message: 'אירעה שגיאה בטעינת המותג' },
      { status: 500 }
    );
  }
} 