import { BusinessType } from "@/Enums/BusinessTypes";
import { BusinessUserType } from "@/Enums/BusinessUserTypes";

export interface UserHolderType {
  id: string;
  fullName: string;
}

export interface BusinessHolderType {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  type: BusinessType;
}

export interface BusinessUserResponseType {
  id: string;
  role: BusinessUserType;
  user: UserHolderType;
  business: BusinessHolderType;
  createdDate: string;
}
