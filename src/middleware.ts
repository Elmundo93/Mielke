import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Läuft in der Edge-Runtime → Web Crypto API (kein Node.js crypto).
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login-Route immer durchlassen
  if (
    pathname.startsWith("/admin-login") ||
    pathname.startsWith("/api/admin-login")
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("ks_session")?.value;

  if (sessionCookie) {
    const expected = await computeToken(
      process.env.KEYSTATIC_ADMIN_PASSWORD ?? "",
      process.env.KEYSTATIC_SECRET ?? ""
    );
    if (sessionCookie === expected) {
      return NextResponse.next();
    }
  }

  // Nicht authentifiziert → zur Login-Seite
  const loginUrl = new URL("/admin-login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
