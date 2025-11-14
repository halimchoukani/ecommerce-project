import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit, OnDestroy {
  product: Product | null = null;
  loading: boolean = true;
  error: string = '';
  quantity: number = 1;
  isFavorite: boolean = false;
  private favoritesSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProduct(id);
      this.checkFavoriteStatus(id);
    }

    // Subscribe to favorites changes
    this.favoritesSubscription = this.favoritesService.favorites$.subscribe(() => {
      if (this.product) {
        this.isFavorite = this.favoritesService.isFavorite(this.product.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.favoritesSubscription?.unsubscribe();
  }

  checkFavoriteStatus(productId: number): void {
    this.isFavorite = this.favoritesService.isFavorite(productId);
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
        this.isFavorite = this.favoritesService.isFavorite(data.id);
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.error = 'Failed to load product. Please try again later.';
        this.loading = false;
      },
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addProduct(this.product, this.quantity);
      alert(`${this.quantity} x ${this.product.title} added to cart!`);
    }
  }

  toggleFavorite(): void {
    if (this.product) {
      this.isFavorite = this.favoritesService.toggleFavorite(this.product);
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
