import crypto from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function validPassword(password: string) {
  const configured = process.env.AUTH_ADMIN_PASSWORD;
  if (!configured) return false;
  const actual = Buffer.from(password);
  const expected = Buffer.from(configured);
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function sessionValue() {
  const configured = process.env.AUTH_ADMIN_PASSWORD;
  if (!configured) return "";
  return crypto.createHash("sha256").update("custom-graphics-admin-session:" + configured).digest("hex");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  if (typeof body?.password !== "string" || !validPassword(body.password)) {
    return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("cg_admin_session", sessionValue(), {
    httpOnly: true, sameSite: "strict", secure: true, path: "/", maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("cg_admin_session", "", { httpOnly: true, secure: true, path: "/", maxAge: 0 });
  return response;
}
