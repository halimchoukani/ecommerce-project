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
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getCartItemsCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  addProduct(product: Product, quantity: number = 1): void {
    const existingItem = this.cartItems.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }

    this.updateCart();
  }

  removeProduct(productId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.product.id !== productId);
    this.updateCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find((item) => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeProduct(productId);
      } else {
        this.updateCart();
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  private updateCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }
}
