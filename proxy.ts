import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hanya periksa rute admin
  if (pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get("admin_session")?.value;

    // Jika belum login dan mencoba akses rute dashboard admin
    if (!sessionToken && pathname !== "/admin/login") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Jika sudah login dan membuka halaman login
    if (sessionToken && pathname === "/admin/login") {
      const dashboardUrl = new URL("/admin", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
