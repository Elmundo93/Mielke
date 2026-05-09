import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "ks_session";

function readAdminEnv(): { password: string; secret: string } {
  const password = process.env.KEYSTATIC_ADMIN_PASSWORD;
  const secret = process.env.KEYSTATIC_SECRET;

  if (!password || !secret) {
    throw new Error(
      "Admin-Authentifizierung ist nicht vollständig konfiguriert: KEYSTATIC_ADMIN_PASSWORD und KEYSTATIC_SECRET müssen gesetzt sein."
    );
  }

  return { password, secret };
}

export function createAdminSessionToken(password: string): string {
  const { secret } = readAdminEnv();
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function isValidAdminPassword(input: string): boolean {
  const { password } = readAdminEnv();
  const actual = Buffer.from(createAdminSessionToken(input), "hex");
  const expected = Buffer.from(createAdminSessionToken(password), "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function requireAdmin(): Promise<void> {
  const { password } = readAdminEnv();
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  if (!session) throw new Error("Nicht autorisiert.");

  const expected = createAdminSessionToken(password);
  const sessionBuf = Buffer.from(session, "hex");
  const expectedBuf = Buffer.from(expected, "hex");

  const valid =
    sessionBuf.length === expectedBuf.length && timingSafeEqual(sessionBuf, expectedBuf);

  if (!valid) throw new Error("Nicht autorisiert.");
}

export { SESSION_COOKIE };
