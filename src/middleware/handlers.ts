import { refreshTokenServer } from "@/api/authApi.server";
import { NextRequest, NextResponse } from "next/server";

export async function tryRefreshTokens(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (!refreshToken) return null;

  const res = await refreshTokenServer({ refreshToken });
  if (!res.isSuccess || !res.data) return null;

  const data = res.data;
  let response: NextResponse;

  const pathname = request.nextUrl.pathname;
  if (pathname === "/login") {
    const returnUrl = request.nextUrl.searchParams.get("returnUrl");
    const redirectUrl =
      returnUrl && returnUrl.startsWith("/") ? returnUrl : "/";
    response = NextResponse.redirect(new URL(redirectUrl, request.url));
  } else {
    response = NextResponse.next();
  }

  response.cookies.set("accessToken", data.accessToken, {
    // httpOnly: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  response.cookies.set("accessTokenExpire", data.accessTokenExpire, {
    path: "/",
    maxAge: 60 * 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  response.cookies.set("refreshToken", data.refreshToken, {
    // httpOnly: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  response.cookies.set("refreshTokenExpire", data.refreshTokenExpire, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return { response, accessToken: data.accessToken };
}
