"use server";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "./auth";

const url = process.env.HOST || "http://localhost:3000";

const privateRoutes = [
  "/orders",
  "/profile",
  "/yourAddresses",
  "/loginsecurity",
  "/checkout",
  "/admin",
  "/admin/dashboard",
];

const adminRoutes = ["/admin", "/admin/dashboard"];
const authRoutes = ["/auth/signin", "/auth/signup"];

export default async function middleware(req: NextRequest) {
  const session = await auth();
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isLoggedIn = !!session;
  const userRole = session?.user?.role || null;

  const isAuthPage = authRoutes.includes(pathname);
  const isPrivateRoute = privateRoutes.includes(pathname);
  const isAdminRoute = adminRoutes.includes(pathname);
  const isApiRoute = pathname.startsWith("/api");

  if (isApiRoute) return NextResponse.next();

  if (isLoggedIn && userRole === "ADMIN" && pathname === "/") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isLoggedIn && isPrivateRoute) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (isAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
