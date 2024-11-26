import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    let savedUser = null;
    
    if (this.isBrowser) {
      savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    
    this.currentUserSubject = new BehaviorSubject<User | null>(savedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getLocalStorage(key: string): any {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorage(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  private removeLocalStorage(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    if (password.length < 8) return false;
    if (!/\d/.test(password)) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[!@#$%^&*]/.test(password)) return false;
    return true;
  }

  validateUsername(username: string): boolean {
    if (username.length < 3) return false;
    return /^[a-zA-Z0-9_]+$/.test(username);
  }

  register(username: string, email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!username || !email || !password) {
        reject('Todos los campos son obligatorios');
        return;
      }

      const users: User[] = JSON.parse(this.getLocalStorage('users') || '[]');
      
      if (users.find(u => u.email === email)) {
        reject('El email ya está registrado');
        return;
      }

      const user: User = {
        id: Date.now().toString(),
        username,
        email,
        password,
        role: 'customer',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        active: true
      };

      users.push(user);
      this.setLocalStorage('users', JSON.stringify(users));
      resolve(user);
    });
  }

  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const users: User[] = JSON.parse(this.getLocalStorage('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);

      if (user && user.active) {
        user.lastLogin = new Date().toISOString();
        this.setLocalStorage('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        resolve(user);
      } else {
        reject('Credenciales inválidas');
      }
    });
  }

  logout(): void {
    this.removeLocalStorage('currentUser');
    this.currentUserSubject.next(null);
  }
}