# Design Tokens v2

**Version:** 2.0  
**Last Updated:** 2026-05-05  
**Status:** Production Ready

## Overview
This document defines the complete design token system for the HVAC website. All design decisions must use these tokens to ensure consistency, accessibility, and maintainability across all templates and components.

## Color Tokens

### Semantic Color System
Design tokens use a semantic naming system that describes intent rather than appearance, enabling theme changes without component modifications.

#### Text Colors
| Token | Value | Usage | Notes |
|-------|-------|-------|-------|
| `--color-ink-900` | `#122126` | Primary body text, headings | Darkest text, highest contrast |
| `--color-ink-700` | `#2a3f46` | Secondary text, captions | Medium contrast for supporting text |
| `--color-ink-500` | `#5a6c73` | Disabled text, placeholders | Low emphasis, accessible on white |

#### Background Colors
| Token | Value | Usage | Notes |
|-------|-------|-------|-------|
| `--color-paper-0` | `#ffffff` | Primary background, card surfaces | Pure white for maximum contrast |
| `--color-paper-50` | `#f6f3eb` | Section backgrounds, subtle dividers | Warm off-white, reduces glare |
| `--color-paper-100` | `#ede9df` | Hover states on light backgrounds | Slightly darker warm tone |

#### Brand Colors
| Token | Value | Usage | Notes |
|-------|-------|-------|-------|
| `--color-primary-600` | `#cc142a` | Primary CTAs, links, active states | Emergency red, high urgency |
| `--color-primary-700` | `#a70f22` | Hover state for primary actions | Darker red for interaction feedback |
| `--color-primary-800` | `#8a0c1c` | Active/pressed state | Darkest red for pressed buttons |
| `--color-accent-600` | `#0d6b66` | Secondary CTAs, trust badges | Teal, professional and trustworthy |
| `--color-accent-700` | `#0a5652` | Hover state for accent actions | Darker teal for interaction |

#### Feedback Colors
| Token | Value | Usage | Notes |
|-------|-------|-------|-------|
| `--color-success-600` | `#0b8f4f` | Success messages, positive indicators | Green, accessible contrast |
| `--color-success-700` | `#087a42` | Success hover states | Darker green |
| `--color-warning-600` | `#d97706` | Warning messages, caution states | Orange, accessible on dark backgrounds |
| `--color-warning-700` | `#b85f05` | Warning hover states | Darker orange |
| `--color-error-600` | `#dc2626` | Error messages, validation failures | Red, distinct from primary brand |
| `--color-error-700` | `#b91c1c` | Error hover states | Darker error red |

#### Border Colors
| Token | Value | Usage | Notes |
|-------|-------|-------|-------|
| `--color-border-200` | `#d8d7d2` | Default borders, dividers | Subtle, warm gray |
| `--color-border-300` | `#bfbdb4` | Hover state borders | Slightly darker |
| `--color-border-400` | `#a6a399` | Active/focus borders | Medium emphasis |

### Color Usage Rules
1. **Never use raw hex values** in component styles - always reference tokens
2. **Text on brand colors** must use `--color-paper-0` (white) for contrast
3. **Interactive elements** must have distinct hover and focus states
4. **Error states** use `--color-error-600` with red border and error text
5. **Success states** use `--color-success-600` with green text

## Typography Tokens

### Font Families
| Token | Value | Usage | Fallbacks |
|-------|-------|-------|-----------|
| `--font-family-display` | `"Barlow Condensed"` | Headings, hero text | `"Arial Narrow", sans-serif` |
| `--font-family-body` | `"Public Sans"` | Body text, UI elements | `"Segoe UI", system-ui, sans-serif` |
| `--font-family-mono` | `"SF Mono"` | Code snippets (rare) | `"Consolas", monospace` |

### Font Sizes
Uses a modular scale based on 1rem = 16px. All sizes are responsive via clamp() in implementation.

| Token | Value | Usage | Mobile Equivalent |
|-------|-------|-------|-------------------|
| `--font-size-100` | `0.875rem` | Small text, captions, legal | 14px |
| `--font-size-200` | `1rem` | Body text, form labels | 16px |
| `--font-size-300` | `1.125rem` | Lead paragraphs, subheadings | 18px |
| `--font-size-400` | `1.375rem` | H3 headings | 22px |
| `--font-size-500` | `1.875rem` | H2 headings | 30px |
| `--font-size-600` | `2.5rem` | H1 headings (desktop) | 40px |
| `--font-size-700` | `3.25rem` | Hero headlines (desktop) | 52px |

