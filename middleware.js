import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/shop',
    '/about',
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

  // Admin-only routes
  const adminRoutes = [
    '/dashboard',
    '/api/brands/((?!public).)*', // All brand routes except /public
    '/api/products/create',
    '/api/products/update',
    '/api/products/delete',
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
    // Verify token and get payload
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Check if route requires admin access
    const isAdminRoute = adminRoutes.some(route => {
      if (route.includes('(.*)')) {
        const baseRoute = route.replace('(.*)', '');
        return request.nextUrl.pathname.startsWith(baseRoute);
      }
      return request.nextUrl.pathname.startsWith(route);
    });

    if (isAdminRoute && payload.role !== 'admin') {
      // If it's an API route, return 403 Forbidden
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
      }
      // For other routes, redirect to home page
      return NextResponse.redirect(new URL('/', request.url));
    }

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