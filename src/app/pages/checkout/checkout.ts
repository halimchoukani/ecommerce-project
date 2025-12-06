import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartItem, ShippingAddress, Order } from '../../models/product.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss'],
})
export class Checkout implements OnInit, OnDestroy {
  // Forms
  shippingForm!: FormGroup;
  paymentForm!: FormGroup;

  // Cart data
  cartItems: CartItem[] = [];

  // Order summary
  subtotal: number = 0;
  shipping: number = 0;
  tax: number = 0;
  total: number = 0;

  // UI states
  currentStep: 'shipping' | 'payment' | 'review' = 'shipping';
  shippingType: 'standard' | 'express' = 'standard';
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' = 'credit_card';
  processing: boolean = false;
  orderComplete: boolean = false;
  completedOrder?: Order;
  error: string = '';

  // Subscriptions
  private cartSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    // Load cart items
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      if (this.cartItems.length === 0 && !this.orderComplete) {
        this.router.navigate(['/cart']);
      }
      this.updateOrderSummary();
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  private initializeForms(): void {
    // Shipping form
    this.shippingForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      addressLine1: ['', [Validators.required, Validators.minLength(5)]],
      addressLine2: [''],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      country: ['Tunisie', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
    });

    // Payment form
    this.paymentForm = this.fb.group({
      cardholderName: ['', [Validators.required, Validators.minLength(3)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryMonth: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      expiryYear: ['', [Validators.required, Validators.min(2025)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    });
  }

  updateOrderSummary(): void {
    const summary = this.orderService.getOrderSummary(this.cartItems, this.shippingType);
    this.subtotal = summary.subtotal;
    this.shipping = summary.shipping;
    this.tax = summary.tax;
    this.total = summary.total;
  }

  onShippingTypeChange(type: 'standard' | 'express'): void {
    this.shippingType = type;
    this.updateOrderSummary();
  }

  onPaymentMethodChange(method: 'credit_card' | 'debit_card' | 'paypal'): void {
    this.paymentMethod = method;
  }

  goToStep(step: 'shipping' | 'payment' | 'review'): void {
    if (step === 'payment' && !this.shippingForm.valid) {
      this.markFormGroupTouched(this.shippingForm);
      return;
    }
    if (step === 'review' && (!this.shippingForm.valid || !this.isPaymentValid())) {
      return;
    }
    this.currentStep = step;
  }

  private isPaymentValid(): boolean {
    if (this.paymentMethod === 'paypal') {
      return true; // PayPal doesn't need card details
    }
    return this.paymentForm.valid;
  }

  submitOrder(): void {
    // Validate all forms
    if (!this.shippingForm.valid) {
      this.markFormGroupTouched(this.shippingForm);
      this.currentStep = 'shipping';
      return;
    }

    if (!this.isPaymentValid()) {
      this.markFormGroupTouched(this.paymentForm);
      this.currentStep = 'payment';
      return;
    }

    const user = this.authService.currentUserValue;
    if (!user) {
      this.error = 'Veuillez vous connecter pour finaliser votre commande';
      return;
    }

    this.processing = true;
    this.error = '';

    const shippingAddress: ShippingAddress = this.shippingForm.value;

    this.orderService
      .createOrder(user.id, this.cartItems, shippingAddress, this.paymentMethod, this.shippingType)
      .subscribe({
        next: (order) => {
          this.completedOrder = order;
          this.orderComplete = true;
          this.processing = false;
          // Clear the cart
          this.cartService.clearCart();
        },
        error: (err) => {
          console.error('Order creation failed:', err);
          this.error = 'Échec du traitement de votre commande. Veuillez réessayer.';
          this.processing = false;
        },
      });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  viewOrders(): void {
    this.router.navigate(['/orders']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Form field getters for validation
  get shippingControls() {
    return this.shippingForm.controls;
  }

  get paymentControls() {
    return this.paymentForm.controls;
  }

  // Helper methods for templates
  formatCardNumber(cardNumber: string): string {
    return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }
}
