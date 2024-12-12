import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, tap } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = environment.apiUrl;
  private readonly STORAGE_KEY = 'products';
  private productsInitialized = false;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    const storedProducts = this.getStoredProducts();
    
    if (storedProducts.length > 0 && this.productsInitialized) {
      return of(storedProducts);
    }
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      map(products => this.transformProducts(products)),
      tap(products => {
        this.storeProducts(products);
        this.productsInitialized = true;
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        return of(storedProducts);
      })
    );
  }

  private transformProducts(products: Product[]): Product[] {
    return products.map(product => ({
      ...product,
      imagen: `${this.apiUrl}${product.imagen}`
    }));
  }

  private getStoredProducts(): Product[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private storeProducts(products: Product[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  refreshProducts(): Observable<Product[]> {
    this.productsInitialized = false;
    localStorage.removeItem(this.STORAGE_KEY);
    return this.getProducts();
  }
}