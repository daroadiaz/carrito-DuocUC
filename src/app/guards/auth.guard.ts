import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  canActivate(): boolean {
    if (this.auth.isAuthenticated) {
      return true;
    }

    this.notification.error('Debes iniciar sesión para acceder a esta página');
    this.router.navigate(['/login']);
    return false;
  }
}