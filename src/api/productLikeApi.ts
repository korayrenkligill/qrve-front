"use client";

import { ApiBase } from "./apiBase";
import { ApiResponseType } from "@/interfaces/ResponseType";
import { ProductVariantResponseType } from "@/interfaces/ProductContainer/ProductVariant/ProductVariantResponseType";
import { CreateProductVariantType } from "@/interfaces/ProductContainer/ProductVariant/CreateProductVariantType";
import { UpdateProductVarintType } from "@/interfaces/ProductContainer/ProductVariant/UpdateProductVariantType";
import { ProductLikeCompactType } from "@/interfaces/ProductContainer/ProductLike/ProductLikeCompactDto";

class ProductLikeApi extends ApiBase {
  constructor() {
    super({
      baseURL: "https://localhost:44327",
      enableCache: false,
      headers: {
        "Content-Type": "application/json",
        "X-Module": "ProductLike",
      },
    });
  }

  async getByBusinessId(
    id: string
  ): Promise<ApiResponseType<ProductLikeCompactType[]>> {
    const res = await this.get<ApiResponseType<ProductLikeCompactType[]>>(
      `/api/ProductLikes/by-businessId?businessId=${id}`
    );
    return res.data;
  }
}

export const productLikeApi = new ProductLikeApi();
