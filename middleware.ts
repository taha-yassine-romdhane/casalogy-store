import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  // Protected admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      console.log('No token found, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const payload = await verifyTokenEdge(token)
      
      console.log('Token payload:', payload)
      
      if (!payload) {
        console.log('Token verification failed')
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.set('auth-token', '', { maxAge: 0 })
        return response
      }
      
      if (payload.role !== 'ADMIN') {
        console.log('User role is not ADMIN:', payload.role)
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.set('auth-token', '', { maxAge: 0 })
        return response
      }

      console.log('Admin access granted to:', pathname)
    } catch (error) {
      console.error('Middleware auth error:', error)
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.set('auth-token', '', { maxAge: 0 })
      return response
    }
  }

  // Redirect logged-in users away from auth pages
  if (pathname === '/login' || pathname === '/signup') {
    if (token) {
      try {
        const payload = await verifyTokenEdge(token)
        
        if (payload) {
          console.log('User already logged in, redirecting based on role:', payload.role)
          if (payload.role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
          } else {
            return NextResponse.redirect(new URL('/', request.url))
          }
        }
      } catch (error) {
        // Token invalid, continue to login/signup page
        console.error('Middleware token validation error:', error)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}