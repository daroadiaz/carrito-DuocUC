import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent {
  constructor() { }

  productos = [
    {
      id: '1',
      imagen: 'assets/img/curso1.jpg',
      titulo: 'Huerto en casa',
      precio: '$200'
    },
    {
      id: '2',
      imagen: 'assets/img/curso2.jpg',
      titulo: 'Cocina saludable',
      precio: '$150'
    },
    {
      id: '3',
      imagen: 'assets/img/curso3.jpg',
      titulo: 'Inglés básico',
      precio: '$100'
    },
    {
      id: '4',
      imagen: 'assets/img/curso4.jpg',
      titulo: 'Dibujo artístico',
      precio: '$120'
    },
    {
      id: '5',
      imagen: 'assets/img/curso5.jpg',
      titulo: 'Diseño web',
      precio: '$250'
    }
  ];

  /**
 * Agrega un producto al carrito.
 * Almacena los datos del producto en el localStorage.
 * @param producto Objeto del producto seleccionado.
 */
  agregarCurso(producto: any) {
    console.log('Agregando producto:', producto);
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    const productoConCantidad = { ...producto, cantidad: 1 };

    carrito.push(productoConCantidad);
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

}
