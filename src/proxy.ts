import { getSession } from "@/lib/server/auth/session";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ['/home', '/matches', '/messages', '/profile'];
const publicRoutes = ['/signin', '/signup', '/'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Verificar autenticação
  const token = req.cookies.get('auth-token')?.value;
  const session = token ? await getSession(token) : null;

  // Redirecionar para login se tentar acessar rota protegida sem autenticação
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // Redirecionar para home se já autenticado e tentando acessar rotas públicas
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL('/home', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};