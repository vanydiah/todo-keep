import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPages = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isAuthPage = authPages.includes(request.nextUrl.pathname);
  const isProtectedPage = !authPages.some((p) => request.nextUrl.pathname.startsWith(p));

  // ✅ Jika sudah login tapi akses halaman auth → redirect ke /dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ✅ Jika belum login & akses halaman diluar auth → redirect ke /auth/login
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};