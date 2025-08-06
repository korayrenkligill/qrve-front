"use client";

import { ApiBase } from "./apiBase";
import { ApiResponseType } from "@/interfaces/ResponseType";
import { ProductVariantResponseType } from "@/interfaces/ProductContainer/ProductVariant/ProductVariantResponseType";
import { CreateProductVariantType } from "@/interfaces/ProductContainer/ProductVariant/CreateProductVariantType";
import { UpdateProductVarintType } from "@/interfaces/ProductContainer/ProductVariant/UpdateProductVariantType";

class ProductVariantApi extends ApiBase {
  constructor() {
    super({
      baseURL: "https://localhost:44327",
      enableCache: false,
      headers: {
        "Content-Type": "application/json",
        "X-Module": "ProductVariant",
      },
    });
  }

  async getByProductId(
    id: string
  ): Promise<ApiResponseType<ProductVariantResponseType[]>> {
    const res = await this.get<ApiResponseType<ProductVariantResponseType[]>>(
      `/api/ProductVariants/by-product-id/${id}`
    );
    return res.data;
  }

  async addProductVariant(
    productOption: CreateProductVariantType
  ): Promise<ApiResponseType<null>> {
    const res = await this.post<ApiResponseType<null>>(
      `/api/ProductVariants/add`,
      productOption
    );
    return res.data;
  }

  async updateProductVariant(
    productOption: Partial<UpdateProductVarintType> & { id: string }
  ): Promise<ApiResponseType<null>> {
    const res = await this.patch<ApiResponseType<null>>(
      `/api/ProductVariants/update`,
      productOption
    );
    return res.data;
  }

  async deleteProductVariant(id: string): Promise<ApiResponseType<null>> {
    const res = await this.delete<ApiResponseType<null>>(
      `/api/ProductVariants/delete?id=${id}`
    );
    return res.data;
  }
}

export const productVariantApi = new ProductVariantApi();
