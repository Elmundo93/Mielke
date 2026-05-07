import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  isValidAdminPassword,
  SESSION_COOKIE,
} from "@/lib/admin-auth";

// In-memory rate limiting: best-effort, resets on cold start.
// Sufficient for a low-traffic admin endpoint without external dependencies.
type Entry = { attempts: number; windowStart: number; lockedUntil?: number };
const attempts = new Map<string, Entry>();

const WINDOW_MS = 5 * 60 * 1000;   // 5-Minuten-Fenster
const MAX_ATTEMPTS = 5;             // max. Versuche pro Fenster
const LOCKOUT_MS = 15 * 60 * 1000; // 15 Minuten Sperre

function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (entry?.lockedUntil && entry.lockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((entry.lockedUntil - now) / 1000) };
  }

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    attempts.set(ip, { attempts: 0, windowStart: now });
  }

  return { allowed: true };
}

function recordFailure(ip: string): void {
  const now = Date.now();
  const entry = attempts.get(ip) ?? { attempts: 0, windowStart: now };
  entry.attempts += 1;
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }
  attempts.set(ip, entry);
}

function clearAttempts(ip: string): void {
  attempts.delete(ip);
}

export async function POST(req: Request) {
  const ip = getIp(req);
  const limit = checkLimit(ip);

  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "too_many_attempts" },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter ?? 900) },
      }
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    if (!isValidAdminPassword(body.password ?? "")) {
      recordFailure(ip);
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    clearAttempts(ip);
    const token = createAdminSessionToken(process.env.KEYSTATIC_ADMIN_PASSWORD ?? "");

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("admin-login error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