### Font Weights
| Token | Value | Usage | Notes |
|-------|-------|-------|-------|
| `--font-weight-normal` | `400` | Body text | Default weight |
| `--font-weight-medium` | `500` | Emphasized text | Slightly heavier |
| `--font-weight-semibold` | `600` | Subheadings, labels | Medium emphasis |
| `--font-weight-bold` | `700` | Headings, CTAs | Strong emphasis |

### Line Heights
| Token | Value | Usage | Notes |
|-------|-------|-------|-------|
| `--line-height-tight` | `1.2` | Headings, display text | Compact, improves readability for large text |
| `--line-height-normal` | `1.4` | Subheadings, UI elements | Balanced spacing |
| `--line-height-body` | `1.5` | Body text, paragraphs | Optimal for reading |
| `--line-height-loose` | `1.75` | Long-form content | Extra breathing room |

### Letter Spacing
| Token | Value | Usage | Notes |
|-------|-------|-------|-------|
| `--letter-spacing-tight` | `-0.01em` | Large headings | Improves visual balance |
| `--letter-spacing-normal` | `0` | Default text | No adjustment |
| `--letter-spacing-wide` | `0.025em` | Uppercase labels | Improves readability |

## Spacing Tokens

### Scale System
Based on 4px base unit (0.25rem). Uses a consistent mathematical progression.

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--space-0` | `0` | 0px | Reset spacing |
| `--space-1` | `0.25rem` | 4px | Inline spacing, icon gaps |
| `--space-2` | `0.5rem` | 8px | Tight padding, small gaps |
| `--space-3` | `0.75rem` | 12px | Default padding, form field spacing |
| `--space-4` | `1rem` | 16px | Standard spacing, button padding |
| `--space-5` | `1.5rem` | 24px | Section padding, card padding |
| `--space-6` | `2rem` | 32px | Large section gaps |
| `--space-7` | `3rem` | 48px | Major section breaks |
| `--space-8` | `4rem` | 64px | Page-level spacing |
| `--space-10` | `6rem` | 96px | Hero sections |
| `--space-12` | `8rem` | 128px | Extra large sections |

### Spacing Usage Rules
1. **Prefer multiples of 4px** for all spacing values
2. **Vertical rhythm:** Use `--space-6` or `--space-7` between major sections
3. **Component spacing:** Use `--space-4` or `--space-5` for internal padding
4. **Form fields:** Use `--space-3` for consistent field spacing
5. **Touch targets:** Minimum 44px (--space-11 = 2.75rem) for interactive elements

## Radius Tokens

### Border Radius Scale
| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--radius-sm` | `0.375rem` | 6px | Buttons, small cards, tags |
| `--radius-md` | `0.625rem` | 10px | Cards, form fields, modals |
| `--radius-lg` | `0.875rem` | 14px | Large cards, hero sections |
| `--radius-xl` | `1.25rem` | 20px | Feature sections, special components |
| `--radius-full` | `9999px` | Full | Pills, circular buttons |

### Radius Usage Rules
1. **Consistent rounding:** Use same radius for related components
2. **Button radius:** Use `--radius-sm` for all buttons
3. **Card radius:** Use `--radius-md` for standard cards
4. **Form inputs:** Use `--radius-sm` for consistency with buttons
5. **Never mix** multiple radius values within a single component

## Elevation Tokens

### Shadow System
Shadows create depth hierarchy and improve visual separation.

| Token | Value | Use Case | Elevation Level |
|-------|-------|----------|-----------------|
| `--shadow-none` | `none` | Flat elements | Level 0 |
| `--shadow-xs` | `0 1px 2px rgba(18, 33, 38, 0.08)` | Subtle borders, cards at rest | Level 1 |
| `--shadow-sm` | `0 1px 3px rgba(18, 33, 38, 0.12)` | Default cards, dropdowns | Level 2 |
| `--shadow-md` | `0 8px 24px rgba(18, 33, 38, 0.12)` | Hover states, floating elements | Level 3 |
| `--shadow-lg` | `0 16px 48px rgba(18, 33, 38, 0.16)` | Modals, overlays | Level 4 |
| `--shadow-xl` | `0 24px 64px rgba(18, 33, 38, 0.20)` | Drawer panels, major overlays | Level 5 |

