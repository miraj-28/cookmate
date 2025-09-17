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
    
    // Authentication middleware removed - allowing public access to all routes
    
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
