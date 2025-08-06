"use client";

import { ApiBase } from "./apiBase";
import { ApiResponseType } from "@/interfaces/ResponseType";
import { ProfileType } from "@/interfaces/UserContainer/User/ProfileType";

class UserApi extends ApiBase {
  constructor() {
    super({
      baseURL: "https://localhost:44327",
      enableCache: true,
      headers: {
        "Content-Type": "application/json",
        "X-Module": "User",
      },
    });
  }

  async getByEmail(email: string): Promise<ApiResponseType<ProfileType>> {
    const res = await this.get<ApiResponseType<ProfileType>>(
      `/api/User/get-by-email?email=${email}`
    );
    return res.data;
  }
}

export const userApi = new UserApi();
