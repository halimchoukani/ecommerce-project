import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CustomValidators } from '../../../validators/custom-validators';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3), CustomValidators.username()]],
        email: ['', [Validators.required, CustomValidators.email()]],
        password: [
          '',
          [Validators.required, Validators.minLength(6), CustomValidators.passwordStrength()],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: CustomValidators.matchFields('password', 'confirmPassword'),
      }
    );
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  onRegister(): void {
    // Reset error message
    this.errorMessage = '';

    // Mark all fields as touched to show validation errors
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.get(key)?.markAsTouched();
      });
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      return;
    }

    this.isLoading = true;
    const { username, email, password } = this.registerForm.value;

    this.authService.register(username, email, password).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Cet email existe déjà. Veuillez utiliser un email différent.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
        console.error('Registration error:', error);
      },
    });
  }
}
