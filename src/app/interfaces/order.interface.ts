import { CartItem } from './product.interface';

export interface OrderDetails {
  nombre: string;
  email: string;
  direccion: string;
  ciudad?: string;
  telefono?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  details: OrderDetails;
  createdAt: string;
  updatedAt?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}