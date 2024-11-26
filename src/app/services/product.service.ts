import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, ProductFilter } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: '1',
      imagen: 'assets/images/curso4.jpg',
      titulo: 'Huerto en casa',
      precio: '$200',
      cantidad: 0,
      descripcion: 'Aprende a crear y mantener tu propio huerto en casa',
      categoria: 'hogar'
    },
    // Agregar más productos aquí
  ];

  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  products$ = this.productsSubject.asObservable();

  getProducts(filter?: ProductFilter): Observable<Product[]> {
    return new Observable(subscriber => {
      let filteredProducts = [...this.products];

      if (filter) {
        if (filter.categoria) {
          filteredProducts = filteredProducts.filter(p => p.categoria === filter.categoria);
        }

        if (filter.precioMin !== undefined) {
          filteredProducts = filteredProducts.filter(p => 
            parseFloat(p.precio.replace('$', '')) >= filter.precioMin!
          );
        }

        if (filter.precioMax !== undefined) {
          filteredProducts = filteredProducts.filter(p => 
            parseFloat(p.precio.replace('$', '')) <= filter.precioMax!
          );
        }

        if (filter.busqueda) {
          const search = filter.busqueda.toLowerCase();
          filteredProducts = filteredProducts.filter(p => 
            p.titulo.toLowerCase().includes(search) || 
            p.descripcion?.toLowerCase().includes(search)
          );
        }
      }

      subscriber.next(filteredProducts);
      subscriber.complete();
    });
  }

  getProductById(id: string): Product | null {
    return this.products.find(p => p.id === id) || null;
  }

  getCategorias(): string[] {
    return [...new Set(this.products.map(p => p.categoria!))];
  }
}