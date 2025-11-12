import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Catalogue } from './pages/catalogue/catalogue';
import { Cart } from './pages/cart/cart';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'catalogue', component: Catalogue },
  { path: 'cart', component: Cart },
  { path: 'products/:id', component: ProductDetail },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '' },
];
