import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET() {
  try {
    const cookieStore =await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token.value, secret);

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Auth check error:', error);
    return new NextResponse('Unauthorized', { status: 401 });
  }
} 