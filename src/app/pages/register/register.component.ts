import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z0-9_]+$')
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)
      ]]
    });
  }

  ngOnInit(): void {
    // Verificar si ya hay una sesión activa
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/']);
      return;
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) return 'Este campo es requerido';
      if (control.errors['email']) return 'Email inválido';
      if (control.errors['minlength']) {
        return `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['pattern']) {
        switch (controlName) {
          case 'username':
            return 'Solo se permiten letras, números y guiones bajos';
          case 'password':
            return 'La contraseña debe cumplir con los requisitos de seguridad';
          default:
            return 'Formato inválido';
        }
      }
    }
    return '';
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      try {
        const { username, email, password } = this.registerForm.value;
        await this.authService.register(username, email, password);
        
        // Mostrar mensaje de éxito
        alert('¡Registro exitoso! Por favor, inicia sesión.');
        
        // Redirigir al login
        this.router.navigate(['/login']);
      } catch (error) {
        // Manejar errores específicos
        if (error instanceof Error) {
          const errorMessage = error.message;
          
          if (errorMessage.includes('usuario')) {
            this.registerForm.get('username')?.setErrors({ serverError: errorMessage });
          } else if (errorMessage.includes('email')) {
            this.registerForm.get('email')?.setErrors({ serverError: errorMessage });
          } else if (errorMessage.includes('contraseña')) {
            this.registerForm.get('password')?.setErrors({ serverError: errorMessage });
          } else {
            // Para otros errores, mostrar alerta general
            alert(errorMessage);
          }
        } else {
          alert('Error en el registro. Por favor, intenta de nuevo.');
        }
      }
    } else {
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Métodos de utilidad para el template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }

  resetField(fieldName: string): void {
    const field = this.registerForm.get(fieldName);
    if (field) {
      field.setValue('');
      field.markAsUntouched();
    }
  }

  hasServerError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? !!field.errors?.['serverError'] : false;
  }

  getServerError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    return field?.errors?.['serverError'] || '';
  }
}