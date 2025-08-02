import { ProductContentResponseType } from "../ProductContent/ProductContentResponseType";
import { ProductLikeResponseType } from "../ProductLike/ProductLikeResponseType";
import { ProductOptionResponseType } from "../ProductOption/ProductOptionResponseType";
import { ProductVariantResponseType } from "../ProductVariant/ProductVariantResponseType";

export interface ProductResponseType {
  id: string;
  businessId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  order: number;
  createdDate: string;
  contents: ProductContentResponseType[];
  likes: ProductLikeResponseType[];
  options: ProductOptionResponseType[];
  variants: ProductVariantResponseType[];
}
