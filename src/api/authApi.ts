import Cookies from "js-cookie";
import { ApiBase } from "./apiBase";
import { LoginType } from "@/interfaces/UserContainer/Auth/LoginType";
import { TokenResponseType } from "@/interfaces/UserContainer/Auth/TokenResponseType";
import { ApiResponseType } from "@/interfaces/ResponseType";
import { RegisterType } from "@/interfaces/UserContainer/Auth/RegisterType";
import { RefreshTokenType } from "@/interfaces/UserContainer/Auth/RefreshTokenType";
class AuthApi extends ApiBase {
  constructor() {
    super({
      baseURL: "https://localhost:44327",
      enableCache: false,
      //   defaultCacheTTL: 5 * 60 * 1000,
      headers: {
        "Content-Type": "application/json",
        "X-Module": "Auth",
      },
    });
  }

  async login(data: LoginType): Promise<ApiResponseType<TokenResponseType>> {
    const res = await this.post<ApiResponseType<TokenResponseType>, LoginType>(
      "/api/Auth/login",
      data
    );
    if (res.data.data) {
      const _data = res.data.data;
      Cookies.set("accessToken", _data.accessToken);
      Cookies.set("refreshToken", _data.refreshToken);
      Cookies.set("accessTokenExpire", _data.accessTokenExpire);
      Cookies.set("refreshTokenExpire", _data.refreshTokenExpire);
      this.setAuthToken(_data.accessToken);
    }
    return res.data;
  }

  async register(
    data: RegisterType
  ): Promise<ApiResponseType<TokenResponseType>> {
    const res = await this.post<
      ApiResponseType<TokenResponseType>,
      RegisterType
    >("/api/Auth/register", data);
    if (res.data.data) {
      const _data = res.data.data;
      Cookies.set("accessToken", _data.accessToken);
      Cookies.set("refreshToken", _data.refreshToken);
      Cookies.set("accessTokenExpire", _data.accessTokenExpire);
      Cookies.set("refreshTokenExpire", _data.refreshTokenExpire);
      this.setAuthToken(_data.accessToken);
    }
    return res.data;
  }

  async refreshToken(
    data: RefreshTokenType
  ): Promise<ApiResponseType<TokenResponseType>> {
    const res = await this.post<
      ApiResponseType<TokenResponseType>,
      RefreshTokenType
    >("/api/Auth/refresh-token", data);
    if (res.data.data) {
      const _data = res.data.data;
      Cookies.set("accessToken", _data.accessToken);
      Cookies.set("refreshToken", _data.refreshToken);
      Cookies.set("accessTokenExpire", _data.accessTokenExpire);
      Cookies.set("refreshTokenExpire", _data.refreshTokenExpire);
      this.setAuthToken(_data.accessToken);
    }
    return res.data;
  }
}

export const authApi = new AuthApi();
