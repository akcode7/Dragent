import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This array contains paths that require authentication
const protectedPaths = [
  // Dashboard routes
  '/dashboard',
  '/profile',
  '/settings',
  '/subscription',
  
  // Feature routes
  '/dental',
  '/dermotology-ai',
  '/diet-planner',
  '/ecg-analysis',
  '/lab-reports',
  '/mental-health',
  '/specialists',
];

// This array contains paths that should redirect to dashboard if user is already logged in
const authPaths = ['/login', '/signup', '/forgot-password'];

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const path = request.nextUrl.pathname;

  // Check for Appwrite session cookie
  const sessionCookie = request.cookies.get('a_session_');
  const isLoggedIn = !!sessionCookie;

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(pp => path.startsWith(pp));
  const isAuthPath = authPaths.some(ap => path === ap);

  // If the path requires auth and user is not logged in, redirect to login
  if (isProtectedPath && !isLoggedIn) {
    const url = new URL('/login', request.url);
    // Store the current path for redirect after login
    url.searchParams.set('redirectTo', path);
    return NextResponse.redirect(url);
  }

  // If the path is an auth path and user is already logged in, redirect to dashboard
  if (isAuthPath && isLoggedIn) {
    // Check if there's a redirectTo query param to send the user back to their intended destination
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');
    if (redirectTo && redirectTo.startsWith('/') && !redirectTo.includes('//')) {
      // Make sure redirectTo is a relative path and not a potential security issue
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For all other cases, continue
  return NextResponse.next();
}

export const config = {
  // Specify the paths the middleware will run on
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