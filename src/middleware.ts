import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This array contains paths that require authentication
const protectedPaths = [
  // Dashboard routes
  
  '/su',
  
  // Feature routes
  
];

// This array contains paths that should redirect to dashboard if user is already logged in
const authPaths = ['/login', '/signup', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Appwrite stores session cookies with various possible names
  const cookies = request.cookies.getAll();
  const hasActiveSession = cookies.some(cookie => {
    // Check specifically for Appwrite session cookies
    return (
      (cookie.name.startsWith('a_session_') && cookie.value.length > 0) || 
      (cookie.name === 'a_session' && cookie.value.length > 0) ||
      (cookie.name === 'appwrite-token' && cookie.value.length > 0)
    );
  });

  // For protected routes, redirect to login if no session exists
  const isProtectedPath = protectedPaths.some(pp => path.startsWith(pp));
  if (isProtectedPath && !hasActiveSession) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirectTo', path);
    return NextResponse.redirect(url);
  }

  // For auth routes (login/signup), redirect to dashboard if already logged in
  const isAuthPath = authPaths.some(ap => path === ap);
  if (isAuthPath && hasActiveSession) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');
    const redirectUrl = new URL(
      redirectTo && redirectTo.startsWith('/') ? redirectTo : '/dashboard',
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /favicon.ico, /logo.png (static files)
     */
    '/((?!api|_next|_static|favicon.ico|logo.png).*)',
  ],
};