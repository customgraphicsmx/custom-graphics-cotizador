import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/auth/login"];

function sessionValue() {
  const configured = process.env.AUTH_ADMIN_PASSWORD;
  if (!configured) return "";
  return crypto.createHash("sha256").update("custom-graphics-admin-session:" + configured).digest("hex");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/_next/") || pathname === "/favicon.ico") return NextResponse.next();
  if (request.cookies.get("cg_admin_session")?.value === sessionValue() && sessionValue()) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = { matcher: ["/:path*"] };
