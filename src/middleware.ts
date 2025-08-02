import { NextRequest, NextResponse } from "next/server";
import { authApi } from "./api/authApi";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const accessTokenExpire = request.cookies.get("accessTokenExpire")?.value;

  const pathname = request.nextUrl.pathname;

  const expireString = "2025-08-02T10:15:23.4821898Z";
  const expireTimestamp = Date.parse(expireString);
  const now = Date.now();
  if (accessToken && accessTokenExpire && expireTimestamp < now) {
    if (refreshToken) {
      const res = await authApi.refreshToken({ refreshToken: refreshToken });

      if (res.isSuccess && res.data) {
        const data = res.data;

        const response = NextResponse.next();
        response.cookies.set("accessToken", data.accessToken, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 30,
        });
        response.cookies.set("accessTokenExpire", data.accessTokenExpire);
        response.cookies.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        response.cookies.set("refreshTokenExpire", data.refreshTokenExpire);
        return response;
      } else {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("accessTokenExpire");
        response.cookies.delete("refreshToken");
        response.cookies.delete("refreshTokenExpire");
        return response;
      }
    }
  }

  if (pathname.startsWith("/dashboard") && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Hangi rotalara middleware uygulanacak
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
