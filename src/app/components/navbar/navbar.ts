import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu';
import { SecNavbarComponent } from '../sec-navbar/sec-navbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SecNavbarComponent, MenuComponent, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  menuActive: boolean = false;

  // Toggle mobile menu
  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }
}
