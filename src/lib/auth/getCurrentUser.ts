import { NormalizedToken, normalizeToken } from "@/utils/normalizeJwt";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function getCurrentUser(): NormalizedToken | null {
  const token = Cookies.get("accessToken");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return normalizeToken(decoded);
  } catch (err) {
    console.error("JWT decode hatası:", err);
    return null;
  }
}
