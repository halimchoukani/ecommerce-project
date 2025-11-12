import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  total: number = 0;
  private cartSubscription?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
    this.cartSubscription = this.cartService.cart$.subscribe(() => {
      this.loadCart();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotal();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    } else {
      this.removeItem(productId);
    }
  }

  removeItem(productId: number): void {
    if (confirm('Are you sure you want to remove this item from the cart?')) {
      this.cartService.removeProduct(productId);
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.cartService.clearCart();
    }
  }

  increaseQuantity(item: CartItem): void {
    this.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    this.updateQuantity(item.product.id, item.quantity - 1);
  }

  getItemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }
}
