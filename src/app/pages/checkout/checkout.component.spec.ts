import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: '',
  standalone: true
})
class MockHeaderComponent {}

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let orderService: jasmine.SpyObj<OrderService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const mockCartItems = [
      { id: '1', titulo: 'Test', precio: '100', cantidad: 1, imagen: 'test.jpg' }
    ];
    
    const cartServiceSpy = jasmine.createSpyObj('CartService', 
      ['getTotal', 'clearCart', 'getItemCount'], {
      cart$: of(mockCartItems)
    });
    cartServiceSpy.getTotal.and.returnValue(100);
    cartServiceSpy.getItemCount.and.returnValue(1);
    
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['createOrder']);
    orderServiceSpy.createOrder.and.returnValue(Promise.resolve({} as any));
    
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUserValue: { email: 'test@example.com' },
      currentUser: of({ email: 'test@example.com' })
    });

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        CheckoutComponent,
        MockHeaderComponent
      ],
      providers: [
        FormBuilder,
        { provide: CartService, useValue: cartServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process valid form submission', fakeAsync(async () => {
    component.checkoutForm.setValue({
      nombre: 'Test User',
      email: 'test@example.com',
      direccion: 'Test Address',
      ciudad: 'Test City',
      telefono: '123456789'
    });

    await component.onSubmit();
    tick();
    
    expect(orderService.createOrder).toHaveBeenCalled();
    expect(cartService.clearCart).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));
});