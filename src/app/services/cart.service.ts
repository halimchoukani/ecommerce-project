import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  constructor() {
    // Load cart from localStorage if available
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart) as any[];
        // sanitize parsed items to ensure numeric quantities and valid product shapes
        this.cartItems = Array.isArray(parsed)
          ? parsed.map((item) => {
              const quantity = Number(item?.quantity) || 1;
              const product = item?.product || ({} as Product);
              return { product, quantity } as CartItem;
            })
          : [];
        // emit a copy to avoid external mutation
        this.cartSubject.next([...this.cartItems]);
      }
    } catch (e) {
      // If parsing fails, start with empty cart
      console.warn('Failed to load cart from localStorage:', e);
      this.cartItems = [];
    }
  }

  getCartItems(): CartItem[] {
    // return a shallow copy to prevent callers from mutating internal state directly
    return [...this.cartItems];
  }

  getCartItemsCount(): number {
    return this.cartItems.reduce((count, item) => count + (Number(item.quantity) || 0), 0);
  }

  addProduct(product: Product, quantity: number = 1): void {
    if (!product) {
      return;
    }
    const qty = Math.max(1, Math.floor(Number(quantity) || 1));
    const existingItem = this.cartItems.find(
      (item) => item.product && item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity = (Number(existingItem.quantity) || 0) + qty;
    } else {
      this.cartItems.push({ product, quantity: qty });
    }

    this.updateCart();
  }

  removeProduct(productId: number): void {
    this.cartItems = this.cartItems.filter(
      (item) => !(item.product && item.product.id === productId)
    );
    this.updateCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const qty = Math.floor(Number(quantity) || 0);
    const item = this.cartItems.find((item) => item.product && item.product.id === productId);
    if (item) {
      if (qty <= 0) {
        this.removeProduct(productId);
      } else {
        item.quantity = qty;
        this.updateCart();
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      const price = Number(item?.product?.price) || 0;
      const qty = Number(item.quantity) || 0;
      return total + price * qty;
    }, 0);
  }

  private updateCart(): void {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
    // emit a copy to ensure subscribers cannot mutate internal array
    this.cartSubject.next([...this.cartItems]);
  }
}
