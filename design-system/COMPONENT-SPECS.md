# Component Specifications v2

**Version:** 2.0  
**Last Updated:** 2026-05-05  
**Status:** Production Ready

## Overview
This document provides detailed specifications for all reusable components in the design system. Each component includes visual specifications, interaction states, accessibility requirements, and implementation notes for engineering handoff.

---

## 1. Global Header

### Description
Sticky site header containing logo, primary navigation, and conversion CTAs. Provides consistent navigation across all templates.

### Visual Specifications
- **Height:** 80px on desktop, 64px on mobile
- **Background:** `var(--color-paper-0)` with `--shadow-sm`
- **Container:** Max-width `--container-lg` with horizontal padding
- **Layout:** Flexbox with space-between alignment

### Component States

#### 1.1 Default State (Desktop)
- Logo: Left-aligned, 120px max-width
- Navigation: Horizontal list, centered
- CTAs: Right-aligned, 2 buttons (call + schedule)
- Background: White with subtle shadow
- Position: `position: sticky; top: 0;`

#### 1.2 Compact on Scroll (Desktop)
- **Trigger:** After scrolling 100px down
- Height: Reduced to 64px
- Logo: Scaled to 100px
- Font size: Reduced by 10%
- Transition: `var(--motion-slow) var(--easing-standard)`

#### 1.3 Mobile Variant (< 768px)
- Layout: Logo left, hamburger menu right
- Navigation: Hidden by default, revealed via disclosure button
- CTAs: Moved inside mobile navigation panel
- Hamburger icon: 24x24px with 44x44px touch target

#### 1.4 Mobile Navigation Open
- Panel: Full-width, slides from right
- Background: `var(--color-paper-0)`
- Overlay: Semi-transparent backdrop `rgba(0, 0, 0, 0.5)`
- Animation: 320ms slide-in with `--easing-entrance`
- Focus trap: Active while open
- Scroll lock: Body scroll disabled

### Interaction Specifications

**Desktop Navigation Hover:**
- Link color: `var(--color-accent-600)` → `var(--color-accent-700)`
- Underline: Animates in from center, `--motion-fast`
- Cursor: pointer

**Mobile Menu Toggle:**
- Click/tap: Opens navigation panel
- aria-expanded: Updates from false to true
- Icon: Transforms hamburger → X with rotation animation
- Focus: Moves to first navigation link when opened
- Escape key: Closes menu and returns focus to toggle button

**Keyboard Navigation:**
- Tab: Moves through logo, nav links, CTAs in order
- Shift+Tab: Reverse order
- Enter/Space: Activates focused link
- Escape: Closes mobile menu if open

### Accessibility Requirements
- ✅ Skip link: First focusable element, links to `#main`
- ✅ Semantic: `<header role="banner">`
- ✅ Navigation landmark: `<nav aria-label="Primary">`
- ✅ Focus visible: 2px solid outline on all interactive elements
- ✅ Mobile menu button: `aria-expanded` and `aria-controls` attributes
- ✅ Focus management: Trap focus in mobile menu when open
- ✅ Screen reader: Menu state announced via aria-expanded

### Responsive Behavior
| Viewport | Layout | Navigation | CTAs |
|----------|--------|------------|------|
| < 768px  | Mobile | Hamburger menu | Inside menu panel |
| 768px - 1024px | Desktop | Horizontal | Visible, condensed |
| > 1024px | Desktop | Horizontal | Full size |

### Implementation Notes
```html
<header class="site-header" role="banner">
  <a class="skip-link" href="#main">Skip to main content</a>
  <div class="container header-row">
    <a class="brand" href="/">
      <img src="logo.svg" alt="Company Name" width="120" height="40" />
    </a>
    <button class="nav-toggle" 
            aria-expanded="false" 
            aria-controls="primary-nav"
            aria-label="Toggle navigation">
      <span class="hamburger-icon"></span>
    </button>
    <nav id="primary-nav" class="primary-nav" aria-label="Primary">
      <ul>
        <li><a href="/services/">Services</a></li>
        <li><a href="/locations/">Locations</a></li>
        <li><a href="/reviews/">Reviews</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </nav>
    <div class="header-cta">
      <a class="btn btn-secondary" href="tel:+13155550100" data-track="call_header">
        Call (315) 555-0100
      </a>
      <a class="btn btn-primary" href="#schedule" data-track="schedule_header">
        Schedule Service
      </a>
    </div>
  </div>
</header>
```

