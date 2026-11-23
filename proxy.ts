import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "@/lib/api/serverApi";
import { parseSetCookie } from "cookie";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  let isAuthenticated = Boolean(accessToken);
  let refreshedCookies: string[] = [];

  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession(cookieHeader);

      isAuthenticated = response.data?.success ?? false;

      const setCookie = response.headers["set-cookie"];

      refreshedCookies = setCookie
        ? Array.isArray(setCookie)
          ? setCookie
          : [setCookie]
        : [];
    } catch {
      isAuthenticated = false;
    }
  }

  let response: NextResponse;

  if (isPrivateRoute && !isAuthenticated) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (isPublicRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL("/", request.url));
  } else {
    response = NextResponse.next();
  }

  for (const cookieString of refreshedCookies) {
    const parsed = parseSetCookie(cookieString);

    if (parsed.value) {
      response.cookies.set(parsed.name, parsed.value, parsed);
    }
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
