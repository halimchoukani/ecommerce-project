# Authentication System Documentation

## Overview
This authentication system provides login and register functionality using local storage for user management.

## Features

### 1. **Authentication Service** (`auth.service.ts`)
- User registration with validation
- User login with credentials verification
- User logout
- Current user state management using RxJS BehaviorSubject
- Local storage for persisting users and session

### 2. **Login Component**
**Location**: `src/app/pages/auth/login/`

**Features**:
- Email and password validation
- Email format validation
- Error messages for invalid credentials
- Loading state during authentication
- Redirect to home page after successful login
- Link to register page

**Validation Rules**:
- All fields are required
- Email must be in valid format (user@example.com)

### 3. **Register Component**
**Location**: `src/app/pages/auth/register/`

**Features**:
- User registration with username, email, and password
- Password confirmation matching
- Comprehensive validation
- Error messages for validation failures
- Loading state during registration
- Automatic login after successful registration
- Link to login page

**Validation Rules**:
- All fields are required
- Username must be at least 3 characters long
- Email must be in valid format
- Password must be at least 6 characters long
- Password and confirm password must match
- Email must be unique (no duplicates)

### 4. **Auth Guard**
**Location**: `src/app/guards/auth.guard.ts`

**Purpose**: Protects routes that require authentication

**Usage**: Applied to the cart route as an example
```typescript
{ path: 'cart', component: Cart, canActivate: [authGuard] }
```

### 5. **Navigation Integration**
The `SecNavbarComponent` has been updated to:
- Display "Login" link when user is not authenticated
- Display username with logout dropdown when user is authenticated
- Show logout button on hover over username
- Subscribe to authentication state changes

## How to Use

### Register a New User
1. Navigate to `/register`
2. Fill in username (min 3 characters)
3. Enter a valid email address
4. Enter password (min 6 characters)
5. Confirm password (must match)
6. Click "Register"
7. You'll be automatically logged in and redirected to home

### Login
1. Navigate to `/login`
2. Enter your email
3. Enter your password
4. Click "Login"
5. You'll be redirected to home page

### Logout
1. Hover over your username in the navbar
2. Click "Logout" button
3. You'll be redirected to login page

## Data Storage
- Users are stored in `localStorage` under the key `users`
- Current session is stored in `localStorage` under the key `currentUser`
- Passwords are stored (note: in production, use backend authentication with hashing)

## Protected Routes
Routes protected by `authGuard`:
- `/cart` - Shopping cart page

To protect additional routes, add `canActivate: [authGuard]` to the route definition.

## Testing the System

### Test User Registration
```
Username: testuser
Email: test@example.com
Password: test123
```

### After Registration
- Check localStorage to see stored user data
- User should be automatically logged in
- Username should appear in navbar

## Future Enhancements
Consider these improvements for production:
1. Backend API integration for real authentication
2. Password hashing and security
3. JWT tokens for session management
4. Password reset functionality
5. Email verification
6. Social authentication (Google, Facebook, etc.)
7. Remember me functionality
8. Session expiration
9. User profile page
10. Account settings
