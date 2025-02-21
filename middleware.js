import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/shop',
    '/product/(.*)',
    '/sign-in',
    '/sign-up',
    '/api/auth/login',
    '/api/auth/signup',
    '/api/products',
    '/api/products/(.*)',
    '/api/brands',
    '/api/brands/public',
    '/favorites',
    '/_next/static/(.*)',
    '/favicon.ico'
  ];

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route.includes('(.*)')) {
      const baseRoute = route.replace('(.*)', '');
      return request.nextUrl.pathname.startsWith(baseRoute);
    }
    return request.nextUrl.pathname === route;
  });

  // Check if it's a GET request to /api/brands
  const isBrandsGetRequest = 
    request.nextUrl.pathname === '/api/brands' && 
    request.method === 'GET';

  if (isPublicRoute || isBrandsGetRequest) {
    return NextResponse.next();
  }

  // Get token from cookies or Authorization header
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    // If it's an API route, return 401
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // For other routes, redirect to sign-in
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  try {
    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    // If it's an API route, return 401
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    // For other routes, redirect to sign-in
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/brands/:path*',
    '/api/products/:path*',
    '/dashboard/:path*'
  ]
};