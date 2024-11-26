import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() producto!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart(): void {
    this.addToCart.emit(this.producto);
  }

  // Animación al agregar al carrito
  showAddedMessage = false;

  addToCartWithAnimation(): void {
    this.onAddToCart();
    this.showAddedMessage = true;
    setTimeout(() => {
      this.showAddedMessage = false;
    }, 2000);
  }
}