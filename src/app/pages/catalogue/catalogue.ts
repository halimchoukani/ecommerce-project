import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-catalogue',
  imports: [CommonModule, ProductCard],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.scss',
})
export class Catalogue implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  loading: boolean = true;
  error: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      },
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter((p) => p.category === category);
    }
  }
}
