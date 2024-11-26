import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'carrito';
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadCart();
  }

  private loadCart(): void {
    if (this.isBrowser) {
      const savedCart = localStorage.getItem(this.STORAGE_KEY);
      if (savedCart) {
        this.cartSubject.next(JSON.parse(savedCart));
      }
    }
  }

  private saveCart(cart: CartItem[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    }
    this.cartSubject.next(cart);
  }

  addToCart(product: Product): void {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.cantidad++;
      this.saveCart([...currentCart]);
    } else {
      const newItem: CartItem = { ...product, cantidad: 1 };
      this.saveCart([...currentCart, newItem]);
    }
  }

  removeFromCart(productId: string): void {
    const updatedCart = this.cartSubject.value.filter(item => item.id !== productId);
    this.saveCart(updatedCart);
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.find(item => item.id === productId);
    
    if (item) {
      item.cantidad = quantity;
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart([...currentCart]);
      }
    }
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotal(): number {
    return this.cartSubject.value.reduce((total, item) => {
      const precio = parseFloat(item.precio.replace('$', ''));
      return total + (precio * item.cantidad);
    }, 0);
  }

  getItemCount(): number {
    return this.cartSubject.value.reduce((count, item) => count + item.cantidad, 0);
  }
}