import { Injectable } from '@angular/core';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  lastLogin: string | null;
  active: boolean;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  private currentUser: User | null = JSON.parse(localStorage.getItem('currentUser') || 'null');
  private isAdmin = false;

  constructor() { }

  public validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public validatePassword(password: string): boolean {
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/\d/.test(password)) {
      throw new Error('La contraseña debe contener al menos un número');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('La contraseña debe contener al menos una letra mayúscula');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new Error('La contraseña debe contener al menos un carácter especial');
    }
    return true;
  }

  public validateUsername(username: string): boolean {
    if (username.length < 3) {
      throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new Error('El nombre de usuario solo puede contener letras, números y guiones bajos');
    }
    return true;
  }

  register(username: string, email: string, password: string, role: string = 'customer'): User {
    if (!username || !email || !password) {
      throw new Error('Todos los campos son obligatorios');
    }

    this.validateUsername(username);

    if (!this.validateEmail(email)) {
      throw new Error('Email inválido');
    }

    if (this.users.find(user => user.email === email)) {
      throw new Error('El email ya está registrado');
    }

    if (this.users.find(user => user.username === username)) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    this.validatePassword(password);

    const user: User = {
      id: Date.now().toString(),
      username,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      active: true
    };

    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
    return user;
  }

  login(email: string, password: string): User {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    const user = this.users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.active) {
      throw new Error('Usuario desactivado. Contacte al administrador');
    }

    user.lastLogin = new Date().toISOString();
    this.currentUser = user;
    this.isAdmin = user.role === 'admin';

    localStorage.setItem('currentUser', JSON.stringify(user));
    this.updateUser(user);

    return user;
  }

  logout(): void {
    this.currentUser = null;
    this.isAdmin = false;
    localStorage.removeItem('currentUser');
  }

  public updateUser(user: User): void {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  updateProfile(userId: string, newData: Partial<User>): User {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }

    const updateData = { ...newData };

    if (updateData.password) {
      this.validatePassword(updateData.password);
    }

    if (updateData.email && updateData.email !== this.users[userIndex].email) {
      if (!this.validateEmail(updateData.email)) {
        throw new Error('Email inválido');
      }
      if (this.users.some(u => u.email === updateData.email && u.id !== userId)) {
        throw new Error('El email ya está en uso');
      }
    }

    if (updateData.username && updateData.username !== this.users[userIndex].username) {
      this.validateUsername(updateData.username);
      if (this.users.some(u => u.username === updateData.username && u.id !== userId)) {
        throw new Error('El nombre de usuario ya está en uso');
      }
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('users', JSON.stringify(this.users));

    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = this.users[userIndex];
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    return this.users[userIndex];
  }

  resetPassword(email: string): { success: boolean; message: string } {
    if (!email) {
      throw new Error('Email es requerido');
    }

    if (!this.validateEmail(email)) {
      throw new Error('Email inválido');
    }

    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('No existe una cuenta asociada a este email');
    }
    return {
      success: true,
      message: 'Se ha enviado un enlace de recuperación a tu email'
    };
  }
}
