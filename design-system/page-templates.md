# Page Templates

This document outlines the structure and component breakdown for the three essential page templates in our Tech Luxe Minimal e-commerce website. Each template is designed to provide optimal user experience while maintaining our design system's consistency.

## Design Principles for Page Templates

### Layout Philosophy
- **Progressive Disclosure**: Show the most important information first
- **Scannable Content**: Easy-to-scan layouts with clear visual hierarchy
- **Focused Actions**: Clear primary and secondary action paths
- **Responsive Design**: Mobile-first approach with elegant desktop enhancement

### Visual Hierarchy
1. **Hero/Primary Content**: Main focal point with strong visual weight
2. **Supporting Content**: Secondary information and related items
3. **Navigation/Utility**: Persistent elements for site navigation
4. **Contextual Actions**: Task-specific functions and tools

## Template 1: Homepage

### Purpose
The homepage serves as the primary entry point, showcasing brand identity, featured products, and guiding users toward key actions.

### Layout Structure

#### Header Section
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] [Navigation Menu]           [Search] [User] [Cart]   │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Brand Logo**: Primary brand identifier with link to homepage
- **Primary Navigation**: Category menu with mega-menu expansion
- **Search Bar**: Global product search with autocomplete
- **User Account**: Profile access and authentication state
- **Shopping Cart**: Cart access with item count badge

#### Hero Section
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     [Hero Image/Video]              [Hero Content]         │
│     Product showcase or            • Compelling headline    │
│     brand imagery                  • Value proposition      │
│                                    • Primary CTA button    │
│                                    • Secondary CTA         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Hero Media**: High-quality imagery or video showcasing key products
- **Hero Content**: Compelling headline, value proposition, call-to-action
- **Primary CTA**: Main action button (e.g., "Shop Collection")
- **Secondary CTA**: Alternative action (e.g., "Learn More")

#### Featured Categories
```
┌─────────────────────────────────────────────────────────────┐
│                    "Shop by Category"                      │
│                                                             │
│ [Category 1]  [Category 2]  [Category 3]  [Category 4]     │
│ Electronics   Fashion       Home         Beauty            │
│ [Image]       [Image]       [Image]      [Image]           │
│ 124 items     237 items     189 items    103 items         │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Section Header**: "Shop by Category" with optional description
- **Category Cards**: Image, name, item count, hover effects
- **Grid Layout**: Responsive grid adapting to screen size

#### Featured Products
```
┌─────────────────────────────────────────────────────────────┐
│                   "Featured Products"                      │
│                                                             │
│ [Product 1]   [Product 2]   [Product 3]   [Product 4]     │
│ [Image]       [Image]       [Image]       [Image]         │
│ Product Name  Product Name  Product Name  Product Name    │
│ $299.99       $199.99       $149.99       $89.99          │
│ ★★★★★ (24)    ★★★★☆ (18)    ★★★★★ (31)    ★★★☆☆ (12)      │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Section Header**: "Featured Products" with view all link
- **Product Cards**: Image, name, price, rating, quick actions
- **Responsive Grid**: 1-4 columns based on screen size

#### Value Propositions
```
┌─────────────────────────────────────────────────────────────┐
│ [Icon]               [Icon]               [Icon]            │
│ Free Shipping        24/7 Support        30-Day Returns    │
│ On orders over $50   Dedicated help      Hassle-free       │
│                      available           policy            │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Feature Icons**: Clear, recognizable icons for each benefit
- **Benefit Headlines**: Concise, compelling value statements
- **Supporting Text**: Brief explanations of each benefit

#### Newsletter Signup
```
┌─────────────────────────────────────────────────────────────┐
│                "Stay Updated"                              │
│        Get exclusive offers and new product updates        │
│                                                             │
│    [Email Input Field]           [Subscribe Button]        │
│                                                             │
│           Privacy policy and terms agreement               │
└─────────────────────────────────────────────────────────────┘
```

#### Footer
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]                                                      │
│                                                             │
│ Shop         Customer Service    Company      Follow Us     │
│ • Categories • Contact Us        • About      • Instagram   │
│ • New Arrivals • FAQs           • Careers    • Twitter     │
│ • Sale       • Shipping         • Press      • Facebook    │
│                                                             │
│ © 2024 Brand Name. All rights reserved.                    │
└─────────────────────────────────────────────────────────────┘
```

