import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

export function assertClientSecretConfigured(): void {
  if (!process.env.CLIENT_SECRET) {
    throw new Error(
      "CLIENT_SECRET miljøvariabel er ikke sat. " +
        "Sæt den i Vercel → Project → Settings → Environment Variables."
    );
  }
}

export function isAdminAuthenticated(req: NextRequest): boolean {
  const secret = process.env.CLIENT_SECRET;
  if (!secret) return false;

  // Check session cookie
  const sessionCookie = req.cookies.get("admin_session")?.value;
  if (!sessionCookie) return false;

  try {
    const a = Buffer.from(sessionCookie);
    const b = Buffer.from(secret);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function requireAdminRedirect(req: NextRequest): NextResponse | null {
  if (isAdminAuthenticated(req)) return null;
  return NextResponse.redirect(new URL("/admin/login", req.url));
}
