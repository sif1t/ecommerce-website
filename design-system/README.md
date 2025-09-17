# Tech Luxe Minimal Design System

A comprehensive design system for building premium, modern e-commerce experiences that embody sophistication, minimalism, and technological innovation.

## Overview

The "Tech Luxe Minimal" aesthetic represents the perfect intersection of cutting-edge technology and refined luxury. This design system embraces clean lines, sophisticated color palettes, and purposeful whitespace to create experiences that feel both premium and approachable.

### Design Philosophy

- **Minimal**: Clean, uncluttered interfaces that prioritize content and user experience
- **Luxurious**: Premium materials, refined typography, and sophisticated color choices
- **Technical**: Modern, precise, and functionally optimized for digital-first experiences
- **Accessible**: Inclusive design that works for all users across all devices

## Color Palette

### Primary Colors

Our color system is built around three core colors that embody the Tech Luxe Minimal aesthetic:

#### Porcelain (Neutral Base)
- **Primary**: `#F8F9FA` - Main background and neutral base
- **50**: `#FFFFFF` - Pure white for cards and overlays
- **100**: `#F8F9FA` - Light background
- **200**: `#E9ECEF` - Subtle borders and dividers
- **300**: `#DEE2E6` - Disabled states and placeholders
- **400**: `#CED4DA` - Input borders and secondary elements
- **500**: `#ADB5BD` - Muted text and icons
- **600**: `#6C757D` - Secondary text
- **700**: `#495057` - Primary text on light backgrounds
- **800**: `#343A40` - Headers and emphasis
- **900**: `#212529` - Maximum contrast text

#### Carbon (Dark Sophistication)
- **Primary**: `#1A1A1A` - Deep black for premium feel
- **50**: `#F8F8F8` - Lightest carbon for subtle backgrounds
- **100**: `#E8E8E8` - Light carbon for borders
- **200**: `#D1D1D1` - Medium light for dividers
- **300**: `#B4B4B4` - Medium for secondary elements
- **400**: `#8B8B8B` - Medium dark for icons
- **500**: `#6B6B6B` - Standard carbon for text
- **600**: `#4A4A4A` - Dark carbon for headers
- **700**: `#2D2D2D` - Very dark for emphasis
- **800**: `#1F1F1F` - Near black for depth
- **900**: `#1A1A1A` - Pure carbon black

#### Electric Indigo (Accent & Interactive)
- **Primary**: `#5B47FB` - Main brand color and primary actions
- **50**: `#F4F3FF` - Lightest indigo for backgrounds
- **100**: `#E8E5FF` - Light indigo for subtle highlights
- **200**: `#D6D1FF` - Medium light for hover states
- **300**: `#B8B0FF` - Medium for secondary actions
- **400**: `#9B8CFF` - Medium dark for active states
- **500**: `#7C66FF` - Standard indigo for links
- **600**: `#5B47FB` - Primary brand color
- **700**: `#4A38D1` - Dark indigo for pressed states
- **800**: `#3B2AA8` - Very dark for emphasis
- **900**: `#2D1F7F` - Darkest indigo for maximum contrast

### Light Mode Color Usage

- **Background**: Porcelain 100 (`#F8F9FA`)
- **Surface**: Porcelain 50 (`#FFFFFF`)
- **Primary Text**: Carbon 800 (`#1F1F1F`)
- **Secondary Text**: Carbon 600 (`#4A4A4A`)
- **Muted Text**: Carbon 400 (`#8B8B8B`)
- **Borders**: Porcelain 200 (`#E9ECEF`)
- **Interactive**: Electric Indigo 600 (`#5B47FB`)
- **Interactive Hover**: Electric Indigo 700 (`#4A38D1`)
- **Interactive Active**: Electric Indigo 800 (`#3B2AA8`)

### Dark Mode Color Usage

