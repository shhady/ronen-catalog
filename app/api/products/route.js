import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

async function verifyAuth() {
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

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brand');
    const query = searchParams.get('query');
    const sort = searchParams.get('sort') || 'newest';

    let filter = {};
    if (brandId) filter.brandId = brandId;
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    let sortOptions = {};
    switch (sort) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
      .populate('brandId', 'name logo');

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'אירעה שגיאה בטעינת המוצרים' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { message: 'אנא התחבר מחדש' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const {
      name,
      description,
      brandId,
      country,
      imageUrl,
      units,
      weight,
      weightUnit,
    } = data;

    if (!name || !brandId) {
      return NextResponse.json(
        { message: 'אנא מלא את כל השדות החובה' },
        { status: 400 }
      );
    }

    await connectDB();
    const product = new Product({
      name,
      description,
      brandId,
      country,
      imageUrl,
      units,
      weight,
      weightUnit,
    });

    await product.save();
    const savedProduct = await Product.findById(product._id).populate('brandId', 'name logo');
    return NextResponse.json(savedProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'אירעה שגיאה ביצירת המוצר' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { message: 'אנא התחבר מחדש' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id || !updateData.name || !updateData.brandId) {
      return NextResponse.json(
        { message: 'אנא מלא את כל השדות החובה' },
        { status: 400 }
      );
    }

    await connectDB();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'המוצר לא נמצא' },
        { status: 404 }
      );
    }

    Object.assign(product, updateData);
    await product.save();

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'אירעה שגיאה בעדכון המוצר' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { message: 'אנא התחבר מחדש' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'מזהה מוצר חסר' },
        { status: 400 }
      );
    }

    await connectDB();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'המוצר לא נמצא' },
        { status: 404 }
      );
    }

    await product.deleteOne();
    return NextResponse.json({ message: 'המוצר נמחק בהצלחה' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'אירעה שגיאה במחיקת המוצר' },
      { status: 500 }
    );
  }
} 