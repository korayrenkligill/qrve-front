import { ProductResponseType } from "../Product/ProductResponseType";

export interface CategoryResponseType {
  id: string;
  businessId: string;
  name: string;
  order: number;
  createdDate: string;
  products: ProductResponseType[];
}
