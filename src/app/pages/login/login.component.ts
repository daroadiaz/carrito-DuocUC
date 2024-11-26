import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/']);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password);
        this.notificationService.success('¡Bienvenido de vuelta!');
        this.router.navigate(['/']);
      } catch (error) {
        this.notificationService.error('Credenciales inválidas');
        this.loginForm.get('password')?.reset();
      } finally {
        this.loading = false;
      }
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}