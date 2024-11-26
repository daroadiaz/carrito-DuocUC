import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productos: Product[] = [
    {
      id: '1',
      imagen: 'assets/images/curso4.jpg',
      titulo: 'Huerto en casa',
      precio: '$200',
      cantidad: 0,
      descripcion: 'Aprende a crear y mantener tu propio huerto urbano'
    },
    {
      id: '2',
      imagen: 'assets/images/curso5.jpg',
      titulo: 'Decora tu hogar',
      precio: '$1020',
      cantidad: 0,
      descripcion: 'Técnicas profesionales de decoración de interiores'
    },
    {
      id: '3',
      imagen: 'assets/images/curso1.jpg',
      titulo: 'Diseño Web',
      precio: '$1020',
      cantidad: 0,
      descripcion: 'Domina las últimas tecnologías web'
    }
  ];

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) {}


  ngOnInit(): void {}

  agregarAlCarrito(producto: Product): void {
    this.cartService.addToCart(producto);
    this.notificationService.success(`${producto.titulo} agregado al carrito`);
  }
}