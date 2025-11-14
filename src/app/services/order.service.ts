import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, ShippingAddress, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$: Observable<Order[]> = this.ordersSubject.asObservable();

  // Shipping cost calculation
  private readonly SHIPPING_RATES = {
    standard: 5.99,
    express: 15.99,
    free_threshold: 100, // Free shipping over $100
  };

  // Tax rate (10%)
  private readonly TAX_RATE = 0.1;

  constructor() {
    this.loadOrders();
  }

  private loadOrders(): void {
    try {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        this.orders = JSON.parse(savedOrders);
        this.ordersSubject.next([...this.orders]);
      }
    } catch (e) {
      console.warn('Failed to load orders from localStorage:', e);
      this.orders = [];
    }
  }

  createOrder(
    userId: string,
    items: CartItem[],
    shippingAddress: ShippingAddress,
    paymentMethod: 'credit_card' | 'debit_card' | 'paypal',
    shippingType: 'standard' | 'express' = 'standard'
  ): Observable<Order> {
    return new Observable((observer) => {
      // Simulate API call delay
      setTimeout(() => {
        const subtotal = this.calculateSubtotal(items);
        const shipping = this.calculateShipping(subtotal, shippingType);
        const tax = this.calculateTax(subtotal);
        const total = subtotal + shipping + tax;

        const order: Order = {
          id: this.generateOrderId(),
          userId,
          items: [...items],
          shippingAddress,
          paymentMethod,
          subtotal,
          shipping,
          tax,
          total,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        this.orders.push(order);
        this.saveOrders();

        observer.next(order);
        observer.complete();
      }, 1500); // Simulate processing time
    });
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders.find((order) => order.id === orderId);
  }

  getUserOrders(userId: string): Order[] {
    return this.orders.filter((order) => order.userId === userId);
  }

  getAllOrders(): Order[] {
    return [...this.orders];
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order | null> {
    return new Observable((observer) => {
      const order = this.orders.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date();
        this.saveOrders();
        observer.next(order);
      } else {
        observer.next(null);
      }
      observer.complete();
    });
  }

  calculateSubtotal(items: CartItem[]): number {
    return items.reduce((total, item) => {
      const price = Number(item?.product?.price) || 0;
      const qty = Number(item.quantity) || 0;
      return total + price * qty;
    }, 0);
  }

  calculateShipping(subtotal: number, type: 'standard' | 'express' = 'standard'): number {
    // Free shipping over threshold
    if (subtotal >= this.SHIPPING_RATES.free_threshold) {
      return 0;
    }

    return type === 'express' ? this.SHIPPING_RATES.express : this.SHIPPING_RATES.standard;
  }

  calculateTax(subtotal: number): number {
    return subtotal * this.TAX_RATE;
  }

  getOrderSummary(items: CartItem[], shippingType: 'standard' | 'express' = 'standard') {
    const subtotal = this.calculateSubtotal(items);
    const shipping = this.calculateShipping(subtotal, shippingType);
    const tax = this.calculateTax(subtotal);
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  }

  private saveOrders(): void {
    try {
      localStorage.setItem('orders', JSON.stringify(this.orders));
      this.ordersSubject.next([...this.orders]);
    } catch (e) {
      console.warn('Failed to save orders to localStorage:', e);
    }
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }
}
