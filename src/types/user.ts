export type UserRole = 'farmer' | 'supplier' | 'customer';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  farm_name?: string;
  address?: string;
  company_name?: string;
  created_at?: string;
  bio?: string;
} 