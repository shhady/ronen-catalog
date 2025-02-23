import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import Brand from '@/models/Brand';

async function verifyAuth(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    return false;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
}

export async function GET() {
  try {
    await connectDB();
    const brands = await Brand.find({ status: 'shown' }).sort({ createdAt: -1 });
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { message: 'אירעה שגיאה בטעינת המותגים' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const isAuthenticated = await verifyAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'אנא התחבר מחדש' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { name, logo, description, longDescription } = data;

    if (!name || !logo || !description) {
      return NextResponse.json(
        { error: 'אנא מלא את כל השדות' },
        { status: 400 }
      );
    }

    await connectDB();
    const brand = new Brand({
      name,
      logo,
      description,
      longDescription,
      status: 'shown',
    });

    await brand.save();
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { error: 'אירעה שגיאה ביצירת המותג' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const isAuthenticated = await verifyAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'אנא התחבר מחדש' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { id, name, logo, description, status, longDescription } = data;

    if (!id || !name || !description) {
      return NextResponse.json(
        { error: 'אנא מלא את כל השדות' },
        { status: 400 }
      );
    }

    await connectDB();
    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json(
        { error: 'המותג לא נמצא' },
        { status: 404 }
      );
    }

    brand.name = name;
    if (logo) brand.logo = logo;
    brand.description = description;
    if (status) brand.status = status;
    brand.longDescription = longDescription;

    await brand.save();
    return NextResponse.json(brand);
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { error: 'אירעה שגיאה בעדכון המותג' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const isAuthenticated = await verifyAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'אנא התחבר מחדש' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'מזהה מותג חסר' },
        { status: 400 }
      );
    }

    await connectDB();
    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json(
        { error: 'המותג לא נמצא' },
        { status: 404 }
      );
    }

    await brand.deleteOne();
    return NextResponse.json({ message: 'המותג נמחק בהצלחה' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'אירעה שגיאה במחיקת המותג' },
      { status: 500 }
    );
  }
} 