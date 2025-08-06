import { NextRequest, NextResponse } from "next/server";

export function deleteAllAuthCookies(response: NextResponse) {
  response.cookies.delete("accessToken");
  response.cookies.delete("accessTokenExpire");
  response.cookies.delete("refreshToken");
  response.cookies.delete("refreshTokenExpire");
}

export function isExpired(expireTime: string | undefined) {
  if (!expireTime) return true;
  return Date.parse(expireTime) < Date.now();
}

export async function hasUserBusiness(accessToken: string): Promise<boolean> {
  try {
    const res = await fetch(
      "https://localhost:44327/api/BusinessUser/active-user-businesses",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const result = await res.json();

    // Eğer API başarılı döndüyse ve data doluysa true
    return Array.isArray(result.data) && result.data.length > 0;
  } catch (err) {
    console.error("İşletme kontrolü hatası:", err);
    return false; // API hatası varsa yetki yok gibi davran
  }
}
