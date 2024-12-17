import { AuthService } from '../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class RegisterComponent implements OnInit {
  /**
 * Nombre de usuario ingresado por el usuario.
 */
  username: string = '';
  email: string = '';
  password: string = '';

  usernameError: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Verificar si ya hay una sesión activa
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']); // redirige a la página principal (ajustar ruta si es necesario)
      return;
    }
  }

  // Limpiar mensajes de error
  private clearErrors(): void {
    this.usernameError = '';
    this.emailError = '';
    this.passwordError = '';
  }

  // Mostrar errores
  private showError(errorField: 'usernameError' | 'emailError' | 'passwordError', message: string): void {
    this[errorField] = message;
  }

  /**
 * Valida el nombre de usuario en tiempo real.
 * Muestra un mensaje de error si es inválido.
 */
  onUsernameInput(): void {
    this.clearErrors();
    try {
      this.auth.validateUsername(this.username.trim());
      this.usernameError = '';
    } catch (error: any) {
      this.showError('usernameError', error.message);
    }
  }

  onEmailInput(): void {
    this.clearErrors();
    if (!this.auth.validateEmail(this.email.trim())) {
      this.showError('emailError', 'Email inválido');
    } else {
      this.emailError = '';
    }
  }

  onPasswordInput(): void {
    this.clearErrors();
    try {
      this.auth.validatePassword(this.password.trim());
      this.passwordError = '';
    } catch (error: any) {
      this.showError('passwordError', error.message);
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.clearErrors();

    const username = this.username.trim();
    const email = this.email.trim();
    const password = this.password.trim();

    // Validaciones básicas
    if (!username) {
      this.showError('usernameError', 'El nombre de usuario es requerido');
      return;
    }

    if (!email) {
      this.showError('emailError', 'El email es requerido');
      return;
    }

    if (!password) {
      this.showError('passwordError', 'La contraseña es requerida');
      return;
    }

    try {
      // Intentar registrar al usuario
      await this.auth.register(username, email, password);
      // Mostrar mensaje de éxito
      alert('¡Registro exitoso! Por favor, inicia sesión.');
      // Redirigir al login
      this.router.navigate(['/login']);
    } catch (error: any) {
      // Manejar errores específicos
      const message: string = error.message || 'Error desconocido';
      if (message.includes('usuario')) {
        this.showError('usernameError', message);
      } else if (message.includes('email')) {
        this.showError('emailError', message);
      } else if (message.includes('contraseña')) {
        this.showError('passwordError', message);
      } else {
        // Para otros errores, mostrar en todos los campos
        this.showError('usernameError', message);
        this.showError('emailError', message);
        this.showError('passwordError', message);
      }
    }
  }
}
