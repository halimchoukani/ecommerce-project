# Favorites/Wishlist Feature Documentation

## Overview
The Favorites feature allows users to save products they're interested in for later viewing. This provides a personalized shopping experience where users can build a wishlist of products they want to purchase or track.

## Architecture

### Service Layer

#### FavoritesService (`/services/favorites.service.ts`)

**Responsibilities:**
- Manage favorites state using RxJS BehaviorSubject
- Persist favorites to localStorage
- Provide observable stream for reactive UI updates
- Handle add/remove/toggle operations

**Key Methods:**

```typescript
// Get all favorites
getFavorites(): Product[]

// Get count of favorite items
getFavoritesCount(): number

// Check if a product is favorited
isFavorite(productId: number): boolean

// Add product to favorites
addToFavorites(product: Product): void

// Remove product from favorites
removeFromFavorites(productId: number): void

// Toggle favorite status (add if not favorited, remove if favorited)
toggleFavorite(product: Product): boolean

// Clear all favorites
clearFavorites(): void
```

**Observable Stream:**
- `favorites$: Observable<Product[]>` - Emits updates when favorites change

**Persistence:**
- Uses localStorage with key: `'favorites'`
- Automatically syncs on every change

### Component Layer

#### Favorites Page (`/pages/favorites/`)

**Purpose:** Display all favorited products in a grid layout

**Features:**
- Shows empty state when no favorites
- Product grid with images, titles, prices, ratings
- Quick actions: Add to Cart, Remove from Favorites
- Clear All button to remove all favorites
- Navigate to product details on click

**Subscription Management:**
- Subscribes to `favorites$` on init
- Properly unsubscribes on destroy to prevent memory leaks

#### ProductCard Component Updates

**New Features:**
- Heart icon button in top-right corner
- Real-time favorite status indicator
- Toggle favorite on click
- Animated heart beat effect when favorited

**Integration:**
- Subscribes to favorites stream for reactivity
- Updates UI when favorites change from any source

#### ProductDetail Page Updates

**New Features:**
- "Add to Favorites" / "Remove from Favorites" button
- Dynamic button text based on favorite status
- Heart icon that fills when favorited

### UI Components

#### Navbar Integration

**Updates to SecNavbar:**
- Added favorites count badge
- Badge shows number of favorited items
- Updates in real-time as favorites change
- Link to `/favorites` route

**Badge Styling:**
- Red circular badge (#f9555c)
- Positioned absolutely on favorites icon
- Only shows when count > 0

## Routes

```typescript
{ path: 'favorites', component: Favorites }
```

No authentication guard - available to all users

## Styling

### Product Card Favorite Button
- Floating button in top-right corner
- White background with shadow
- Red color when active
- Heart beat animation on toggle
- Hover scale effect

### Favorites Page
- Responsive grid layout
- Empty state with icon and CTA
- Product cards with hover effects
- Action buttons (Add to Cart, Remove)
- Clear All button for bulk operations

### Badges
- Circular design
- White text on red background
- Small, unobtrusive positioning
- Visible only when count > 0

## Data Flow

1. **User Action:** Clicks heart icon on product card or product detail
2. **Service:** `toggleFavorite()` called with product
3. **State Update:** BehaviorSubject emits new favorites array
4. **Persistence:** localStorage updated automatically
5. **UI Update:** All subscribed components receive update
6. **Visual Feedback:** Heart icon fills/unfills, badge updates

## Reactive Updates

Components subscribe to `favorites$` observable:
- ProductCard components update when any favorite changes
- Navbar badge updates in real-time
- Favorites page grid reflects changes immediately

## LocalStorage Schema

```json
{
  "favorites": [
    {
      "id": 1,
      "title": "Product Name",
      "price": 29.99,
      "description": "Product description",
      "category": "electronics",
      "image": "https://...",
      "rating": {
        "rate": 4.5,
        "count": 120
      }
    }
  ]
}
```

## User Experience Features

### Empty State
- Friendly message when no favorites
- Large heart icon
- Call-to-action button to browse products
- Redirects to catalogue

### Product Actions
- One-click add to cart from favorites
- Quick remove from favorites
- Navigate to product detail for more info

### Visual Feedback
- Heart beat animation when toggling
- Color changes (gray → red)
- Fill animation for heart icon
- Badge count updates instantly

## Error Handling

- Try-catch blocks for localStorage operations
- Console warnings for failed operations
- Graceful degradation if localStorage unavailable
- Validation to prevent null/undefined products

## Performance Considerations

- Uses BehaviorSubject for efficient state management
- Shallow copies prevent mutation bugs
- Proper subscription cleanup prevents memory leaks
- Efficient localStorage serialization

## Future Enhancements

Potential improvements:
- [ ] Sync favorites across devices (requires backend)
- [ ] Share wishlist via link
- [ ] Add notes to favorite items
- [ ] Sort favorites by price, date added, category
- [ ] Move favorites to cart in bulk
- [ ] Email notifications for price drops on favorites
- [ ] Favorite product recommendations
- [ ] Export favorites list

## Testing Recommendations

### Unit Tests
- Service methods (add, remove, toggle, clear)
- LocalStorage persistence
- Observable emissions
- Component subscription handling

### Integration Tests
- Add to favorites from product card
- Remove from favorites page
- Badge count accuracy
- Navigation between pages

### E2E Tests
- Complete user flow: browse → favorite → view favorites → add to cart
- Multiple favorites management
- Clear all functionality
- Empty state display

## Accessibility

- ARIA labels on buttons
- Keyboard navigation support
- Screen reader friendly text
- Focus indicators
- Semantic HTML structure

## Browser Compatibility

- Modern browsers with localStorage support
- Fallback for private browsing modes
- IE11+ compatible (with polyfills)

---

**Last Updated:** November 14, 2025
