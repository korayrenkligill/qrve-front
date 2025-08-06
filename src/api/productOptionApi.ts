"use client";

import { ApiBase } from "./apiBase";
import { ApiResponseType } from "@/interfaces/ResponseType";
import { CreateProductOptionType } from "@/interfaces/ProductContainer/ProductOption/CreateProductOptionType";
import { UpdateProductOptionType } from "@/interfaces/ProductContainer/ProductOption/UpdateProductOptionType";
import { ProductOptionResponseType } from "@/interfaces/ProductContainer/ProductOption/ProductOptionResponseType";

class ProductOptionApi extends ApiBase {
  constructor() {
    super({
      baseURL: "https://localhost:44327",
      enableCache: false,
      headers: {
        "Content-Type": "application/json",
        "X-Module": "ProductOption",
      },
    });
  }

  async getByProductId(
    id: string
  ): Promise<ApiResponseType<ProductOptionResponseType[]>> {
    const res = await this.get<ApiResponseType<ProductOptionResponseType[]>>(
      `/api/ProductOptions/by-product-id/${id}`
    );
    return res.data;
  }

  async addProductOption(
    productOption: CreateProductOptionType
  ): Promise<ApiResponseType<null>> {
    const res = await this.post<ApiResponseType<null>>(
      `/api/ProductOptions/add`,
      productOption
    );
    return res.data;
  }

  async updateProductOption(
    productOption: Partial<UpdateProductOptionType> & { id: string }
  ): Promise<ApiResponseType<null>> {
    const res = await this.patch<ApiResponseType<null>>(
      `/api/ProductOptions/update`,
      productOption
    );
    return res.data;
  }

  async deleteProductOption(id: string): Promise<ApiResponseType<null>> {
    const res = await this.delete<ApiResponseType<null>>(
      `/api/ProductOptions/delete?id=${id}`
    );
    return res.data;
  }
}

export const productOptionApi = new ProductOptionApi();
