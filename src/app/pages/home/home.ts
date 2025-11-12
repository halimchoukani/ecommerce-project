import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../../components/product-card/product-card';
import { SliderComponent } from './slider/slider-component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ProductCard, SliderComponent],
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getLimitedProducts(8).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      },
    });
  }
}
