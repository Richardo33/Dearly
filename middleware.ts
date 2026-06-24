import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!isAdminPage || isLoginPage) {
    return NextResponse.next();
  }

  const adminCookie = request.cookies.get("dearly_admin")?.value;

  if (adminCookie !== "true") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