### CSS Specifications
- Position: `position: sticky; top: 0; z-index: var(--z-sticky);`
- Shadow: `box-shadow: var(--shadow-sm);`
- Transition: `height var(--motion-slow) var(--easing-standard);`

---

## 2. CTA Button System

### Description
Primary interaction elements for conversion actions. Three variants with comprehensive state system.

### Variants

#### 2.1 Primary Button
**Purpose:** High-priority conversion actions (schedule, submit, get estimate)

**Visual Specifications:**
- Background: `var(--color-primary-600)`
- Text: `var(--color-paper-0)`
- Padding: `var(--space-3) var(--space-5)` (12px 24px)
- Border-radius: `var(--radius-sm)`
- Font-size: `var(--font-size-200)`
- Font-weight: `var(--font-weight-semibold)`
- Min-height: 44px
- Min-width: 120px

#### 2.2 Secondary Button
**Purpose:** Supporting actions, alternative paths (call, learn more)

**Visual Specifications:**
- Background: `transparent`
- Border: `2px solid var(--color-accent-600)`
- Text: `var(--color-accent-600)`
- Padding: `calc(var(--space-3) - 2px) calc(var(--space-5) - 2px)` (compensate for border)
- Other properties: Same as primary

#### 2.3 Emergency Button
**Purpose:** Urgent actions (emergency call, urgent request)

**Visual Specifications:**
- Background: `var(--color-ink-900)`
- Text: `var(--color-paper-0)`
- Icon: Phone icon, 16px, positioned left
- Padding: Same as primary
- Shadow: `var(--shadow-md)` for elevation

### Button States

#### State Matrix
| State | Primary BG | Primary Text | Secondary Border | Secondary Text | Transition |
|-------|-----------|--------------|------------------|----------------|------------|
| Default | `#cc142a` | `#ffffff` | `#0d6b66` | `#0d6b66` | - |
| Hover | `#a70f22` | `#ffffff` | `#0a5652` | `#0a5652` | 120ms |
| Focus | `#cc142a` | `#ffffff` | `#0d6b66` | `#0d6b66` | - |
| Active | `#8a0c1c` | `#ffffff` | `#084540` | `#084540` | Instant |
| Disabled | `#d8d7d2` | `#a6a399` | `#d8d7d2` | `#a6a399` | - |
| Loading | `#a70f22` | `#ffffff` | `#0d6b66` | `#0d6b66` | - |

#### 2.4 Hover State
- Background: Darkens by one shade level
- Cursor: `pointer`
- Transition: `background-color var(--motion-fast) var(--easing-standard)`
- Scale: Optional subtle scale(1.02) for playfulness

#### 2.5 Focus State
- Outline: `2px solid var(--color-primary-600)`
- Outline-offset: `2px`
- Shadow: `var(--shadow-focus)` in addition to outline
- Background: No change (maintain default)

#### 2.6 Active/Pressed State
- Background: Darkest shade variant
- Transform: `translateY(1px)` for pressed effect
- Shadow: Reduced to `--shadow-xs`
- Transition: Instant (no delay)

#### 2.7 Disabled State
- Background: `var(--color-border-200)`
- Text: `var(--color-ink-500)`
- Cursor: `not-allowed`
- Opacity: 0.6
- Pointer-events: `none`

#### 2.8 Loading State
- Content: Spinner replaces text or appears inline
- aria-busy: `true`
- Cursor: `wait`
- Pointer-events: `none`
- Animation: Spinner rotates continuously

### Accessibility Requirements
- ✅ Minimum touch target: 44x44px
- ✅ Focus visible: Always show focus indicator
- ✅ Disabled state: Use `disabled` attribute, not just visual
- ✅ Loading state: Announce with `aria-busy="true"` and `aria-live`
- ✅ Icon buttons: Include `aria-label` if no visible text
- ✅ Contrast: All text meets WCAG AA (4.5:1 minimum)

### Implementation Notes
```html
<!-- Primary CTA -->
<button class="btn btn-primary" type="button" data-track="schedule_cta">
  Schedule Service
</button>

<!-- Secondary CTA -->
<a class="btn btn-secondary" href="tel:+13155550100" data-track="call_cta">
  Call Now
</a>

<!-- Emergency CTA -->
<button class="btn btn-emergency" type="button" data-track="emergency_cta">
  <span class="icon-phone" aria-hidden="true"></span>
  Emergency Service
</button>

<!-- Disabled state -->
<button class="btn btn-primary" disabled>
  Unavailable
</button>

<!-- Loading state -->
<button class="btn btn-primary" aria-busy="true">
  <span class="spinner" aria-hidden="true"></span>
  Submitting...
</button>
```

