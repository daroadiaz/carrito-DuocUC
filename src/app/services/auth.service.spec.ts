import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user.interface';
import { PLATFORM_ID } from '@angular/core';

describe('AuthService', () => {
  let service: AuthService;
  let store: { [key: string]: string } = {};
  
  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!',
    role: 'customer',
    createdAt: new Date().toISOString(),
    lastLogin: null,
    active: true
  };

  beforeEach(() => {
    store = {}; // Reset storage before each test
    
    spyOn(localStorage, 'getItem').and.callFake(key => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => store[key] = value);
    spyOn(localStorage, 'removeItem').and.callFake(key => delete store[key]);
    spyOn(localStorage, 'clear').and.callFake(() => { store = {}; });

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle login', fakeAsync(async () => {
    store['users'] = JSON.stringify([mockUser]);
    
    const result = await service.login('test@example.com', 'Password123!');
    tick();
    
    expect(result).toBeTruthy();
    expect(service.isAuthenticated).toBeTruthy();
    expect(store['currentUser']).toBeTruthy();
  }));

  
});