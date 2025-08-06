"use client";

import { ProductContentResponseType } from "@/interfaces/ProductContainer/ProductContent/ProductContentResponseType";
import { ApiBase } from "./apiBase";
import { ApiResponseType } from "@/interfaces/ResponseType";
import { ProfileType } from "@/interfaces/UserContainer/User/ProfileType";
import { CreateProductContentType } from "@/interfaces/ProductContainer/ProductContent/CreateProductContentType";
import { UpdateProductContentType } from "@/interfaces/ProductContainer/ProductContent/UpdateProductContentType";

class ProductContentApi extends ApiBase {
  constructor() {
    super({
      baseURL: "https://localhost:44327",
      enableCache: false,
      headers: {
        "Content-Type": "application/json",
        "X-Module": "ProductContent",
      },
    });
  }

  async getByProductId(
    id: string
  ): Promise<ApiResponseType<ProductContentResponseType[]>> {
    const res = await this.get<ApiResponseType<ProductContentResponseType[]>>(
      `/api/ProductContent/by-product-id/${id}`
    );
    return res.data;
  }

  async addProductContent(
    productContent: CreateProductContentType
  ): Promise<ApiResponseType<null>> {
    const res = await this.post<ApiResponseType<null>>(
      `/api/ProductContent/add`,
      productContent
    );
    return res.data;
  }

  async updateProductContent(
    productContent: Partial<UpdateProductContentType> & { id: string }
  ): Promise<ApiResponseType<null>> {
    const res = await this.patch<ApiResponseType<null>>(
      `/api/ProductContent/update`,
      productContent
    );
    return res.data;
  }

  async deleteProductContent(id: string): Promise<ApiResponseType<null>> {
    const res = await this.delete<ApiResponseType<null>>(
      `/api/ProductContent/delete?id=${id}`
    );
    return res.data;
  }
}

export const productContentApi = new ProductContentApi();
