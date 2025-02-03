import { NextRequest, NextResponse } from 'next/server';
import { publicRoutes, protectedRoutes } from './middleware/routes';
import { runCors } from './middleware/cors'; // Import the CORS helper function

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthenticated = req.cookies.get('auth-token'); // Assuming auth state is stored in cookies

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Run CORS middleware
  await runCors(req);

  // Allow requests to public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users from protected routes to login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Allow access to protected routes for authenticated users
  return NextResponse.next();
}


export const config = {
  matcher: ["/profile/:path*", "/upload", "/likes", "/bookmarks"],
}

