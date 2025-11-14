# E-Commerce Angular Project

A modern, enterprise-grade e-commerce application built with Angular 20+ following best practices and industry standards.

## 🚀 Features

### Core Functionality
- **Product Catalog**: Browse products from Fake Store API
- **Shopping Cart**: Add, remove, and manage cart items with local storage persistence
- **User Authentication**: Complete registration and login system with JWT support
- **Responsive Design**: Mobile-first approach with modern UI/UX

### Technical Highlights
- ✅ **Reactive Forms**: Type-safe form handling with advanced validation
- ✅ **HTTP Interceptors**: Centralized request/response handling
- ✅ **Custom Validators**: Password strength, email validation, field matching
- ✅ **Route Guards**: Protected routes with authentication checks
- ✅ **RxJS**: Reactive state management
- ✅ **TypeScript Strict Mode**: Enhanced type safety
- ✅ **Modern Angular**: Standalone components, signals-ready architecture
- ✅ **SCSS Styling**: Component-scoped styles with variables
- ✅ **Environment Configuration**: Separate dev/prod settings

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd ecommerce-project

# Install dependencies
npm install

# Start development server
npm start

# Navigate to http://localhost:4200
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── menu/
│   │   ├── product-card/
│   │   └── sec-navbar/
│   ├── pages/               # Page components
│   │   ├── home/
│   │   ├── catalogue/
│   │   ├── product-detail/
│   │   ├── cart/
│   │   └── auth/
│   │       ├── login/
│   │       └── register/
│   ├── services/            # Business logic services
│   │   ├── auth.service.ts
│   │   ├── cart.service.ts
│   │   └── product.service.ts
│   ├── guards/              # Route guards
│   │   └── auth.guard.ts
│   ├── interceptors/        # HTTP interceptors
│   │   └── http.interceptor.ts
│   ├── validators/          # Custom form validators
│   │   └── custom-validators.ts
│   ├── models/              # TypeScript interfaces
│   │   └── product.model.ts
│   ├── app.config.ts        # App configuration
│   └── app.routes.ts        # Routing configuration
├── environments/            # Environment configs
│   ├── environment.ts
│   └── environment.development.ts
└── assets/                  # Static assets

```

## 🎯 Key Features Implementation

### 1. Authentication System

**Reactive Forms with Validation**
```typescript
// Login with email validation, password requirements
// Register with username rules, password strength, confirm password matching
```

**Features:**
- Email format validation
- Password strength requirements (8+ chars, uppercase, lowercase, number)
- Username validation (3-20 alphanumeric characters)
- Real-time validation feedback
- Form-level errors for password matching

### 2. HTTP Interceptor

Automatically handles:
- Authorization headers
- Error responses (401, 403, 404, 500)
- Request/response logging
- Token management

### 3. Custom Validators

- `passwordStrength()`: Enforces strong password policy
- `matchFields()`: Ensures password confirmation matches
- `email()`: Enhanced email validation
- `username()`: Username format validation
- `noWhitespace()`: Prevents whitespace-only inputs

### 4. Cart Management

- Persistent storage using localStorage
- Observable-based state management
- Real-time cart item count
- Quantity management
- Total price calculation

### 5. Route Protection

```typescript
// Protected routes require authentication
{ path: 'cart', component: Cart, canActivate: [authGuard] }
```

## 🔧 Development Commands

```bash
# Development server
npm start

# Build for production
npm run build

# Run unit tests
npm test

# Run linting
ng lint

# Format code
npm run format
```

## 🌐 API Integration

This project uses the [Fake Store API](https://fakestoreapi.com/) for product data:

- `GET /products` - List all products
- `GET /products/:id` - Get single product
- `GET /products/categories` - List categories
- `GET /products/category/:category` - Products by category

## 🎨 Styling Architecture

- **SCSS** for enhanced CSS capabilities
- **Component-scoped styles** prevent style leakage
- **CSS Variables** for theme consistency
- **Responsive design** with flexbox and grid
- **Mobile-first approach**

## 🔐 Security Best Practices

1. **Password Hashing**: Store hashed passwords (production)
2. **JWT Tokens**: Secure authentication tokens
3. **HTTP-only Cookies**: Prevent XSS attacks (production)
4. **CORS Configuration**: Proper API security
5. **Input Sanitization**: Prevent injection attacks
6. **Route Guards**: Protect sensitive routes

## 📊 State Management

- **BehaviorSubject** for reactive state
- **Local Storage** for persistence
- **Observable patterns** for data flow
- **Immutable updates** to prevent bugs

## 🚦 Routing

```typescript
/                   # Home page
/catalogue          # Product listing
/products/:id       # Product details
/cart               # Shopping cart (protected)
/login              # User login
/register           # User registration
```

## 🎓 Best Practices Implemented

1. **Reactive Forms** over template-driven forms
2. **Standalone Components** for modern Angular
3. **Dependency Injection** for loose coupling
4. **TypeScript strict mode** for type safety
5. **Component composition** for reusability
6. **Single Responsibility Principle**
7. **DRY (Don't Repeat Yourself)**
8. **Error handling** at multiple levels
9. **Loading states** for better UX
10. **Accessibility** considerations

## 🔄 Continuous Improvement

### Planned Enhancements
- [ ] Backend integration with real API
- [ ] Payment gateway integration
- [ ] Order management system
- [ ] Product search and filtering
- [ ] Wishlist functionality
- [ ] User profile management
- [ ] Order history
- [ ] Product reviews and ratings
- [ ] Admin dashboard
- [ ] Email notifications

### Performance Optimizations
- [ ] OnPush change detection strategy
- [ ] Lazy loading modules
- [ ] Image optimization
- [ ] Bundle size reduction
- [ ] Service workers for PWA
- [ ] CDN for static assets

## 📝 Code Quality

- **Linting**: ESLint with Angular rules
- **Formatting**: Prettier configuration
- **Testing**: Jasmine + Karma
- **Type Safety**: TypeScript strict mode
- **Code Review**: PR templates and guidelines

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Fake Store API for the test data
- Community contributors

---

**Built with ❤️ using Angular**
