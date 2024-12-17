import { Component, OnInit } from '@angular/core';
import {Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';

interface Curso {
  imagen: string;
  titulo: string;
  precio: string;
  id: string;
  cantidad: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule]
})
export class AppComponent implements OnInit {
  title = 'carrito-DuocUC';

  articulosCarrito: Curso[] = [];
  
  // Información del usuario (se actualizará tras la autenticación)
  usuario: any = null; 

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Verificar autenticación al cargar la página
    if (!this.auth.isAuthenticated()) {
      // Si no hay sesión, redirigir a login
      this.router.navigate(['/login']);
      return;
    }

    // Si hay sesión, inicializar la UI
    this.inicializarUI();
  }

  inicializarUI(): void {
    // Obtener usuario actual
    this.usuario = this.auth.getCurrentUser();

    // Cargar carrito guardado
    const carritoGuardado = localStorage.getItem("carrito");
    this.articulosCarrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // Método para agregar un curso al carrito
  // Aquí "curso" debe provenir de la plantilla (por ejemplo, (click)="agregarCurso(curso)")
  agregarCurso(cursoData: any): void {
    const infoCurso: Curso = {
      imagen: cursoData.imagen,
      titulo: cursoData.titulo,
      precio: cursoData.precio,
      id: cursoData.id,
      cantidad: 1
    };

    const existe = this.articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
      this.articulosCarrito = this.articulosCarrito.map(curso => {
        if (curso.id === infoCurso.id) {
          return { ...curso, cantidad: curso.cantidad + 1 };
        }
        return curso;
      });
    } else {
      this.articulosCarrito = [...this.articulosCarrito, infoCurso];
    }

    this.sincronizarStorage();
  }

  // Método para eliminar un curso del carrito
  eliminarCurso(id: string): void {
    this.articulosCarrito = this.articulosCarrito.filter(curso => curso.id !== id);
    this.sincronizarStorage();
  }

  // Método para vaciar el carrito
  vaciarCarrito(): void {
    this.articulosCarrito = [];
    this.sincronizarStorage();
  }

  // Método para finalizar compra
  finalizarCompra(): void {
    if (this.articulosCarrito.length > 0) {
      this.router.navigate(['/checkout']);
    } else {
      alert('El carrito está vacío');
    }
  }

  // Sincronizar con localStorage
  private sincronizarStorage(): void {
    localStorage.setItem('carrito', JSON.stringify(this.articulosCarrito));
  }
}
