export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  createdAt: string;
  lastLogin: string | null;
  active: boolean;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}