### Focus Shadow
| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-focus` | `0 0 0 3px rgba(204, 20, 42, 0.25)` | Focus indicator around elements |
| `--shadow-focus-accent` | `0 0 0 3px rgba(13, 107, 102, 0.25)` | Focus for secondary actions |

### Elevation Usage Rules
1. **Resting state:** Use `--shadow-sm` for cards and containers
2. **Hover state:** Increase to `--shadow-md` for interactive cards
3. **Active overlays:** Use `--shadow-lg` or `--shadow-xl` for modals
4. **Avoid excessive depth:** Don't exceed 3 elevation levels on one page
5. **Focus states:** Always use `--shadow-focus` in addition to outline

## Motion Tokens

### Duration
| Token | Value | Usage | Notes |
|-------|-------|-------|-------|
| `--motion-instant` | `50ms` | Micro-interactions | Barely perceptible |
| `--motion-fast` | `120ms` | Hover states, tooltips | Quick feedback |
| `--motion-base` | `220ms` | Default transitions | Balanced speed |
| `--motion-slow` | `320ms` | Panel slides, accordions | Deliberate motion |
| `--motion-slower` | `500ms` | Page transitions (rare) | Slow, emphasize change |

### Easing Functions
| Token | Value | Usage |
|-------|-------|-------|
| `--easing-standard` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Default easing, balanced |
| `--easing-entrance` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Elements entering view |
| `--easing-exit` | `cubic-bezier(0.4, 0.0, 1, 1)` | Elements leaving view |
| `--easing-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful interactions (use sparingly) |

### Motion Usage Rules
1. **Default transition:** `transition: all var(--motion-base) var(--easing-standard)`
2. **Hover states:** Use `--motion-fast` for immediate feedback
3. **Panels/accordions:** Use `--motion-slow` for deliberate reveals
4. **Avoid motion on:** Page load, large content shifts (CLS risk)
5. **Respect prefers-reduced-motion:** Disable animations for users who request it

## Breakpoints

### Responsive Breakpoints
| Token | Value | Target Devices | Notes |
|-------|-------|----------------|-------|
| `--bp-sm` | `360px` | Small mobile phones | Minimum supported width |
| `--bp-md` | `768px` | Tablets, large phones | Major layout shift point |
| `--bp-lg` | `1024px` | Desktop, laptop | Multi-column layouts |
| `--bp-xl` | `1440px` | Large desktop | Max container width |
| `--bp-2xl` | `1920px` | Ultra-wide monitors | Optional enhancement |

### Container Widths
| Token | Value | Usage |
|-------|-------|-------|
| `--container-sm` | `640px` | Narrow content (forms, articles) |
| `--container-md` | `960px` | Standard content |
| `--container-lg` | `1200px` | Default page container |
| `--container-xl` | `1400px` | Wide layouts (rare) |

### Breakpoint Usage Rules
1. **Mobile-first:** Default styles target `--bp-sm`, enhance upward
2. **Major layout change at 768px:** Single column → multi-column
3. **Desktop optimization at 1024px:** Full feature layout
4. **Container max width:** 1200px for optimal reading
5. **Media queries:** Use `min-width` for progressive enhancement

## Z-Index Scale

### Layer System
Prevents z-index conflicts with a predefined scale.

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | `1` | Default stacking |
| `--z-dropdown` | `100` | Dropdowns, tooltips |
| `--z-sticky` | `200` | Sticky headers, fixed CTAs |
| `--z-overlay` | `300` | Modal overlays |
| `--z-modal` | `400` | Modal content |
| `--z-toast` | `500` | Notifications, alerts |
| `--z-max` | `999` | Skip links, emergency overlays |

## Implementation Notes

### CSS Custom Property Usage
```css
/* Correct: Use token variables */
.button {
  background: var(--color-primary-600);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-sm);
  transition: all var(--motion-base) var(--easing-standard);
}

/* Incorrect: Hard-coded values */
.button {
  background: #cc142a;  /* ❌ Don't do this */
  padding: 12px 24px;    /* ❌ Don't do this */
}
```

### Token Modification
1. **Propose changes** via design system update process
2. **Document rationale** for any new tokens
3. **Audit usage** before deprecating tokens
4. **Version updates** to design-system/TOKENS.md

### Browser Support
- CSS Custom Properties: All modern browsers (IE11 not supported)
- Fallbacks required: None (modern browsers only)
- CSS Grid/Flexbox: Full support assumed

## Version History
- **v2.0** (2026-05-05): Production-ready expansion with complete token system
- **v1.0** (initial): Basic token definitions
