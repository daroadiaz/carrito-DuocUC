import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/**
 * Interfaz para representar un artículo del carrito.
 */
interface ItemCarrito {
  imagen: string;
  titulo: string;
  precio: string;
  cantidad: number;
}

/**
 * Componente de Checkout.
 * Permite a los usuarios revisar y confirmar su compra.
 */
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CheckoutComponent implements OnInit {
  usuario: any = null;
  articulosCarrito: ItemCarrito[] = [];
  total: number = 0;

  nombre: string = '';
  email: string = '';
  direccion: string = '';

  nombreError: string = '';
  emailError: string = '';
  direccionError: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  /**
   * Inicializa el componente y verifica la autenticación.
   */
  ngOnInit(): void {
    this.verificarAutenticacion();
    this.cargarCarrito();
  }

  /**
   * Verifica si el usuario está autenticado.
   */
  private verificarAutenticacion(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.usuario = this.auth.getCurrentUser();
  }

  /**
   * Carga los datos del carrito desde localStorage.
   */
  private cargarCarrito(): void {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]') as ItemCarrito[];
    if (carrito.length === 0) {
      this.router.navigate(['/']);
      return;
    }
    this.articulosCarrito = carrito;
    this.calcularTotal();
  }

  /**
   * Calcula el total de la compra.
   */
  private calcularTotal(): void {
    this.total = this.articulosCarrito.reduce(
      (sum, item) => sum + this.calcularPrecioItem(item),
      0
    );
  }

  /**
   * Calcula el precio total de un artículo.
   * @param item Artículo del carrito.
   * @returns Precio total.
   */
  calcularPrecioItem(item: ItemCarrito): number {
    const precioNumerico = parseFloat(item.precio.replace(/[$,]/g, ''));
    return isNaN(precioNumerico) ? 0 : precioNumerico * item.cantidad;
  }

  /**
   * Maneja el evento de envío del formulario de checkout.
   * @param event Evento del formulario.
   */
  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.clearErrors();
    if (!this.validarFormulario()) return;

    this.procesarCompra();
  }

  /**
   * Valida el formulario de checkout.
   * @returns True si el formulario es válido.
   */
  private validarFormulario(): boolean {
    if (!this.nombre.trim()) {
      this.nombreError = 'El nombre es requerido';
      return false;
    }
    if (!this.email.trim()) {
      this.emailError = 'El email es requerido';
      return false;
    }
    if (!this.direccion.trim()) {
      this.direccionError = 'La dirección es requerida';
      return false;
    }
    return true;
  }

  /**
   * Procesa la compra y vacía el carrito.
   */
  private procesarCompra(): void {
    setTimeout(() => {
      alert('¡Compra exitosa!');
      localStorage.removeItem('carrito');
      this.router.navigate(['/']);
    }, 1000);
  }

  /**
   * Limpia los mensajes de error del formulario.
   */
  private clearErrors(): void {
    this.nombreError = '';
    this.emailError = '';
    this.direccionError = '';
  }
}
