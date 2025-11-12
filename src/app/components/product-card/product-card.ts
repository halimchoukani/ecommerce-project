import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss'],
})
export class ProductCard {
  @Input() product!: Product;

  constructor(private cartService: CartService) {}

  addToCart(): void {
    if (this.product) {
      this.cartService.addProduct(this.product);
      alert(`${this.product.title} added to cart!`);
    }
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}
