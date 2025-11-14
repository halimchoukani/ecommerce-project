import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FavoritesService } from '../../services/favorites.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss'],
})
export class Favorites implements OnInit, OnDestroy {
  favorites: Product[] = [];
  private subscription?: Subscription;

  constructor(
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.favoritesService.favorites$.subscribe((favorites) => {
      this.favorites = favorites;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  removeFromFavorites(productId: number): void {
    this.favoritesService.removeFromFavorites(productId);
  }

  addToCart(product: Product): void {
    this.cartService.addProduct(product, 1);
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  clearAllFavorites(): void {
    if (confirm('Are you sure you want to remove all favorites?')) {
      this.favoritesService.clearFavorites();
    }
  }

  continueShopping(): void {
    this.router.navigate(['/catalogue']);
  }
}
