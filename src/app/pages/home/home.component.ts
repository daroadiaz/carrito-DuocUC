import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productos: Product[] = [];
  loading = true;
  retryCount = 0;
  maxRetries = 3;

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private productService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getProducts().subscribe({
      next: (products) => {
        if (products && products.length > 0) {
          this.productos = products;
          this.loading = false;
        } else if (this.retryCount < this.maxRetries) {
          // Reintentar si no hay productos
          this.retryCount++;
          setTimeout(() => this.loadProducts(), 1000);
        } else {
          this.loading = false;
          this.notificationService.error('No se pudieron cargar los productos');
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          setTimeout(() => this.loadProducts(), 1000);
        } else {
          this.loading = false;
          this.notificationService.error('Error al cargar los productos');
        }
      }
    });
  }

  agregarAlCarrito(producto: Product): void {
    this.cartService.addToCart(producto);
    this.notificationService.success(`${producto.titulo} agregado al carrito`);
  }

  refreshProducts(): void {
    this.retryCount = 0;
    this.productService.refreshProducts().subscribe({
      next: (products) => {
        this.productos = products;
        this.loading = false;
        this.notificationService.success('Productos actualizados correctamente');
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Error al actualizar los productos');
      }
    });
  }
}