---

## 3. Form Components

### Description
Form input system with validation, error handling, and accessibility support.

### 3.1 Text Input Field

**Visual Specifications:**
- Height: 48px
- Padding: `var(--space-3) var(--space-4)`
- Border: `1px solid var(--color-border-200)`
- Border-radius: `var(--radius-sm)`
- Font-size: `var(--font-size-200)`
- Background: `var(--color-paper-0)`

**Field States:**

#### Default State
- Border: `1px solid var(--color-border-200)`
- Background: `var(--color-paper-0)`
- Text: `var(--color-ink-900)`

#### Focus State
- Border: `2px solid var(--color-accent-600)`
- Outline: `2px solid var(--color-accent-600)` with `2px offset`
- Box-shadow: `var(--shadow-focus-accent)`
- Transition: `border-color var(--motion-fast)`

#### Error State
- Border: `2px solid var(--color-error-600)`
- Background: `rgba(220, 38, 38, 0.05)` (light red tint)
- aria-invalid: `true`
- aria-describedby: Points to error message ID

#### Success State
- Border: `2px solid var(--color-success-600)`
- Background: `rgba(11, 143, 79, 0.05)` (light green tint)
- Checkmark icon: Positioned at right edge

#### Disabled State
- Border: `1px solid var(--color-border-200)`
- Background: `var(--color-paper-50)`
- Text: `var(--color-ink-500)`
- Cursor: `not-allowed`

### 3.2 Form Label

**Visual Specifications:**
- Font-size: `var(--font-size-200)`
- Font-weight: `var(--font-weight-semibold)`
- Color: `var(--color-ink-900)`
- Margin-bottom: `var(--space-2)`
- Display: `block`

**Required Indicator:**
- Character: `*` (asterisk)
- Color: `var(--color-error-600)`
- Position: After label text
- aria-label: "required" on input field

### 3.3 Error Message

**Visual Specifications:**
- Font-size: `var(--font-size-100)` (14px)
- Color: `var(--color-error-600)`
- Margin-top: `var(--space-2)`
- Icon: Warning triangle, 14px

**Accessibility:**
- aria-live: `polite` for real-time announcements
- role: `alert` for critical errors
- ID: Matches `{field-id}-error` pattern
- Linked via: `aria-describedby` on input

### 3.4 Form Patterns

#### Short Form (Quick Capture)
**Fields:**
1. Full Name (required)
2. Phone Number (required)
3. ZIP Code (required)
4. Service Type (dropdown, required)

**Purpose:** Emergency requests, quick estimates

#### Long Form (Detailed)
**Fields:** Short form + additional:
5. Email (optional)
6. Preferred Date/Time (optional)
7. Equipment Details (textarea, optional)
8. Additional Notes (textarea, optional)

**Purpose:** Service scheduling, detailed estimates

### Form Validation

**Client-Side Rules:**
- **Name:** Minimum 2 characters, letters and spaces only
- **Phone:** 10 digits, formats (315) 555-0100 or 3155550100
- **Email:** Valid email format (if provided)
- **ZIP:** 5 digits, numeric only
- **Required fields:** Cannot be empty

**Validation Timing:**
- On blur: Validate individual field
- On submit: Validate entire form
- Real-time: Show success state as user types (after initial validation)

### Accessibility Requirements
- ✅ Labels: All inputs have associated `<label>` with `for` attribute
- ✅ Required fields: Marked with asterisk and `required` attribute
- ✅ Error messages: Linked via `aria-describedby` and announced with `aria-live`
- ✅ Focus management: Move to first invalid field on submit failure
- ✅ Submit state: Show `aria-busy="true"` during submission
- ✅ Success message: Announced with `aria-live="polite"`

### Implementation Notes
```html
<form data-validate="true" novalidate>
  <div class="form-field">
    <label for="contact-name">
      Full Name <span class="required" aria-label="required">*</span>
    </label>
    <input 
      id="contact-name" 
      type="text" 
      name="name" 
      required
      aria-required="true"
      aria-describedby="contact-name-error"
    />
    <span class="form-error" id="contact-name-error" aria-live="polite"></span>
  </div>
  
  <div class="form-field">
    <label for="contact-phone">
      Phone Number <span class="required">*</span>
    </label>
    <input 
      id="contact-phone" 
      type="tel" 
      name="phone" 
      required
      pattern="[0-9]{10}"
      aria-describedby="contact-phone-error"
    />
    <span class="form-error" id="contact-phone-error" aria-live="polite"></span>
  </div>
  
  <button class="btn btn-primary" type="submit">Submit Request</button>
  <p class="form-success" aria-live="polite" role="status"></p>
</form>
```

