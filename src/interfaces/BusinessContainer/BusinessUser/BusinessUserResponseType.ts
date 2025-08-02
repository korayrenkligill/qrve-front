import { BusinessUserType } from "@/Enums/BusinessUserTypes";

interface UserHolderType {
  id: string;
  fullName: string;
}

interface BusinessHolderType {
  id: string;
  name: string;
  slug: string;
}

export interface BusinessUserResponseType {
  id: string;
  role: BusinessUserType;
  user: UserHolderType;
  business: BusinessHolderType;
  createdDate: string;
}
