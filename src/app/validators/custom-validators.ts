import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Validator for password strength
   * Requirements: At least 8 characters, 1 uppercase, 1 lowercase, 1 number
   */
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasMinLength = value.length >= 8;

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasMinLength;

      return !passwordValid
        ? {
            passwordStrength: {
              hasUpperCase,
              hasLowerCase,
              hasNumeric,
              hasMinLength,
            },
          }
        : null;
    };
  }

  /**
   * Validator to check if two fields match
   * Usage: Add to the form group, not individual controls
   */
  static matchFields(field1: string, field2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value1 = control.get(field1)?.value;
      const value2 = control.get(field2)?.value;

      if (!value1 || !value2) {
        return null;
      }

      return value1 === value2 ? null : { fieldsNotMatch: true };
    };
  }

  /**
   * Validator for email format (enhanced)
   */
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = emailRegex.test(control.value);

      return valid ? null : { invalidEmail: true };
    };
  }

  /**
   * Validator for username
   * Requirements: 3-20 characters, alphanumeric and underscores only
   */
  static username(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      const valid = usernameRegex.test(control.value);

      return valid ? null : { invalidUsername: true };
    };
  }

  /**
   * Validator for no whitespace
   */
  static noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const hasWhitespace = /\s/.test(control.value);
      return hasWhitespace ? { whitespace: true } : null;
    };
  }
}
