import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component')
      .then(m => m.HomeComponent),
    canActivate: [AuthGuard],
    title: 'Inicio'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component')
      .then(m => m.LoginComponent),
    title: 'Iniciar Sesión'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component')
      .then(m => m.RegisterComponent),
    title: 'Registro'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component')
      .then(m => m.CheckoutComponent),
    canActivate: [AuthGuard],
    title: 'Finalizar Compra'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

export const appConfig = {
  providers: [
    provideRouter(routes),
    AuthGuard
  ]
};

export const AppModuleImports = [
  BrowserModule,
  CommonModule,
  ReactiveFormsModule,
  RouterModule.forRoot(routes)
];



export const AppModuleProviders = [
  AuthGuard
];