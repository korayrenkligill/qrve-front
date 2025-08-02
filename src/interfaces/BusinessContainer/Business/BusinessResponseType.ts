import { BusinessType } from "@/Enums/BusinessTypes";
import { CategoryResponseType } from "@/interfaces/ProductContainer/Category/CategoryResponseType";

export interface BusinessResponseType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  type: BusinessType;
  createdDate: string;
  categories: CategoryResponseType[];
}
