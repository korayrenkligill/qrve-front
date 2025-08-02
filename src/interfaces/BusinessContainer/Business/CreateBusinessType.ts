import { BusinessType } from "@/Enums/BusinessTypes";

export interface CreateBusinessType {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  type: BusinessType;
}
