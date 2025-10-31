import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ['/home', '/users', '/messages', '/profile'];
const publicRoutes = ['/login', '/signup', '/'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // TODO: Implement actual authentication check
  if (isProtectedRoute) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // TODO: Redirect user to home if already authenticated and trying to access public routes
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};