import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    // Mock del AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'validateUsername',
      'validateEmail',
      'validatePassword',
      'register',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        FormsModule,
        CommonModule,
        RouterTestingModule.withRoutes([]), // Correct configuration
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        // No need to provide Router; it's provided by RouterTestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); // Get the Router instance
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to home if authenticated on init', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    spyOn(router, 'navigate');

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  // Additional tests can be added here, ensuring they use the router from RouterTestingModule
});
