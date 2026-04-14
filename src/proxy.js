import { NextResponse } from "next/server";

// Routes that require an admin session
const PROTECTED_PREFIXES = ["/dashboard"];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get("better-auth.session_token");
  const isAuthenticated = !!sessionToken?.value;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  // No cookie at all → fast redirect to login
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // NOTE: We do NOT redirect from /login → /dashboard here.
  // The dashboard layout verifies admin role server-side.
  // Redirecting here without a role check causes an infinite loop
  // when a non-admin session cookie is present.

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
