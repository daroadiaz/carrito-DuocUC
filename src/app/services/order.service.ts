import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, OrderDetails } from '../interfaces/order.interface';
import { CartItem } from '../interfaces/product.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor(private authService: AuthService) {
    this.loadOrders();
  }

  private loadOrders(): void {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      this.ordersSubject.next(JSON.parse(savedOrders));
    }
  }

  private saveOrders(orders: Order[]): void {
    localStorage.setItem('orders', JSON.stringify(orders));
    this.ordersSubject.next(orders);
  }

  createOrder(items: CartItem[], total: number, details: OrderDetails): Promise<Order> {
    return new Promise((resolve, reject) => {
      const currentUser = this.authService.currentUserValue;
      if (!currentUser) {
        reject(new Error('Usuario no autenticado'));
        return;
      }

      const order: Order = {
        id: Date.now().toString(),
        userId: currentUser.id,
        items,
        total,
        details,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),  // Inicializamos también updatedAt
        status: 'pending'
      };

      const currentOrders = this.ordersSubject.value;
      this.saveOrders([...currentOrders, order]);
      resolve(order);
    });
  }

  getUserOrders(userId: string): Observable<Order[]> {
    return new Observable(subscriber => {
      const orders = this.ordersSubject.value.filter(order => order.userId === userId);
      subscriber.next(orders);
      subscriber.complete();
    });
  }

  getOrderById(orderId: string): Order | null {
    return this.ordersSubject.value.find(order => order.id === orderId) || null;
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.ordersSubject.value;
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
      orders[orderIndex] = {
        ...orders[orderIndex],
        status,
        updatedAt: new Date().toISOString()
      };
      this.saveOrders(orders);
    }
  }
}