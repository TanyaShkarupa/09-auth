import { NextRequest, NextResponse } from "next/server";
import { parseSetCookie } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);
  let refreshedCookies: string[] = [];

  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();

      isAuthenticated = response.data.success;

      const setCookie = response.headers["set-cookie"];

      if (setCookie) {
        refreshedCookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      }
    } catch {
      isAuthenticated = false;
    }
  }

  let nextResponse: NextResponse;

  if (isPrivateRoute && !isAuthenticated) {
    nextResponse = NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (isPublicRoute && isAuthenticated) {
    nextResponse = NextResponse.redirect(new URL("/", request.url));
  } else {
    nextResponse = NextResponse.next();
  }

  for (const cookie of refreshedCookies) {
    const { name, value, ...options } = parseSetCookie(cookie);

    if (typeof value !== "string") continue;

    nextResponse.cookies.set(name, value, options);
  }

  return nextResponse;
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