---

## 4. Trust Module Components

### Description
Social proof and credibility components used throughout templates.

### 4.1 Review Badge

**Visual Specifications:**
- Container: Inline-flex, centered alignment
- Star rating: 5 stars, 20px each, gold color `#fbbf24`
- Rating number: `4.9` in `var(--font-weight-bold)`, `var(--font-size-300)`
- Review count: `(247 reviews)` in `var(--color-ink-700)`, `var(--font-size-100)`

**Layout:**
- Stars + Number + Count on single line
- Mobile: May wrap to 2 lines if needed
- Spacing: `var(--space-2)` between elements

### 4.2 Trust Badge

**Visual Specifications:**
- Size: 80x80px on desktop, 64x64px on mobile
- Background: `var(--color-paper-0)` with `--shadow-sm`
- Border-radius: `var(--radius-md)`
- Icon/Logo: Centered, max 60% of container
- Caption: Below badge, `var(--font-size-100)`

**Variants:**
- Licensed & Insured
- 24/7 Emergency Service
- Financing Available
- Satisfaction Guaranteed

### 4.3 Testimonial Card

**Visual Specifications:**
- Background: `var(--color-paper-0)`
- Border: `1px solid var(--color-border-200)`
- Border-radius: `var(--radius-md)`
- Padding: `var(--space-5)`
- Shadow: `var(--shadow-sm)`, hover: `var(--shadow-md)`

**Content Structure:**
1. Star rating (top)
2. Quote text (body)
3. Author name (bold)
4. Author location/date (small, muted)

**Hover State:**
- Shadow: Increases to `--shadow-md`
- Transform: `translateY(-2px)` for lift effect
- Transition: `var(--motion-base)`

---

## 5. FAQ Accordion

### Description
Expandable/collapsible question and answer sections.

### Visual Specifications

**Trigger Button:**
- Width: 100%
- Text-align: Left
- Padding: `var(--space-4)`
- Background: `var(--color-paper-0)`
- Border: `1px solid var(--color-border-200)`
- Border-radius: `var(--radius-sm)`
- Font-weight: `var(--font-weight-semibold)`
- Icon: Chevron or plus/minus, 16px, right-aligned

**Panel:**
- Padding: `var(--space-4)`
- Background: `var(--color-paper-50)`
- Border: `1px solid var(--color-border-200)` (top removed)
- Border-radius: `0 0 var(--radius-sm) var(--radius-sm)`

### States

#### Collapsed (Default)
- Panel: `hidden` attribute set, `display: none`
- aria-expanded: `false`
- Icon: Chevron down or plus icon
- Trigger background: `var(--color-paper-0)`

#### Expanded
- Panel: `hidden` removed, animates height with max-height trick
- aria-expanded: `true`
- Icon: Chevron up or minus icon (rotates 180deg)
- Trigger background: `var(--color-paper-50)` for active state
- Animation: `max-height var(--motion-slow) var(--easing-standard)`

#### Hover State (Trigger)
- Background: `var(--color-paper-100)`
- Cursor: `pointer`
- Transition: `background-color var(--motion-fast)`

#### Focus State (Trigger)
- Outline: `2px solid var(--color-primary-600)`
- Outline-offset: `2px`

### Keyboard Interaction
- **Enter/Space:** Toggle expanded/collapsed state
- **Tab:** Move to next accordion item
- **Arrow keys (optional):** Navigate between accordion items

### Accessibility Requirements
- ✅ Semantic: `<button>` for trigger, not `<div>` with click handler
- ✅ aria-expanded: Updates on state change
- ✅ aria-controls: Links trigger to panel ID
- ✅ hidden attribute: Controls panel visibility
- ✅ Focus visible: Clear focus indicator on trigger
- ✅ Keyboard operable: Enter and Space toggle

### Implementation Notes
```html
<div class="accordion-item">
  <button 
    class="accordion-trigger" 
    aria-expanded="false" 
    aria-controls="panel-1"
    id="trigger-1"
  >
    <span class="accordion-title">What areas do you serve?</span>
    <span class="accordion-icon" aria-hidden="true">+</span>
  </button>
  <div 
    id="panel-1" 
    class="accordion-panel" 
    role="region"
    aria-labelledby="trigger-1"
    hidden
  >
    <p>We serve Syracuse, Cicero, Liverpool, and surrounding areas in Central New York.</p>
  </div>
</div>
```

---

## 6. Footer

### Description
Site-wide footer with contact information, navigation, and compliance links.