- **Background**: Carbon 900 (`#1A1A1A`)
- **Surface**: Carbon 800 (`#1F1F1F`)
- **Primary Text**: Porcelain 50 (`#FFFFFF`)
- **Secondary Text**: Porcelain 300 (`#DEE2E6`)
- **Muted Text**: Porcelain 500 (`#ADB5BD`)
- **Borders**: Carbon 700 (`#2D2D2D`)
- **Interactive**: Electric Indigo 400 (`#9B8CFF`)
- **Interactive Hover**: Electric Indigo 300 (`#B8B0FF`)
- **Interactive Active**: Electric Indigo 200 (`#D6D1FF`)

## Typography

### Font Families

#### Primary Font Stack (Inter)
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```
- **Usage**: Primary interface text, body copy, navigation
- **Characteristics**: Highly legible, optimized for screens, neutral personality

#### Secondary Font Stack (JetBrains Mono)
```css
font-family: 'JetBrains Mono', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
```
- **Usage**: Code snippets, technical data, product SKUs, prices
- **Characteristics**: Monospaced, technical aesthetic, excellent readability

#### Display Font Stack (Clash Display)
```css
font-family: 'Clash Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```
- **Usage**: Headlines, hero text, brand elements
- **Characteristics**: Modern, sophisticated, premium feel

### Typography Scale

#### Display Styles
- **Display XL**: 72px / 4.5rem - Line Height: 80px (1.11) - Font Weight: 700
- **Display L**: 60px / 3.75rem - Line Height: 72px (1.2) - Font Weight: 700
- **Display M**: 48px / 3rem - Line Height: 56px (1.17) - Font Weight: 600
- **Display S**: 36px / 2.25rem - Line Height: 44px (1.22) - Font Weight: 600

#### Heading Styles
- **H1**: 32px / 2rem - Line Height: 40px (1.25) - Font Weight: 600
- **H2**: 24px / 1.5rem - Line Height: 32px (1.33) - Font Weight: 600
- **H3**: 20px / 1.25rem - Line Height: 28px (1.4) - Font Weight: 600
- **H4**: 18px / 1.125rem - Line Height: 24px (1.33) - Font Weight: 600
- **H5**: 16px / 1rem - Line Height: 22px (1.375) - Font Weight: 600
- **H6**: 14px / 0.875rem - Line Height: 20px (1.43) - Font Weight: 600

#### Body Styles
- **Body XL**: 20px / 1.25rem - Line Height: 30px (1.5) - Font Weight: 400
- **Body L**: 18px / 1.125rem - Line Height: 28px (1.56) - Font Weight: 400
- **Body M**: 16px / 1rem - Line Height: 24px (1.5) - Font Weight: 400
- **Body S**: 14px / 0.875rem - Line Height: 20px (1.43) - Font Weight: 400
- **Body XS**: 12px / 0.75rem - Line Height: 16px (1.33) - Font Weight: 400

#### Label Styles
- **Label L**: 16px / 1rem - Line Height: 20px (1.25) - Font Weight: 500
- **Label M**: 14px / 0.875rem - Line Height: 18px (1.29) - Font Weight: 500
- **Label S**: 12px / 0.75rem - Line Height: 16px (1.33) - Font Weight: 500
- **Label XS**: 10px / 0.625rem - Line Height: 12px (1.2) - Font Weight: 500

### Font Weights
- **300**: Light (occasional use for large display text)
- **400**: Regular (body text, paragraphs)
- **500**: Medium (labels, emphasized text)
- **600**: Semi-bold (headings, subheadings)
- **700**: Bold (display text, strong emphasis)

## Spacing System

### Base Unit
Our spacing system is based on a 4px base unit, creating consistent rhythm and alignment throughout the interface.

### Spacing Scale
- **0**: 0px
- **1**: 4px (0.25rem)
- **2**: 8px (0.5rem)
- **3**: 12px (0.75rem)
- **4**: 16px (1rem)
- **5**: 20px (1.25rem)
- **6**: 24px (1.5rem)
- **8**: 32px (2rem)
- **10**: 40px (2.5rem)
- **12**: 48px (3rem)
- **16**: 64px (4rem)
- **20**: 80px (5rem)
- **24**: 96px (6rem)
- **32**: 128px (8rem)
- **40**: 160px (10rem)
- **48**: 192px (12rem)
- **56**: 224px (14rem)
- **64**: 256px (16rem)

