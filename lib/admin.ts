import crypto from "node:crypto";

function sessionValue() {
  const password = process.env.AUTH_ADMIN_PASSWORD;
  return password ? crypto.createHash("sha256").update("custom-graphics-admin-session:" + password).digest("hex") : "";
}

export function isAdministratorRequest(request: Request) {
  const token = request.headers.get("cookie")?.match(/(?:^|; )cg_admin_session=([^;]+)/)?.[1];
  const expected = sessionValue();
  if (!token || !expected) return false;
  const actualBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}
