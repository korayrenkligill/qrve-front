export interface CreateProductType {
  businessId: string;
  categoryId: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isActive: boolean;
  order: number;
}
