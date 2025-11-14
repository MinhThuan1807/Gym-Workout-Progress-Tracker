import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /workouts)
  const path = request.nextUrl.pathname

  // Auth Routes
  const authRoutes = [
    '/user/login',
    '/user/account/verification',
    '/user/register',
    '/user/register-admin',
    '/unauthorized'
  ]

  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/exercises',
    '/profile',
    '/progress',
    '/workouts'
  ]

  // Define admin routes
  const adminRoutes = [
    '/admin/dashboard',
    '/admin/account',
    '/admin/blogs',
    '/admin/exercises',
    '/admin/muscle-groups',
    '/admin/profile',
    '/admin/users'
  ]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  )

  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))

  const isAuthRoute = authRoutes.some((route) => path.startsWith(route))

  // Get authentication token from cookies
  // Adjust the cookie name based on your auth implementation
  const token = request.cookies.get('refreshToken')?.value
  const userRole = request.cookies.get('userRole')?.value

  // Enhanced auth check
  const isAuthenticated = !!token

  // Redirect to login if accessing protected route without token
  if ((isProtectedRoute || isAdminRoute) && !isAuthenticated) {
    const url = new URL('/user/login', request.url)
    return NextResponse.redirect(url)
  } else if (isAuthRoute && isAuthenticated) {
    // If user is authenticated and trying to access auth routes, redirect to dashboard
    const url = new URL(
      userRole === 'admin' ? '/admin/dashboard' : '/dashboard',
      request.url
    )
    return NextResponse.redirect(url)
  } else if (isAdminRoute && userRole !== 'admin') {
    // If non-admin user is trying to access admin routes, redirect to unauthorized page
    const url = new URL('/unauthorized', request.url)
    return NextResponse.redirect(url)
  } else if (isProtectedRoute && userRole === 'admin') {
    // If admin user is trying to access user protected routes, redirect to admin dashboard
    const url = new URL('/admin/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
