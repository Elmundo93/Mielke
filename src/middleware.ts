import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "ks_session";

async function computeToken(password: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(password));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time comparison using Web Crypto (Edge-compatible, no Node.js crypto)
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode("cmp"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const [sigA, sigB] = await Promise.all([
    crypto.subtle.sign("HMAC", key, enc.encode(a)),
    crypto.subtle.sign("HMAC", key, enc.encode(b)),
  ]);
  const arrA = new Uint8Array(sigA);
  const arrB = new Uint8Array(sigB);
  return arrA.length === arrB.length && arrA.every((byte, i) => byte === arrB[i]);
}

function hasAdminConfig(): boolean {
  return !!process.env.KEYSTATIC_ADMIN_PASSWORD && !!process.env.KEYSTATIC_SECRET;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admin-login") ||
    pathname.startsWith("/api/admin-login")
  ) {
    return NextResponse.next();
  }

  if (!hasAdminConfig()) {
    return new NextResponse("Admin authentication is not configured.", { status: 500 });
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;

  if (sessionCookie) {
    const expected = await computeToken(
      process.env.KEYSTATIC_ADMIN_PASSWORD!,
      process.env.KEYSTATIC_SECRET!
    );
    if (await timingSafeEqual(sessionCookie, expected)) {
      return NextResponse.next();
    }
  }

  const loginUrl = new URL("/admin-login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
