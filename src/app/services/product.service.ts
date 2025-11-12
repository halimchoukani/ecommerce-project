import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.apiUrl)
      .pipe(tap((products) => console.log('Fetched products:', products)));
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>('https://fakestoreapi.com/products/categories');
  }

  getLimitedProducts(limit: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?limit=${limit}`);
  }
}