## Template 2: Product Detail Page (PDP)

### Purpose
The PDP provides comprehensive product information and facilitates the purchase decision with detailed imagery, specifications, and social proof.

### Layout Structure

#### Header Section
*Same as Homepage header for consistency*

#### Product Gallery
```
┌─────────────────────────────────────────────────────────────┐
│ [Thumbnails]     [Main Product Image]                      │
│ [Image 1]        Large, high-quality                       │
│ [Image 2]        product photography                       │
│ [Image 3]        with zoom capability                      │
│ [Image 4]                                                  │
│ [Video]                                                    │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Thumbnail Navigation**: Small preview images for selection
- **Main Image Display**: Large, zoomable product photography
- **Video Content**: Product demonstration or 360° view
- **Image Indicators**: Current image position and total count

#### Product Information
```
┌─────────────────────────────────────────────────────────────┐
│ Product Name                           [Wishlist] [Share]   │
│ Brand Name                                                  │
│ ★★★★☆ (142 reviews) | SKU: ABC123                         │
│                                                             │
│ $299.99  $349.99 (15% off)                                │
│                                                             │
│ Color: [Black] [White] [Gray]                              │
│ Size:  [S] [M] [L] [XL]                                    │
│ Quantity: [-] [1] [+]                                      │
│                                                             │
│ [Add to Cart]              [Buy Now]                       │
│                                                             │
│ ✓ Free shipping on orders over $50                         │
│ ✓ 30-day return policy                                     │
│ ✓ 2-year warranty included                                 │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Product Title**: Clear, descriptive product name
- **Brand Information**: Brand name and credibility indicators
- **Rating Display**: Average rating with review count
- **Price Display**: Current price, original price, discount
- **Variant Selection**: Color, size, and other option selectors
- **Quantity Selector**: Increment/decrement controls
- **Primary Actions**: Add to cart and buy now buttons
- **Trust Signals**: Shipping, returns, warranty information

#### Product Tabs
```
┌─────────────────────────────────────────────────────────────┐
│ [Description] [Specifications] [Reviews] [Shipping]        │
│                                                             │
│ Product Description Content:                                │
│ Detailed product information, features, benefits,          │
│ usage instructions, and care guidelines.                   │
│                                                             │
│ Key Features:                                              │
│ • Feature 1 with benefit explanation                       │
│ • Feature 2 with benefit explanation                       │
│ • Feature 3 with benefit explanation                       │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Tab Navigation**: Description, specs, reviews, shipping
- **Rich Content**: Formatted text, bullet points, images
- **Specifications Table**: Technical details and dimensions
- **Review Summary**: Rating distribution and recent reviews

#### Related Products
```
┌─────────────────────────────────────────────────────────────┐
│                "You might also like"                       │
│                                                             │
│ [Product 1]   [Product 2]   [Product 3]   [Product 4]     │
│ Similar or complementary products                          │
└─────────────────────────────────────────────────────────────┘
```

#### Recently Viewed
```
┌─────────────────────────────────────────────────────────────┐
│                "Recently Viewed"                           │
│                                                             │
│ [Product 1]   [Product 2]   [Product 3]                   │
│ User's browsing history                                    │
└─────────────────────────────────────────────────────────────┘
```

## Template 3: Collection Page

### Purpose
The collection page displays curated groups of products with filtering and sorting capabilities to help users discover and compare products efficiently.

### Layout Structure

#### Header Section
*Same as Homepage header for consistency*

#### Collection Hero
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ [Collection Image]              Collection Name             │
│ Lifestyle or                    Brief description of       │
│ category imagery                the collection theme        │
│                                                             │
│                                 [Shop Collection]          │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Collection Image**: Lifestyle photography or category imagery
- **Collection Title**: Clear, descriptive collection name
- **Collection Description**: Brief explanation of the theme or purpose
- **Primary CTA**: Action to start shopping

#### Filters & Sorting
```
┌─────────────────────────────────────────────────────────────┐
│ Filters ▼    Sort by: Newest ▼    [Grid] [List]    24 products │
│                                                             │
│ [Filter Panel - Mobile: Drawer | Desktop: Sidebar]         │
│ Categories: □ Electronics □ Fashion □ Home                  │
│ Price: $0 ──●────── $500                                   │
│ Brand: □ Apple □ Samsung □ Nike                            │
│ Rating: ★★★★★ and up                                       │
│ Color: ⬜ ⚫ 🔴 🔵 🟢                                      │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Filter Controls**: Category, price, brand, rating, color filters
- **Sort Options**: Price, popularity, newest, rating sorting
- **View Toggle**: Grid vs list view options
- **Results Count**: Number of products displayed
- **Active Filters**: Display and removal of applied filters

