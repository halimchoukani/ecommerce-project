import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sec-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './sec-navbar.html',
  styleUrl: './sec-navbar.scss',
})
export class SecNavbarComponent implements OnInit, OnDestroy {
  menuActive: boolean = false;
  cartItemCount: number = 0;
  private cartSubscription?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }
}
