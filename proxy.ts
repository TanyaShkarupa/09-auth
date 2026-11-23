import { NextRequest, NextResponse } from "next/server";
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
    const [cookiePair, ...attributes] = cookie.split(";");
    const separatorIndex = cookiePair.indexOf("=");

    if (separatorIndex === -1) continue;

    const name = cookiePair.slice(0, separatorIndex).trim();
    const value = cookiePair.slice(separatorIndex + 1).trim();

    const getAttribute = (attribute: string) =>
      attributes
        .map((item) => item.trim())
        .find((item) => item.toLowerCase().startsWith(`${attribute}=`))
        ?.split("=")[1];

    const sameSite = getAttribute("samesite")?.toLowerCase();

    nextResponse.cookies.set(name, value, {
      httpOnly: attributes.some(
        (item) => item.trim().toLowerCase() === "httponly",
      ),
      secure: attributes.some((item) => item.trim().toLowerCase() === "secure"),
      path: getAttribute("path") || "/",
      domain: getAttribute("domain"),
      maxAge: getAttribute("max-age")
        ? Number(getAttribute("max-age"))
        : undefined,
      sameSite:
        sameSite === "strict" || sameSite === "lax" || sameSite === "none"
          ? sameSite
          : undefined,
    });
  }

  return nextResponse;
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
