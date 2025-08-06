"use client";

import { ApiBase } from "./apiBase";
import { ApiResponseType } from "@/interfaces/ResponseType";
import { CreateProductType } from "@/interfaces/ProductContainer/Product/CreateProductType";
import { ProductResponseType } from "@/interfaces/ProductContainer/Product/ProductResponseType";
import { UpdateProductType } from "@/interfaces/ProductContainer/Product/UpdateProductType";
class ProductApi extends ApiBase {
  constructor() {
    super({
      baseURL: "https://localhost:44327",
      enableCache: false,
      headers: {
        "Content-Type": "application/json",
        "X-Module": "Product",
      },
    });
  }

  async deleteProduct(id: string): Promise<ApiResponseType<null>> {
    const res = await this.delete<ApiResponseType<null>>(
      `/api/Product/delete?productId=${id}`
    );
    return res.data;
  }
  async createProduct(
    product: CreateProductType
  ): Promise<ApiResponseType<null>> {
    const res = await this.post<ApiResponseType<null>>(
      `/api/Product/create`,
      product
    );
    return res.data;
  }

  async getById(id: string): Promise<ApiResponseType<ProductResponseType>> {
    const res = await this.get<ApiResponseType<ProductResponseType>>(
      `/api/Product/${id}`
    );
    return res.data;
  }

  async getByBusinessId(
    id: string
  ): Promise<ApiResponseType<ProductResponseType[]>> {
    const res = await this.get<ApiResponseType<ProductResponseType[]>>(
      `/api/Product/by-businessId?businessId=${id}`
    );
    return res.data;
  }

  async update(
    product: Partial<UpdateProductType> & { id: string }
  ): Promise<ApiResponseType<null>> {
    const res = await this.patch<ApiResponseType<null>>(
      `/api/Product/update`,
      product
    );
    return res.data;
  }

  async changeIsActive(
    id: string,
    status: boolean
  ): Promise<ApiResponseType<null>> {
    const res = await this.patch<ApiResponseType<null>>(
      `/api/Product/change-is-active?id=${id}&status=${status}`
    );
    return res.data;
  }
}

export const productApi = new ProductApi();