### Visual Specifications
- Background: `var(--color-ink-900)`
- Text: `var(--color-paper-0)`
- Padding: `var(--space-7) 0` top/bottom
- Border-top: Optional `4px solid var(--color-primary-600)`

### Layout Structure

**Desktop (> 768px):**
- 4-column grid
- Column 1: NAP (Name, Address, Phone)
- Column 2: Quick Links
- Column 3: Service Areas
- Column 4: Hours & Social

**Mobile (< 768px):**
- Single column, stacked sections
- Each section with heading and content

### Content Requirements
1. **NAP Section:**
   - Business name
   - Street address
   - City, State, ZIP
   - Phone number (clickable tel: link)
   - Email (clickable mailto: link)

2. **Quick Links:**
   - Services
   - Locations
   - Reviews
   - FAQ
   - Contact

3. **Service Areas:**
   - Primary cities served
   - Link to full coverage map

4. **Hours:**
   - Regular hours
   - Emergency availability
   - Social media icons (optional)

5. **Bottom Bar:**
   - Copyright notice
   - Privacy Policy link
   - Terms of Service link
   - Accessibility Statement link

### Accessibility Requirements
- ✅ Semantic: `<footer role="contentinfo">`
- ✅ Headings: Each section has an h2 or h3
- ✅ Link contrast: White on dark background meets WCAG AA
- ✅ Focus visible: Links have clear focus indicators
- ✅ Social icons: Include aria-label for screen readers

---

## 7. Sticky Mobile CTA Bar

### Description
Fixed bottom action bar visible only on mobile viewports (< 768px).

### Visual Specifications
- Position: `position: fixed; bottom: 0; left: 0; right: 0;`
- Height: 64px
- Background: `var(--color-paper-0)`
- Border-top: `1px solid var(--color-border-200)`
- Box-shadow: `0 -4px 12px rgba(18, 33, 38, 0.08)`
- Z-index: `var(--z-sticky)`
- Display: Flex, 2 equal-width buttons

### Button Configuration
1. **Call Button (Left):**
   - Variant: Emergency button style
   - Icon: Phone icon
   - Text: "Call Now"
   - href: `tel:+13155550100`

2. **Schedule Button (Right):**
   - Variant: Primary button style
   - Text: "Schedule"
   - href: `#schedule-form` or opens modal

### Accessibility
- ✅ aria-label: "Mobile call to action bar"
- ✅ Touch targets: Full 44px height buttons
- ✅ Hidden on desktop: `display: none` at 768px+

---

## Component State Coverage Matrix

| Component | Default | Hover | Focus | Active | Disabled | Loading | Error | Success |
|-----------|---------|-------|-------|--------|----------|---------|-------|---------|
| Header | ✅ | N/A | ✅ | N/A | N/A | N/A | N/A | N/A |
| Nav Links | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | N/A |
| Primary Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A |
| Secondary Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A |
| Emergency Button | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A |
| Text Input | ✅ | N/A | ✅ | N/A | ✅ | N/A | ✅ | ✅ |
| Form | ✅ | N/A | ✅ | N/A | N/A | ✅ | ✅ | ✅ |
| Accordion | ✅ | ✅ | ✅ | N/A | N/A | N/A | N/A | N/A |
| Trust Card | ✅ | ✅ | N/A | N/A | N/A | N/A | N/A | N/A |
| Footer Links | ✅ | ✅ | ✅ | N/A | N/A | N/A | N/A | N/A |

---

## Engineering Handoff Notes

### CSS Implementation
- All components use CSS custom properties from TOKENS.md
- Mobile-first approach: Base styles for 360px+, enhance at 768px+
- Use semantic class names (`.btn-primary`, not `.red-button`)
- Avoid inline styles; use utility classes or component classes

### JavaScript Requirements
- Navigation: Toggle mobile menu, focus management
- Forms: Validation, error display, submission handling
- Accordion: Toggle panels, update aria-expanded
- Analytics: Track button clicks via data-track attributes

### Testing Requirements
- Browser: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Devices: iPhone SE, iPad, Desktop (1440px)
- Screen readers: Test with VoiceOver or NVDA
- Keyboard: Tab through all interactive elements

### Performance Guidelines
- CSS: < 50KB minified and gzipped
- JavaScript: < 30KB minified and gzipped
- Images: Lazy-load below fold, use WebP format
- Fonts: Preload critical fonts, use font-display: swap

---

## Version History
- **v2.0** (2026-05-05): Production-ready expansion with full state specifications
- **v1.0** (initial): Basic component definitions
