# Iconography Guidelines

This document provides the essential iconography system for the Tech Luxe Minimal e-commerce website. Our icon system prioritizes clarity, consistency, and premium aesthetic appeal.

## Design Principles

### Visual Style
- **Minimalist**: Clean, simplified forms without unnecessary detail
- **Consistent**: Uniform stroke width and corner radius across all icons
- **Scalable**: Designed to work at any size from 16px to 64px
- **Accessible**: Clear contrast and recognizable shapes

### Technical Specifications
- **Format**: SVG for scalability and optimization
- **Stroke Width**: 1.5px for optimal clarity
- **Corner Radius**: 2px for rounded corners where applicable
- **Grid**: 24x24px base grid with 2px padding
- **Color**: Single color with semantic meaning

## Icon Colors

### Light Mode
- **Primary**: `#1F1F1F` (Carbon 800) - Default icon color
- **Secondary**: `#4A4A4A` (Carbon 600) - Secondary actions
- **Muted**: `#8B8B8B` (Carbon 400) - Disabled or inactive states
- **Interactive**: `#5B47FB` (Electric Indigo 600) - Active/selected states
- **Accent**: `#5B47FB` (Electric Indigo 600) - Call-to-action icons

### Dark Mode
- **Primary**: `#FFFFFF` (Porcelain 50) - Default icon color
- **Secondary**: `#DEE2E6` (Porcelain 300) - Secondary actions
- **Muted**: `#ADB5BD` (Porcelain 500) - Disabled or inactive states
- **Interactive**: `#9B8CFF` (Electric Indigo 400) - Active/selected states
- **Accent**: `#9B8CFF` (Electric Indigo 400) - Call-to-action icons

## Essential Icon Set

### 1. User Icon
**Usage**: Profile access, account management, authentication states

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**Variations**:
- User-plus: For registration/add user functionality
- User-check: For verified/authenticated states
- User-x: For logout or denied access

### 2. Shopping Cart Icon
**Usage**: Cart access, add to cart actions, checkout flow

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.3 5.1 16.3H17M17 13V17C17 17.5304 17.2107 18.0391 17.5858 18.4142C17.9609 18.7893 18.4696 19 19 19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17C21 16.4696 20.7893 15.9609 20.4142 15.5858C20.0391 15.2107 19.5304 15 19 15C18.4696 15 17.9609 15.2107 17.5858 15.5858C17.2107 15.9609 17 16.4696 17 17Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="9" cy="20" r="1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="20" cy="20" r="1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**Badge Indicator**: 
When showing cart quantity, use a small circular badge positioned at the top-right:
```svg
<circle cx="18" cy="6" r="4" fill="#5B47FB"/>
<text x="18" y="8" text-anchor="middle" fill="white" font-size="8" font-weight="600">3</text>
```

### 3. Search Icon
**Usage**: Search functionality, filter discovery, product lookup

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**States**:
- Default: Outlined circle and magnifying glass
- Active: Slightly bolder stroke when focused
- Loading: Can be paired with a subtle rotation animation

### 4. Chevron Down Icon
**Usage**: Dropdown menus, collapsible content, navigation expansion

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**Directional Variations**:
- Chevron Up: Rotate 180° for collapse states
- Chevron Left: Rotate 90° for backward navigation
- Chevron Right: Rotate -90° for forward navigation

### 5. Close Icon
**Usage**: Modal dismissal, notification removal, cancellation actions

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**Context Variations**:
- Small Close (16px): For tags and chips
- Large Close (32px): For modal overlays
- Subtle Close: Using muted color for less critical dismissals

## Usage Guidelines

### Size Standards
- **Small**: 16px - For inline text, compact UI elements
- **Medium**: 20px - For buttons, form elements
- **Default**: 24px - Standard interface icons
- **Large**: 32px - For prominent actions, hero sections
- **XL**: 48px - For empty states, illustrations

### Accessibility Requirements
1. **Alt Text**: Always provide meaningful alternative text
2. **Color Independence**: Icons must be recognizable without color
3. **Touch Targets**: Minimum 44px touch target for interactive icons
4. **Focus States**: Clear focus indicators for keyboard navigation

### Animation Guidelines
- **Subtle**: Use micro-animations sparingly (0.15s duration)
- **Purposeful**: Animations should provide feedback or indicate state changes
- **Respectful**: Honor `prefers-reduced-motion` settings
- **Easing**: Use `ease-out` transitions for natural feel

### Implementation Examples

#### React Component
```jsx
import { User, ShoppingCart, Search, ChevronDown, X } from './icons';

const IconButton = ({ icon: Icon, label, onClick, size = 24, color = "currentColor" }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors"
  >
    <Icon size={size} color={color} />
  </button>
);
```

#### CSS Custom Properties
```css
.icon {
  width: var(--icon-size, 24px);
  height: var(--icon-size, 24px);
  stroke: var(--icon-color, currentColor);
  stroke-width: var(--icon-stroke-width, 1.5);
  transition: all 0.15s ease-out;
}

.icon--interactive:hover {
  stroke: var(--color-electric-indigo-600);
  transform: scale(1.05);
}
```

### Semantic Usage

#### Navigation Icons
- **User**: Profile, account, authentication
- **Search**: Discovery, filtering, product lookup
- **ChevronDown**: Menu expansion, sorting options

#### Commerce Icons
- **ShoppingCart**: Add to cart, cart access, checkout
- **Close**: Remove items, dismiss notifications

#### State Indicators
- **ChevronDown**: Expanded/collapsed content
- **Close**: Cancellable actions, modal dismissal

## Icon Library Expansion

When adding new icons to the system:

1. **Consistency Check**: Ensure new icons match the stroke width and style
2. **Size Validation**: Test at all required sizes (16px-48px)
3. **Accessibility Review**: Verify contrast and clarity
4. **Context Testing**: Ensure icons are recognizable in their intended use cases
5. **Documentation**: Add usage guidelines and variations

### Future Icon Priorities
1. **Heart**: For favorites/wishlist functionality
2. **Filter**: For product filtering and sorting
3. **Star**: For ratings and reviews
4. **Truck**: For shipping and delivery information
5. **Credit Card**: For payment and billing
6. **Eye**: For product quick view functionality
7. **Share**: For social sharing features
8. **Bell**: For notifications and alerts

---

*This iconography system is designed to grow with the product while maintaining visual consistency and usability. All icons should be optimized for web delivery and tested across different devices and screen densities.*