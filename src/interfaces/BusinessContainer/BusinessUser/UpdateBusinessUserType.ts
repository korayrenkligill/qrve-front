import { BusinessUserType } from "@/Enums/BusinessUserTypes";

export interface UpdateBusinessUserType {
  userId?: string;
  businessId?: string;
  role?: BusinessUserType;
}
