import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../interfaces/user.interface';
import { CartItem } from '../../interfaces/product.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  cartItems: CartItem[] = [];
  showCart = false;
  scrolled = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const cartElement = document.getElementById('carrito');
    const cartButton = document.getElementById('img-carrito');
    
    if (!cartElement?.contains(event.target as Node) && 
        !cartButton?.contains(event.target as Node)) {
      this.showCart = false;
    }
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(
      user => this.currentUser = user
    );

    this.cartService.cart$.subscribe(
      items => this.cartItems = items
    );
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.info('Has cerrado sesión correctamente');
    this.router.navigate(['/login']);
  }

  removeItem(id: string, event: Event): void {
    event.preventDefault();
    this.cartService.removeFromCart(id);
    this.notificationService.success('Producto eliminado del carrito');
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.notificationService.info('Carrito vaciado');
    this.showCart = false;
  }

  checkout(): void {
    if (this.cartItems.length > 0) {
      this.showCart = false;
      this.router.navigate(['/checkout']);
    }
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  getItemCount(): number {
    return this.cartService.getItemCount();
  }
}