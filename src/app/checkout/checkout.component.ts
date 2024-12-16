import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface ItemCarrito {
  id: string;
  imagen: string;
  titulo: string;
  precio: string;
  cantidad: number;
}

interface Purchase {
  nombre: string;
  email: string;
  direccion: string;
  productos: ItemCarrito[];
}

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

  compraConfirmada: boolean = false;
  cargando: boolean = false; // Indicador de carga

  private apiUrl = 'http://localhost:8000';

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.verificarAutenticacion();
    this.cargarCarrito();
  }

  private verificarAutenticacion(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.usuario = this.auth.getCurrentUser();
  }

  private cargarCarrito(): void {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]') as ItemCarrito[];
    if (carrito.length === 0) {
      console.warn("El carrito está vacío.");
      this.router.navigate(['/']);
      return;
    }
    this.articulosCarrito = carrito;
    console.log("Carrito cargado: ", this.articulosCarrito);
    this.calcularTotal();
  }

  private calcularTotal(): void {
    this.total = this.articulosCarrito.reduce(
      (sum, item) => sum + this.calcularPrecioItem(item),
      0
    );
  }

  calcularPrecioItem(item: ItemCarrito): number {
    const precioNumerico = parseFloat(item.precio.replace(/[$,]/g, ''));
    return isNaN(precioNumerico) ? 0 : precioNumerico * item.cantidad;
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.clearErrors();
    if (!this.validarFormulario()) return;

    this.cargando = true; // Iniciar indicador de carga
    await this.enviarCompra();
    this.procesarCompra();
  }

  private async enviarCompra(): Promise<void> {
    const purchase: Purchase = {
      nombre: this.nombre,
      email: this.email,
      direccion: this.direccion,
      productos: this.articulosCarrito,
    };

    try {
      const response = await this.http
        .post(`${this.apiUrl}/purchases`, purchase)
        .toPromise();
      console.log('Compra enviada exitosamente:', response);
      alert('Compra registrada en el sistema');
    } catch (error) {
      console.error('Error al registrar la compra:', error);
      alert('Ocurrió un error al registrar la compra. Intenta nuevamente.');
    } finally {
      this.cargando = false; // Detener indicador de carga
    }
  }

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

  private procesarCompra(): void {
    this.compraConfirmada = true;
    localStorage.removeItem('carrito');
    setTimeout(() => {
      alert('¡Compra exitosa! Serás redirigido al inicio.');
      this.navigateToHome();
    }, 3000);
  }

  private clearErrors(): void {
    this.nombreError = '';
    this.emailError = '';
    this.direccionError = '';
  }

  // Método público para navegar al inicio
  public navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
