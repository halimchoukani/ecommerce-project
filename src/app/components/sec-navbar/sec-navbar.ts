import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
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
  favoritesCount: number = 0;
  isLoggedIn: boolean = false;
  username: string = '';
  private cartSubscription?: Subscription;
  private authSubscription?: Subscription;
  private favoritesSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });

    this.authSubscription = this.authService.currentUser.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.username = user?.username || '';
    });

    this.favoritesSubscription = this.favoritesService.favorites$.subscribe((favorites) => {
      this.favoritesCount = favorites.length;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }

  logout(): void {
    this.authService.logout();
  }
}
