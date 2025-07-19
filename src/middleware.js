import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("auth_token"); // Fetch auth token
  const url = req.nextUrl.clone();

  // Redirect authenticated users away from signin page
  if (url.pathname === "/admin-signin" && token) {
    return NextResponse.redirect(new URL("/admin-dashboard", req.url));
  }

  // Protect all /admin-dashboard routes
  if (url.pathname.startsWith("/admin-dashboard") && !token) {
    return NextResponse.redirect(new URL("/admin-signin", req.url));
  }

  return NextResponse.next();
}

// Define protected routes
export const config = {
  matcher: ["/admin-signin", "/admin-dashboard/:path*"], // Applies middleware to these routes
};
