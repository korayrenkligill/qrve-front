import { BusinessUserType } from "@/Enums/BusinessUserTypes";

export interface CreateBusinessUserType {
  userId: string;
  businessId: string;
  role: BusinessUserType;
}
