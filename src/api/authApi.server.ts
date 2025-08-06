import { RefreshTokenType } from "@/interfaces/UserContainer/Auth/RefreshTokenType";

export async function refreshTokenServer(refreshToken: RefreshTokenType) {
  const res = await fetch(
    `${process.env.API_BASE_URL}/api/Auth/refresh-token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Module": "Auth",
      },
      body: JSON.stringify(refreshToken),
    }
  );

  const data = await res.json();
  return data;
}
