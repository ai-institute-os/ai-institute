import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

// In-memory rate limiter: max 5 attempts per 15 min per IP
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

interface RateEntry {
  count: number;
  windowStart: number;
}

const rateLimitMap = new Map<string, RateEntry>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "For mange forsøg" }, { status: 429 });
  }

  const secret = process.env.CLIENT_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Server ikke konfigureret" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const { password } = body as Record<string, unknown>;
  if (typeof password !== "string" || !password) {
    return NextResponse.json({ error: "Adgangskode mangler" }, { status: 400 });
  }

  let match = false;
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(secret);
    if (a.length === b.length) {
      match = timingSafeEqual(a, b);
    }
  } catch {
    match = false;
  }

  if (!match) {
    return NextResponse.json({ error: "Forkert adgangskode" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 86400 * 30,
    path: "/",
  });
  return res;
}