#### Product Grid
```
┌─────────────────────────────────────────────────────────────┐
│ [Product 1]   [Product 2]   [Product 3]   [Product 4]     │
│ [Image]       [Image]       [Image]       [Image]         │
│ Product Name  Product Name  Product Name  Product Name    │
│ $299.99       $199.99       $149.99       $89.99          │
│ ★★★★★ (24)    ★★★★☆ (18)    ★★★★★ (31)    ★★★☆☆ (12)      │
│ [❤] [👁] [🛒] [❤] [👁] [🛒] [❤] [👁] [🛒] [❤] [👁] [🛒]   │
│                                                             │
│ [Product 5]   [Product 6]   [Product 7]   [Product 8]     │
│ [Continue pattern...]                                      │
│                                                             │
│ [Load More Products] or [Pagination: 1 2 3 ... 12 Next]   │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- **Product Cards**: Image, name, price, rating, quick actions
- **Quick Actions**: Wishlist, quick view, add to cart
- **Loading Strategy**: Load more or pagination options
- **Empty State**: When no products match filters

#### Collection Features
```
┌─────────────────────────────────────────────────────────────┐
│                 "Why Shop This Collection"                 │
│                                                             │
│ [Icon]               [Icon]               [Icon]            │
│ Curated Selection    Premium Quality      Expert Reviews    │
│ Hand-picked by       Tested and          Real customer     │
│ our style team       verified quality    experiences       │
└─────────────────────────────────────────────────────────────┘
```

## Responsive Design Considerations

### Mobile-First Approach
1. **Stack vertically**: Single-column layouts for mobile
2. **Touch-friendly**: 44px minimum touch targets
3. **Simplified navigation**: Hamburger menus and overlays
4. **Optimized images**: Appropriate sizes for mobile networks

### Tablet Adaptations
1. **2-column grids**: Balanced content display
2. **Expanded navigation**: Show more menu items
3. **Side-by-side layouts**: Utilize wider screen space

### Desktop Enhancements
1. **Multi-column grids**: 3-4 product columns
2. **Mega menus**: Rich navigation experiences
3. **Hover states**: Interactive feedback and previews
4. **Advanced filtering**: Expanded sidebar filters

## Component Specifications

### Shared Components
- **Header**: Consistent across all pages
- **Footer**: Standardized footer with all essential links
- **Product Card**: Reusable component for product display
- **Button Styles**: Primary, secondary, and ghost variants
- **Form Elements**: Consistent input and select styling

### Performance Considerations
- **Image Optimization**: WebP format with fallbacks
- **Lazy Loading**: Progressive loading of images and content
- **Critical CSS**: Above-the-fold content prioritization
- **Code Splitting**: Page-specific JavaScript bundles

### Accessibility Features
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and structure
- **Color Contrast**: WCAG AA compliance
- **Focus Management**: Clear focus indicators

---

*These page templates provide the foundation for a cohesive, user-friendly e-commerce experience. Each template should be validated through user testing and iterated based on real user behavior and feedback.*