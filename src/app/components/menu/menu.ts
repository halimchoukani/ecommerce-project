import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class MenuComponent {
  menuActive: boolean = false;
  dropdownVisible: { [key: string]: boolean } = {};
  private dropdownTimeouts: { [key: string]: any } = {};

  showDropdown = false;
  private dropdownTimeout: any;

  openDropdown(name: string) {
    clearTimeout(this.dropdownTimeouts[name]);
    this.dropdownTimeouts[name] = setTimeout(() => {
      this.dropdownVisible[name] = true;
    }, 100);
  }

  closeDropdown(name: string) {
    clearTimeout(this.dropdownTimeouts[name]);
    this.dropdownTimeouts[name] = setTimeout(() => {
      this.dropdownVisible[name] = false;
    }, 250);
  }

  toggleDropdown(name: string) {
    this.dropdownVisible[name] = !this.dropdownVisible[name];
  }
}
