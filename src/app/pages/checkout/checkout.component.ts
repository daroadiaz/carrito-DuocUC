import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { CartItem } from '../../interfaces/product.interface';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  total: number = 0;
  processing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });

    if (this.cartItems.length === 0) {
      this.router.navigate(['/']);
      return;
    }

    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.checkoutForm.patchValue({
        email: currentUser.email
      });
    }
  }

  calcularSubtotal(item: CartItem): number {
    return parseFloat(item.precio.replace('$', '')) * item.cantidad;
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.checkoutForm.get(field);
    return formControl ? (formControl.invalid && formControl.touched) : false;
  }

  getErrorMessage(field: string): string {
    const control = this.checkoutForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) return 'Este campo es requerido';
      if (control.errors['email']) return 'Email inválido';
      if (control.errors['pattern']) return 'Formato inválido';
    }
    return '';
  }

  async onSubmit(): Promise<void> {
    if (this.checkoutForm.valid && this.cartItems.length > 0 && !this.processing) {
      this.processing = true;
      try {
        const orderDetails = {
          ...this.checkoutForm.value,
          items: this.cartItems,
          total: this.total,
          fecha: new Date().toISOString()
        };

        await this.orderService.createOrder(this.cartItems, this.total, this.checkoutForm.value);
        this.cartService.clearCart();
        alert('¡Compra realizada con éxito!');
        this.router.navigate(['/']);
      } catch (error) {
        alert('Error al procesar la compra');
      } finally {
        this.processing = false;
      }
    }
  }
}