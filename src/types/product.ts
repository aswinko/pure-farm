export interface Product {
  id?: string;
  name: string;
  price: number;
  image?: string;
  category_id: string;
  category_name?: string;
  description?: string;
  quantity?: number;
  user_id?: string;
  features?: string[];  
  unit?: string;
  rating?: number | undefined;
  product_id?: string;
} 