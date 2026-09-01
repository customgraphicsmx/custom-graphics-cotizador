import { NextResponse } from "next/server";
import { sessionToken, verifyAdministratorPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  if (typeof body?.password !== "string" || !verifyAdministratorPassword(body.password)) {
    return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("cg_admin_session", sessionToken, {
    httpOnly: true, sameSite: "strict", secure: true, path: "/", maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("cg_admin_session", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });
  return response;
}
