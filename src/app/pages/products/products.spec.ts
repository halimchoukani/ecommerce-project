import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Products } from './products';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Products],
    }).compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter products by search query', () => {
    component.allProducts = [
      {
        id: 1,
        title: 'Product 1',
        price: 10,
        category: 'electronics',
        description: 'Test',
        image: '',
        rating: { rate: 4, count: 10 },
      },
      {
        id: 2,
        title: 'Product 2',
        price: 20,
        category: 'clothing',
        description: 'Test',
        image: '',
        rating: { rate: 3, count: 5 },
      },
    ];
    component.searchQuery = 'Product 1';
    component.applyFilters();
    expect(component.displayedProducts.length).toBe(1);
  });

  it('should filter products by category', () => {
    component.allProducts = [
      {
        id: 1,
        title: 'Product 1',
        price: 10,
        category: 'electronics',
        description: 'Test',
        image: '',
        rating: { rate: 4, count: 10 },
      },
      {
        id: 2,
        title: 'Product 2',
        price: 20,
        category: 'clothing',
        description: 'Test',
        image: '',
        rating: { rate: 3, count: 5 },
      },
    ];
    component.selectedCategory = 'electronics';
    component.applyFilters();
    expect(component.displayedProducts.length).toBe(1);
  });
});
