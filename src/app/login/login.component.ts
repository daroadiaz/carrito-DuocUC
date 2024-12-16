import { AuthService } from '../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Si el usuario ya está autenticado, redirigir a la página principal
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  // Limpiar mensajes de error
  private clearErrors(): void {
    this.emailError = '';
    this.passwordError = '';
  }

  // Mostrar error en un campo específico
  private showError(field: 'emailError' | 'passwordError', message: string): void {
    this[field] = message;
  }

  onEmailInput(): void {
    this.clearErrors();
    // Podrías agregar validación de email en tiempo real si lo deseas
    // Por ahora es opcional
  }

  onPasswordInput(): void {
    this.clearErrors();
    // Podrías agregar validación de password en tiempo real si lo deseas
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.clearErrors();

    const email = this.email.trim();
    const password = this.password.trim();

    // Validaciones básicas
    if (!email) {
      this.showError('emailError', 'El email es requerido');
      return;
    }

    if (!password) {
      this.showError('passwordError', 'La contraseña es requerida');
      return;
    }

    try {
      // Intentar iniciar sesión
      await this.auth.login(email, password);
      // Inicio de sesión exitoso
      alert('¡Inicio de sesión exitoso!');
      // Redirigir a la página principal o donde corresponda
      this.router.navigate(['/']);
    } catch (error: any) {
      // Manejar errores específicos
      const message: string = error.message || 'Error desconocido';
      if (message.includes('email')) {
        this.showError('emailError', message);
      } else if (message.includes('contraseña')) {
        this.showError('passwordError', message);
      } else {
        // Credenciales inválidas u otro error
        this.showError('emailError', 'Credenciales inválidas');
        this.showError('passwordError', 'Credenciales inválidas');
      }
    }
  }
}
