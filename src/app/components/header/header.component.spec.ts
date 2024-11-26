import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let cartService: jasmine.SpyObj<CartService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser: of({ username: 'testUser' })
    });
    
    const cartServiceSpy = jasmine.createSpyObj('CartService', 
      ['removeFromCart', 'clearCart', 'getTotal', 'getItemCount'], {
      cart$: of([])
    });
    cartServiceSpy.getItemCount.and.returnValue(0);
    cartServiceSpy.getTotal.and.returnValue(0);
    
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, CommonModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout and navigate', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should toggle cart visibility', () => {
    expect(component.showCart).toBeFalse();
    component.toggleCart();
    expect(component.showCart).toBeTrue();
  });
});