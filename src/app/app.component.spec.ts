import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getCurrentUser',
      'logout',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        CommonModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        // Remove the mock Router provider
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if not authenticated on init', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);
    spyOn(router, 'navigate');

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should initialize UI if authenticated on init', () => {
    const mockUser = {
      id: '1',
      username: 'testUser',
      email: 'test@example.com',
      password: '123456',
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      active: true,
    };

    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue(mockUser);

    component.ngOnInit();

    expect(component.usuario).toEqual(mockUser);
  });
});
