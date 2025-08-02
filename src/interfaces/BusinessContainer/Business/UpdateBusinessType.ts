import { BusinessType } from "@/Enums/BusinessTypes";

export interface UpdateBusinessType {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  type?: BusinessType;
}
