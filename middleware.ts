import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/features",
  "/pricing",
  "/product",
  "/chat",
  "/api",
  "/documentation",
  "/status",
  "/support",
  "/contact",
  "/help-center",
  "/privacy-policy",
  "/terms-of-service",
  "/auth/login",
  "/auth/signup",
];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/css") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const hasSession = Boolean(req.cookies.get("cortexify_session")?.value);

  if (!hasSession && !PUBLIC_PATHS.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (hasSession && ["/auth/login", "/auth/signup"].includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/chat";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon|assets|images|css|api/auth).*)",
  ],
};