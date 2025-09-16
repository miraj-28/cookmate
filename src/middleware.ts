import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Create a response object
  const response = NextResponse.next();

  try {
    // Create a Supabase client with the request and response
    const supabase = createMiddlewareClient(
      { req: request, res: response },
      { 
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      }
    );
    
    if (!supabase) {
      console.error('Failed to initialize Supabase client');
      return response;
    }

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Define public routes that don't require authentication
    const publicRoutes = ['/login', '/signup', '/forgot-password', '/auth/callback'];
    const isPublicRoute = publicRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    );
    
    // If user is not signed in and the current route is not public, redirect to login
    if (!user && !isPublicRoute) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // If user is signed in and tries to access login/signup, redirect to home
    if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    return response;
  } catch (error) {
    console.error('Error in middleware:', error);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth/callback (OAuth callback)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
