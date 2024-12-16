import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface ItemCarrito {
  imagen: string;
  titulo: string;
  precio: string;
  cantidad: number;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]  // Removido RouterLink ya que no se usa
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

  ngOnInit(): void {
    this.verificarAutenticacion();
    this.cargarDatos();
  }

  private verificarAutenticacion(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.usuario = this.auth.getCurrentUser();
  }

  private cargarDatos(): void {
    this.cargarCarrito();
  }

  private cargarCarrito(): void {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]') as ItemCarrito[];

    if (carrito.length === 0) {
      this.router.navigate(['/']);
      return;
    }

    this.articulosCarrito = carrito;
    this.calcularTotal();
  }

  private calcularTotal(): void {
    this.total = this.articulosCarrito.reduce((sum, item) => 
      sum + this.calcularPrecioItem(item), 0);
  }

  calcularPrecioItem(item: ItemCarrito): number {
    const precioNumerico = parseFloat(item.precio.replace(/[$,]/g, ''));
    return isNaN(precioNumerico) ? 0 : precioNumerico * item.cantidad;
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private clearErrors(): void {
    this.nombreError = '';
    this.emailError = '';
    this.direccionError = '';
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.clearErrors();

    if (!this.validarFormulario()) {
      return;
    }

    this.procesarCompra();
  }

  private validarFormulario(): boolean {
    const nombre = this.nombre.trim();
    const email = this.email.trim();
    const direccion = this.direccion.trim();

    if (!nombre) {
      this.nombreError = 'El nombre es requerido';
      return false;
    }

    if (!email) {
      this.emailError = 'El email es requerido';
      return false;
    }

    if (!direccion) {
      this.direccionError = 'La dirección es requerida';
      return false;
    }

    return true;
  }

  private procesarCompra(): void {
    setTimeout(() => {
      alert('¡Compra exitosa!');
      localStorage.removeItem('carrito');
      this.router.navigate(['/']);
    }, 1000);
  }
}