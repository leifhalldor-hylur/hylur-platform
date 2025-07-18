import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth
    const { pathname } = req.nextUrl

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/auth/error']
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next()
    }

    // Check if user is authenticated
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(loginUrl)
    }

    // Check if user account is active
    if (!token.isActive) {
      return NextResponse.redirect(new URL('/auth/inactive', req.url))
    }

    // Role-based route protection for Hylur BESS platform
    const executiveRoutes = ['/admin', '/users', '/system-config', '/strategic-planning']
    const businessRoutes = ['/clients', '/partnerships', '/sales', '/business-analytics', '/financial']
    const technicalRoutes = ['/technical', '/diagnostics', '/integrations', '/ai-management']
    
    // Executive routes (CEO primary access)
    if (executiveRoutes.some(route => pathname.startsWith(route))) {
      if (!['CEO', 'COO'].includes(token.role)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Business-focused routes (CEO primary, COO access)
    if (businessRoutes.some(route => pathname.startsWith(route))) {
      if (!['CEO', 'COO'].includes(token.role)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    // Technical routes (COO primary, CEO access)
    if (technicalRoutes.some(route => pathname.startsWith(route))) {
      if (!['CEO', 'COO'].includes(token.role)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        const publicRoutes = ['/', '/login', '/auth/error']
        if (publicRoutes.includes(req.nextUrl.pathname)) {
          return true
        }
        
        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
