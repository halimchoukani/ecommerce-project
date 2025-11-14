import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/product.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit, OnDestroy {
  currentUser: User | null = null;
  userOrders: Order[] = [];
  activeTab: 'orders' | 'profile' = 'orders';
  editMode = false;
  profileForm!: FormGroup;
  private destroy$ = new Subject<void>();

  // UI states
  isUpdating = false;
  updateSuccess = false;
  updateError = '';
  selectedOrder: Order | null = null;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initializeProfileForm();
  }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.loadUserOrders(user.id);
        this.populateProfileForm(user);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeProfileForm(): void {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
    });
  }

  private populateProfileForm(user: User): void {
    this.profileForm.patchValue({
      username: user.username,
      email: user.email,
    });
  }

  private loadUserOrders(userId: string): void {
    this.userOrders = this.orderService.getUserOrders(userId).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  switchTab(tab: 'orders' | 'profile'): void {
    this.activeTab = tab;
    this.updateSuccess = false;
    this.updateError = '';
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // Reset form to current user data
      if (this.currentUser) {
        this.populateProfileForm(this.currentUser);
      }
      this.profileForm.patchValue({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      this.updateSuccess = false;
      this.updateError = '';
    }
  }

  updateProfile(): void {
    if (this.profileForm.invalid || !this.currentUser) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    const formValue = this.profileForm.value;

    // Validate password change if attempted
    if (formValue.newPassword) {
      if (!formValue.currentPassword) {
        this.updateError = 'Le mot de passe actuel est requis pour changer le mot de passe';
        return;
      }
      if (formValue.newPassword !== formValue.confirmPassword) {
        this.updateError = 'Les nouveaux mots de passe ne correspondent pas';
        return;
      }
    }

    this.isUpdating = true;
    this.updateError = '';
    this.updateSuccess = false;

    // Simulate API call
    setTimeout(() => {
      try {
        const users = this.getStoredUsers();
        const userIndex = users.findIndex((u: any) => u.id === this.currentUser!.id);

        if (userIndex === -1) {
          this.updateError = 'Utilisateur non trouvé';
          this.isUpdating = false;
          return;
        }

        const user = users[userIndex];

        // Verify current password if changing password
        if (formValue.newPassword && user.password !== formValue.currentPassword) {
          this.updateError = 'Le mot de passe actuel est incorrect';
          this.isUpdating = false;
          return;
        }

        // Check if email is already taken by another user
        if (formValue.email !== user.email) {
          const emailExists = users.some(
            (u: any) => u.email === formValue.email && u.id !== this.currentUser!.id
          );
          if (emailExists) {
            this.updateError = 'Cet email est déjà utilisé';
            this.isUpdating = false;
            return;
          }
        }

        // Update user data
        users[userIndex] = {
          ...user,
          username: formValue.username,
          email: formValue.email,
          password: formValue.newPassword || user.password,
        };

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Update current user
        const updatedUser: User = {
          id: this.currentUser!.id,
          username: formValue.username,
          email: formValue.email,
        };

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUser = updatedUser;

        this.updateSuccess = true;
        this.editMode = false;
        this.profileForm.patchValue({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (error) {
        this.updateError = 'Failed to update profile';
      } finally {
        this.isUpdating = false;
      }
    }, 500);
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  getOrderStatusClass(status: Order['status']): string {
    const statusClasses: Record<Order['status'], string> = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
    };
    return statusClasses[status] || '';
  }

  getOrderStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'En attente',
      processing: 'En cours',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé',
    };
    return statusMap[status] || status;
  }

  logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  private getStoredUsers(): any[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helper method to check if field has error
  hasError(field: string, error: string): boolean {
    const control = this.profileForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  // Format date helper
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Calculate total items in order
  getTotalItems(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }
}
