import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss'],
})
export class ProductCard implements OnInit, OnDestroy {
  @Input() product!: Product;
  isFavorite = false;
  private subscription?: Subscription;

  constructor(private cartService: CartService, private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    if (this.product) {
      this.isFavorite = this.favoritesService.isFavorite(this.product.id);

      // Subscribe to favorites changes to keep the UI in sync
      this.subscription = this.favoritesService.favorites$.subscribe(() => {
        this.isFavorite = this.favoritesService.isFavorite(this.product.id);
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addProduct(this.product);
      alert(`${this.product.title} added to cart!`);
    }
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.product) {
      this.isFavorite = this.favoritesService.toggleFavorite(this.product);
    }
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}
