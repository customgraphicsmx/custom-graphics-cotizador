import { NextRequest, NextResponse } from "next/server";
import { sessionToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/api/auth/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/_next/") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }
  if (request.cookies.get("cg_admin_session")?.value === sessionToken) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const login = new URL("/login", request.url);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/:path*"] };
