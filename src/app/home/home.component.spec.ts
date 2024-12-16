import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a list of products', () => {
    expect(component.productos.length).toBe(5);
    expect(component.productos[0].titulo).toBe('Huerto en casa');
  });

  it('should add a product to the cart', () => {
    const mockProducto = {
      id: '1',
      imagen: 'assets/img/curso1.jpg',
      titulo: 'Huerto en casa',
      precio: '$200'
    };

    // Simular almacenamiento inicial vacío
    localStorage.setItem('carrito', JSON.stringify([]));

    component.agregarCurso(mockProducto);

    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    expect(carrito.length).toBe(1);
    expect(carrito[0].id).toBe(mockProducto.id);
    expect(carrito[0].cantidad).toBe(1);
  });

  it('should append products to the cart if items already exist', () => {
    const mockProducto1 = {
      id: '1',
      imagen: 'assets/img/curso1.jpg',
      titulo: 'Huerto en casa',
      precio: '$200'
    };

    const mockProducto2 = {
      id: '2',
      imagen: 'assets/img/curso2.jpg',
      titulo: 'Cocina saludable',
      precio: '$150'
    };

    // Simular almacenamiento inicial con un producto
    localStorage.setItem('carrito', JSON.stringify([mockProducto1]));

    component.agregarCurso(mockProducto2);

    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    expect(carrito.length).toBe(2);
    expect(carrito[1].id).toBe(mockProducto2.id);
  });

  it('should call console.log when adding a product', () => {
    const mockProducto = {
      id: '1',
      imagen: 'assets/img/curso1.jpg',
      titulo: 'Huerto en casa',
      precio: '$200'
    };

    spyOn(console, 'log');

    component.agregarCurso(mockProducto);

    expect(console.log).toHaveBeenCalledWith('Agregando producto:', mockProducto);
  });
});
