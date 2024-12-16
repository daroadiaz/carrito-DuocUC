import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * Interfaz para representar un producto.
 */
interface Producto {
  id: string;
  imagen: string;
  titulo: string;
  precio: string;
  cantidad: number;
}

/**
 * Componente principal de la página de inicio.
 * Muestra los productos obtenidos de la API y permite agregar productos al carrito.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class HomeComponent implements OnInit {
  /** Lista de productos a mostrar en la página. */
  productos: Producto[] = [];
  /** URL base de la API. */
  private apiBaseUrl = 'http://localhost:8000';
  /** Número máximo de intentos para cargar productos. */
  private maxRetries = 3;
  /** Estado para indicar si los productos están cargando. */
  cargando: boolean = true;
  /** Estado para indicar si ocurrió un error durante la carga. */
  errorCargando: boolean = false;

  constructor(private http: HttpClient) {}

  /**
   * Inicializa el componente y carga los productos desde la API o localStorage.
   */
  ngOnInit(): void {
    // Intentar cargar productos desde localStorage.
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      this.productos = JSON.parse(productosGuardados);
      console.log('Productos cargados desde localStorage:', this.productos);
      this.cargando = false;
    } else {
      this.cargarProductos();
    }
  }

  /**
   * Realiza una solicitud HTTP para obtener los productos desde la API.
   * Implementa reintentos automáticos y guarda los datos en localStorage.
   */
  private cargarProductos(): void {
    this.http
      .get<Producto[]>(`${this.apiBaseUrl}/products`)
      .pipe(
        retry(this.maxRetries), // Reintenta hasta 3 veces en caso de error.
        catchError((error) => {
          console.error('Error al cargar productos después de reintentos:', error);
          this.errorCargando = true; // Activa bandera de error.
          return of([]); // Devuelve un array vacío como fallback.
        })
      )
      .subscribe({
        next: (data) => {
          if (data.length > 0) {
            this.productos = data.map((producto) => ({
              ...producto,
              imagen: `${this.apiBaseUrl}${producto.imagen}`,
              cantidad: producto.cantidad || 0,
            }));
            console.log('Productos cargados desde la API:', this.productos);

            // Guarda los productos en localStorage.
            localStorage.setItem('productos', JSON.stringify(this.productos));
          } else {
            console.warn('No se encontraron productos en la respuesta.');
          }
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error final al cargar productos:', error);
          this.cargando = false;
        },
      });
  }

  /**
   * Agrega un producto al carrito.
   * Si el producto ya está en el carrito, incrementa su cantidad.
   * @param producto Producto a agregar.
   */
  agregarCurso(producto: Producto): void {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const productoExistente = carrito.find((item: Producto) => item.id === producto.id);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Producto agregado al carrito:', producto);
  }
}
