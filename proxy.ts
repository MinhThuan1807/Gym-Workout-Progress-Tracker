import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAuth } from "./store/slices/authSlice";

export function proxy(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /workouts)
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/exercises",
    "/profile",
    "/progress",
    "/workouts",
  ];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // Get authentication token from cookies
  // Adjust the cookie name based on your auth implementation
  //   const token = request.cookies.get('auth_token')?.value

  // Redirect to login if accessing protected route without token
//   if (isProtectedRoute && !checkAuth) {
//     const url = new URL("/user/login", request.url);
//     url.searchParams.set("redirect", path);
//     return NextResponse.redirect(url);
//   }

  return NextResponse.next();
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
