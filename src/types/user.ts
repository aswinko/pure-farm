export type UserRole = 'farmer' | 'supplier' | 'customer';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
} 