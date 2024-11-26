export interface Product {
  id: string;
  imagen: string;
  titulo: string;
  precio: string;
  cantidad: number;
  descripcion?: string;
  categoria?: string;
}

export interface CartItem extends Product {
  cantidad: number;
}

export interface ProductFilter {
  categoria?: string;
  precioMin?: number;
  precioMax?: number;
  busqueda?: string;
}