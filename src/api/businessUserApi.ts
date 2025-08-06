"use client";

import { ApiBase } from "./apiBase";
import { ApiResponseType } from "@/interfaces/ResponseType";
import { BusinessUserResponseType } from "@/interfaces/BusinessContainer/BusinessUser/BusinessUserResponseType";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { DetailedBusinessResponseType } from "@/interfaces/BusinessContainer/Business/DetailedBusinessType";
import { CreateBusinessUserType } from "@/interfaces/BusinessContainer/BusinessUser/CreateBusinessUserType";
import { UpdateBusinessUserType } from "@/interfaces/BusinessContainer/BusinessUser/UpdateBusinessUserType";
class BusinessUserApi extends ApiBase {
  constructor() {
    super({
      baseURL: "https://localhost:44327",
      enableCache: false,
      defaultCacheTTL: 5 * 60 * 1000,
      headers: {
        "Content-Type": "application/json",
        "X-Module": "BusinessUser",
      },
    });
  }

  async getUserBusinesses(): Promise<
    ApiResponseType<BusinessUserResponseType[]>
  > {
    const user = getCurrentUser();
    const userId = user?.userId;
    if (!userId)
      throw {
        isSuccess: false,
        message: "Kullanıcı bulunamadı",
        statusCode: 404,
        data: [],
      };
    const res = await this.get<ApiResponseType<BusinessUserResponseType[]>>(
      `/api/BusinessUser/by-userId?userId=${userId}`
    );
    return res.data;
  }

  async getBusinessUsers(
    businessId: string
  ): Promise<ApiResponseType<BusinessUserResponseType[]>> {
    const res = await this.get<ApiResponseType<BusinessUserResponseType[]>>(
      `/api/BusinessUser/by-businessId?businessId=${businessId}`
    );
    return res.data;
  }

  async createBusinessUser(
    user: CreateBusinessUserType
  ): Promise<ApiResponseType<null>> {
    const res = await this.post<ApiResponseType<null>>(
      `/api/BusinessUser/create`,
      user
    );
    return res.data;
  }

  async getActiveUserDetailedBusinesses(): Promise<
    ApiResponseType<DetailedBusinessResponseType[]>
  > {
    const user = getCurrentUser();
    const userId = user?.userId;
    if (!userId)
      throw {
        isSuccess: false,
        message: "Kullanıcı bulunamadı",
        statusCode: 404,
        data: [],
      };
    const res = await this.get<ApiResponseType<DetailedBusinessResponseType[]>>(
      `/api/BusinessUser/active-user-businesses`
    );
    return res.data;
  }

  async deleteBusinessUser(
    businessUserId: string
  ): Promise<ApiResponseType<null>> {
    const res = await this.delete<ApiResponseType<null>>(
      `/api/BusinessUser/delete?businessUserId=${businessUserId}`
    );
    return res.data;
  }

  async getById(
    id: string
  ): Promise<ApiResponseType<BusinessUserResponseType>> {
    const res = await this.get<ApiResponseType<BusinessUserResponseType>>(
      `/api/BusinessUser/${id}`
    );
    return res.data;
  }

  async update(user: UpdateBusinessUserType): Promise<ApiResponseType<null>> {
    const res = await this.patch<ApiResponseType<null>>(
      `/api/BusinessUser/update`,
      user
    );
    return res.data;
  }
}

export const businessUserApi = new BusinessUserApi();
