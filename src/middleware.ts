import { NextRequest, NextResponse } from "next/server";
import { tryRefreshTokens } from "./middleware/handlers";
import {
  deleteAllAuthCookies,
  hasUserBusiness,
  isExpired,
} from "./middleware/utils";

export async function middleware(request: NextRequest) {
  let accessToken = request.cookies.get("accessToken")?.value;
  let refreshToken = request.cookies.get("refreshToken")?.value;
  const accessTokenExpire = request.cookies.get("accessTokenExpire")?.value;
  const pathname = request.nextUrl.pathname;

  if (isExpired(accessTokenExpire) && refreshToken) {
    try {
      const result = await tryRefreshTokens(request);
      if (result) {
        accessToken = result.accessToken;
        return result.response;
      } else {
        const response = NextResponse.redirect(new URL("/login", request.url));
        deleteAllAuthCookies(response);
        return response;
      }
    } catch (e) {
      console.error("Token yenileme hatası:", e);
      const response = NextResponse.redirect(new URL("/login", request.url));
      deleteAllAuthCookies(response);
      return response;
    }
  }

  if (pathname.startsWith("/panel") && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/panel") && accessToken) {
    const isAuthorized = await hasUserBusiness(accessToken);
    if (!isAuthorized) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname === "/login" && accessToken) {
    const returnUrl = request.nextUrl.searchParams.get("returnUrl");
    const redirectUrl = returnUrl?.startsWith("/") ? returnUrl : "/";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/login"],
};
