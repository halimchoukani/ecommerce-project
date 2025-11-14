import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCard, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
})
export class Products implements OnInit, OnDestroy {
  // All products from API
  allProducts: Product[] = [];

  // Filtered and sorted products to display
  displayedProducts: Product[] = [];

  // Categories
  categories: string[] = [];

  // Filter states
  selectedCategory: string = 'all';
  searchQuery: string = '';
  minPrice: number = 0;
  maxPrice: number = 1000;
  minRating: number = 0;

  // Sort options
  sortBy: string = 'default';

  // UI states
  loading: boolean = true;
  error: string = '';
  showFilters: boolean = false;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;

  // Subscriptions
  private subscription?: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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
    this.error = '';

    this.subscription = this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.allProducts];

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    filtered = filtered.filter((p) => p.price >= this.minPrice && p.price <= this.maxPrice);

    // Filter by rating
    if (this.minRating > 0) {
      filtered = filtered.filter((p) => p.rating.rate >= this.minRating);
    }

    // Apply sorting
    filtered = this.sortProducts(filtered);

    // Update pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedProducts = filtered.slice(startIndex, endIndex);
  }

  sortProducts(products: Product[]): Product[] {
    const sorted = [...products];

    switch (this.sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'rating-desc':
        return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
      case 'rating-asc':
        return sorted.sort((a, b) => a.rating.rate - b.rating.rate);
      default:
        return sorted;
    }
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  onPriceRangeChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onRatingChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.minRating = 0;
    this.sortBy = 'default';
    this.currentPage = 1;
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPaginationRange(): number[] {
    const range: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }

  get filteredCount(): number {
    let count = this.allProducts.length;

    if (this.selectedCategory !== 'all') {
      count = this.allProducts.filter((p) => p.category === this.selectedCategory).length;
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      count = this.allProducts.filter(
        (p) =>
          (this.selectedCategory === 'all' || p.category === this.selectedCategory) &&
          (p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query))
      ).length;
    }

    return count;
  }

  get hasActiveFilters(): boolean {
    return (
      this.selectedCategory !== 'all' ||
      this.searchQuery.trim() !== '' ||
      this.minPrice > 0 ||
      this.maxPrice < 1000 ||
      this.minRating > 0
    );
  }
}
