import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favorites: Product[] = [];
  private favoritesSubject = new BehaviorSubject<Product[]>([]);
  public favorites$: Observable<Product[]> = this.favoritesSubject.asObservable();

  constructor() {
    // Load favorites from localStorage if available
    try {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        this.favorites = Array.isArray(parsed) ? parsed : [];
        this.favoritesSubject.next([...this.favorites]);
      }
    } catch (e) {
      console.warn('Failed to load favorites from localStorage:', e);
      this.favorites = [];
    }
  }

  getFavorites(): Product[] {
    return [...this.favorites];
  }

  getFavoritesCount(): number {
    return this.favorites.length;
  }

  isFavorite(productId: number): boolean {
    return this.favorites.some((product) => product.id === productId);
  }

  addToFavorites(product: Product): void {
    if (!product || this.isFavorite(product.id)) {
      return;
    }

    this.favorites.push(product);
    this.updateFavorites();
  }

  removeFromFavorites(productId: number): void {
    this.favorites = this.favorites.filter((product) => product.id !== productId);
    this.updateFavorites();
  }

  toggleFavorite(product: Product): boolean {
    if (this.isFavorite(product.id)) {
      this.removeFromFavorites(product.id);
      return false;
    } else {
      this.addToFavorites(product);
      return true;
    }
  }

  clearFavorites(): void {
    this.favorites = [];
    this.updateFavorites();
  }

  private updateFavorites(): void {
    try {
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage:', e);
    }
    this.favoritesSubject.next([...this.favorites]);
  }
}
