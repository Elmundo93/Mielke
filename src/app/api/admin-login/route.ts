import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

function isValidPassword(input: string): boolean {
  const expected = process.env.KEYSTATIC_ADMIN_PASSWORD ?? "";
  if (!expected) return false;

  const secret = process.env.KEYSTATIC_SECRET ?? "fallback";
  const hmac = (s: string) =>
    createHmac("sha256", secret).update(s).digest();

  return timingSafeEqual(hmac(input), hmac(expected));
}

function createSessionToken(password: string): string {
  const secret = process.env.KEYSTATIC_SECRET ?? "fallback";
  return createHmac("sha256", secret).update(password).digest("hex");
}

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!isValidPassword(body.password ?? "")) {
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = createSessionToken(process.env.KEYSTATIC_ADMIN_PASSWORD ?? "");

  const response = NextResponse.json({ ok: true });
  response.cookies.set("ks_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return response;
}