### Spacing Guidelines
- **Component Internal**: Use spacing 1-6 (4px-24px) for internal component spacing
- **Component Margins**: Use spacing 4-12 (16px-48px) for margins between components
- **Section Spacing**: Use spacing 16-32 (64px-128px) for major section divisions
- **Page Margins**: Use spacing 6-12 (24px-48px) for page edge margins

## Layout Grids

### Mobile Grid (≤768px)
- **Columns**: 4
- **Gutter**: 16px
- **Margin**: 16px
- **Max Width**: 100%
- **Breakpoint**: 0-767px

### Tablet Grid (768px-1024px)
- **Columns**: 8
- **Gutter**: 24px
- **Margin**: 32px
- **Max Width**: 768px
- **Breakpoint**: 768px-1023px

### Desktop Grid (≥1024px)
- **Columns**: 12
- **Gutter**: 24px
- **Margin**: 48px
- **Max Width**: 1200px
- **Breakpoint**: 1024px+

### Grid Usage Guidelines
- **Content Width**: Never exceed 1200px for optimal readability
- **Flexible Columns**: Use CSS Grid and Flexbox for responsive behavior
- **Alignment**: Align content to grid columns for visual consistency
- **Breakpoints**: Design mobile-first, enhance for larger screens

## Elevation System

### Shadow Tokens
Our elevation system uses subtle shadows to create depth and hierarchy while maintaining the minimal aesthetic.

#### Level 0 (Flat)
```css
box-shadow: none;
```
- **Usage**: Default state, embedded elements

#### Level 1 (Raised)
```css
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
```
- **Usage**: Cards, buttons in default state

#### Level 2 (Floating)
```css
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
```
- **Usage**: Hover states, selected cards

#### Level 3 (Elevated)
```css
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
```
- **Usage**: Modals, dropdowns, active states

#### Level 4 (Overlay)
```css
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```
- **Usage**: Important overlays, tooltips

#### Level 5 (Modal)
```css
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```
- **Usage**: Modal dialogs, important notifications

### Dark Mode Elevation
In dark mode, elevations are enhanced with subtle light borders:

```css
border: 1px solid rgba(255, 255, 255, 0.1);
```

## Border Radius

### Radius Scale
- **None**: 0px - Sharp edges for technical elements
- **SM**: 4px - Small components, buttons
- **MD**: 8px - Cards, inputs, standard components
- **LG**: 12px - Large cards, containers
- **XL**: 16px - Hero sections, major containers
- **2XL**: 24px - Modal dialogs, special features
- **Full**: 9999px - Pills, tags, circular elements

### Usage Guidelines
- **Interactive Elements**: Use SM (4px) for buttons, inputs
- **Content Cards**: Use MD (8px) for standard cards
- **Major Containers**: Use LG-XL (12px-16px) for sections
- **Special Elements**: Use 2XL (24px) for modals, hero areas

## Implementation Notes

### Design Token Structure
All design tokens are organized hierarchically:
- **Global tokens**: Base values (colors, spacing, typography)
- **Alias tokens**: Semantic meanings (primary, secondary, danger)
- **Component tokens**: Component-specific overrides

### Accessibility Considerations
- **Color Contrast**: All text meets WCAG AA standards (4.5:1 minimum)
- **Focus States**: Clear focus indicators using Electric Indigo
- **Motion**: Respects prefers-reduced-motion settings
- **Typography**: Minimum 16px for body text on mobile

### Framework Integration
This design system is optimized for:
- **Tailwind CSS**: Direct mapping to utility classes
- **CSS Custom Properties**: For dynamic theming
- **Figma Tokens Plugin**: Seamless design-to-development workflow
- **Component Libraries**: React, Vue, Angular compatibility

---

*This design system is a living document that evolves with our product and user needs. For questions or contributions, please refer to our design system governance guidelines.*