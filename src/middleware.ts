import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for auth cookies
  const hasAuthCookie = request.cookies.get('refreshToken')?.value;
  
  // Public routes (accessible without login)
  const publicRoutes = ['/login', '/admin/login', '/superadmin/login'];
  
  // If trying to access protected routes without auth, redirect to login
  if (!hasAuthCookie && !publicRoutes.some(route => pathname.startsWith(route))) {
    
    // Redirect based on the attempted route
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (pathname.startsWith('/superadmin')) {
      return NextResponse.redirect(new URL('/superadmin/login', request.url));
    }
    
    // Default redirect to student login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If already logged in, prevent access to login pages
  if (hasAuthCookie) {
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (pathname === '/superadmin/login') {
      return NextResponse.redirect(new URL('/superadmin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', // Protect home page
    '/dashboard/:path*', 
    '/topics/:path*', 
    '/practice/:path*', 
    '/profile/:path*', 
    '/leaderboard/:path*', 
    '/admin/:path*', 
    '/superadmin/:path*'
  ]
}