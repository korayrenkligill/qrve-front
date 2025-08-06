"use client";

import { ApiBase } from "./apiBase";
import { ApiResponseType } from "@/interfaces/ResponseType";
import { CreateCategoryType } from "@/interfaces/ProductContainer/Category/CreateCategoryType";
import { CategoryResponseWithoutProductType } from "@/interfaces/ProductContainer/Category/CategoryResponseWithoutProductType";
import { UpdateCategoryType } from "@/interfaces/ProductContainer/Category/UpdateCategoryType";
class CategoryApi extends ApiBase {
  constructor() {
    super({
      baseURL: "https://localhost:44327",
      enableCache: true,
      headers: {
        "Content-Type": "application/json",
        "X-Module": "Category",
      },
    });
  }

  async deleteCategory(id: string): Promise<ApiResponseType<null>> {
    const res = await this.delete<ApiResponseType<null>>(
      `/api/Category/delete?categoryId=${id}`
    );
    return res.data;
  }
  async createCategory(
    category: CreateCategoryType
  ): Promise<ApiResponseType<null>> {
    const res = await this.post<ApiResponseType<null>>(
      `/api/Category/create`,
      category
    );
    return res.data;
  }

  async getByBusinessId(
    id: string
  ): Promise<ApiResponseType<CategoryResponseWithoutProductType[]>> {
    const res = await this.get<
      ApiResponseType<CategoryResponseWithoutProductType[]>
    >(`/api/Category/by-businessId?businessId=${id}`);
    return res.data;
  }

  async getById(
    id: string
  ): Promise<ApiResponseType<CategoryResponseWithoutProductType>> {
    const res = await this.get<
      ApiResponseType<CategoryResponseWithoutProductType>
    >(`/api/Category/${id}`);
    return res.data;
  }

  async update(
    category: Partial<UpdateCategoryType> & { id: string }
  ): Promise<ApiResponseType<null>> {
    const res = await this.patch<ApiResponseType<null>>(
      `/api/Category/update`,
      category
    );
    return res.data;
  }
}

export const categoryApi = new CategoryApi();
