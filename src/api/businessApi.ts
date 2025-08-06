"use client";

import { CreateBusinessType } from "@/interfaces/BusinessContainer/Business/CreateBusinessType";
import { ApiBase } from "./apiBase";
import { ApiResponseType } from "@/interfaces/ResponseType";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { BusinessResponseType } from "@/interfaces/BusinessContainer/Business/BusinessResponseType";
import { UpdateBusinessType } from "@/interfaces/BusinessContainer/Business/UpdateBusinessType";
class BusinessApi extends ApiBase {
  constructor() {
    super({
      baseURL: "https://localhost:44327",
      enableCache: false,
      headers: {
        "Content-Type": "application/json",
        "X-Module": "Business",
      },
    });
  }

  async deleteBusiness(id: string): Promise<ApiResponseType<null>> {
    const user = getCurrentUser();
    const userId = user?.userId;
    if (!userId)
      throw {
        isSuccess: false,
        message: "Kullanıcı bulunamadı",
        statusCode: 404,
        data: null,
      };
    const res = await this.delete<ApiResponseType<null>>(`/api/Business/${id}`);
    return res.data;
  }
  async createBusiness(
    business: CreateBusinessType
  ): Promise<ApiResponseType<null>> {
    const user = getCurrentUser();
    const userId = user?.userId;
    if (!userId)
      throw {
        isSuccess: false,
        message: "Kullanıcı bulunamadı",
        statusCode: 404,
        data: null,
      };
    const res = await this.post<ApiResponseType<null>>(
      `/api/Business/create`,
      business
    );
    return res.data;
  }

  async getById(id: string): Promise<ApiResponseType<BusinessResponseType>> {
    const res = await this.get<ApiResponseType<BusinessResponseType>>(
      `/api/Business/${id}`
    );
    return res.data;
  }

  async update(
    business: Partial<UpdateBusinessType> & { id: string }
  ): Promise<ApiResponseType<null>> {
    const res = await this.patch<ApiResponseType<null>>(
      `/api/Business/update`,
      business
    );
    return res.data;
  }
}

export const businessApi = new BusinessApi();
