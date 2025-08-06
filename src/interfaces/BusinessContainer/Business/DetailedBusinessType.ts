import { BusinessType } from "@/Enums/BusinessTypes";
import { BusinessUserType } from "@/Enums/BusinessUserTypes";

export interface DetailedBusinessResponseType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  type: BusinessType;
  createdDate: string;
  role: BusinessUserType;
}
