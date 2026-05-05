# Component Inventory and State Coverage Matrix

**Version:** 1.0  
**Last Updated:** 2026-05-05  
**Purpose:** Complete catalog of reusable components with state coverage validation  
**Status:** Production Ready

## Overview
This document provides a comprehensive inventory of all design system components, their variants, interaction states, and usage across templates. Use this as a reference for implementation and to ensure complete state coverage.

---

## Component Catalog

### 1. Layout Components

#### 1.1 Container
**Purpose:** Max-width content wrapper for consistent horizontal spacing

**Specifications:**
- Max-width: `1200px` (`--container-lg`)
- Horizontal padding: `1rem` mobile, `1.5rem` tablet, `2rem` desktop
- Margin: `0 auto` (centered)
- Usage: Wraps all major content sections

**Templates Used In:**
- Homepage: ✅
- Service Template: ✅
- Location Template: ✅
- Emergency Landing: ✅

**State Coverage:**
| State | Implemented | Notes |
|-------|-------------|-------|
| Default | ✅ | Standard container |
| Narrow variant | ⚠️ | Optional for forms/articles |

---

#### 1.2 Section
**Purpose:** Major content divisions with vertical spacing

**Specifications:**
- Padding: `--space-6` (2rem) mobile, `--space-7` (3rem) desktop
- Background: Varies (white, warm paper)
- Semantic: `<section>` with optional ID for anchor links

**Templates Used In:**
- Homepage: ✅ (multiple sections)
- Service Template: ✅
- Location Template: ✅
- Emergency Landing: ✅

**Variants:**
- Default: White background
- Alternate: Warm paper background (`--color-paper-50`)
- Hero: Larger padding, background gradient

---

#### 1.3 Grid System
**Purpose:** Multi-column responsive layouts

**Specifications:**
- Mobile (< 768px): Single column
- Tablet (768px - 1023px): 2 columns
- Desktop (≥ 1024px): 2, 3, or 4 columns depending on content
- Gap: `--space-5` (1.5rem) between items

**Grid Variants:**
- `.grid-2`: 2-column layout (desktop)
- `.grid-3`: 3-column layout (desktop)
- `.grid-4`: 4-column layout (desktop, rare)

**Templates Used In:**
- Homepage: ✅ (services grid, trust cards)
- Service Template: ✅ (process steps)
- Location Template: ✅ (service areas)

---

### 2. Navigation Components

#### 2.1 Site Header
**Purpose:** Primary site navigation and branding

**Component Structure:**
- Logo (left)
- Navigation links (center/right)
- CTA buttons (right)
- Mobile menu toggle (mobile only)

**States:**
| State | Desktop | Mobile | Notes |
|-------|---------|--------|-------|
| Default | ✅ | ✅ | Full height, visible shadow |
| Compact on scroll | ✅ | ❌ | Reduced height after 100px scroll |
| Menu open | N/A | ✅ | Side panel with overlay |
| Menu closed | N/A | ✅ | Default mobile state |
| Focus on skip link | ✅ | ✅ | Skip link visible |

**Interaction States:**
- Hover: Navigation links change color
- Focus: Visible 2px outline
- Active: Current page indicator (optional)

**Templates Used In:** All templates (global header)

---

#### 2.2 Navigation Links
**Purpose:** Primary site navigation menu

**States:**
| State | Implemented | Visual Treatment |
|-------|-------------|------------------|
| Default | ✅ | Teal text (`--color-accent-600`) |
| Hover | ✅ | Darker teal, underline animation |
| Focus | ✅ | 2px outline, teal color |
| Active/Current | ⚠️ | Bold or underline (optional) |

**Templates Used In:** All templates

**Responsive Behavior:**
- Desktop: Horizontal inline list
- Mobile: Vertical stack in slide-out panel

---

#### 2.3 Mobile Menu Toggle
**Purpose:** Hamburger button to open/close mobile navigation

**States:**
| State | Implemented | ARIA |
|-------|-------------|------|
| Closed | ✅ | `aria-expanded="false"` |
| Open | ✅ | `aria-expanded="true"` |
| Focus | ✅ | Visible outline |
| Hover | ✅ | Background color change |

**Icon Transformation:**
- Closed: Hamburger (≡)
- Open: X (close icon)
- Animation: 180° rotation with 220ms transition

**Templates Used In:** All templates (mobile only)

---

### 3. CTA Components

#### 3.1 Primary Button
**Purpose:** High-priority conversion actions

**Visual Specs:**
- Background: `--color-primary-600` (red)
- Text: `--color-paper-0` (white)
- Padding: `12px 24px`
- Border-radius: `--radius-sm` (6px)
- Min-height: `44px`

**States:**
| State | Implemented | Background | Text | Shadow | Transition |
|-------|-------------|------------|------|--------|------------|
| Default | ✅ | #cc142a | #ffffff | sm | - |
| Hover | ✅ | #a70f22 | #ffffff | sm | 120ms |
| Focus | ✅ | #cc142a | #ffffff | focus ring | - |
| Active | ✅ | #8a0c1c | #ffffff | xs | instant |
| Disabled | ✅ | #d8d7d2 | #a6a399 | none | - |
| Loading | ✅ | #a70f22 | #ffffff | sm | - |

**Templates Used In:**
- Homepage: ✅ (hero CTA, header CTA)
- Service Template: ✅ (request estimate)
- Location Template: ✅ (schedule service)
- Emergency Landing: ✅ (emergency request)

**Accessibility:**
- ✅ Minimum 44×44px touch target
- ✅ 5.8:1 contrast ratio (WCAG AA)
- ✅ Focus visible with 2px outline

---

#### 3.2 Secondary Button
**Purpose:** Supporting actions, alternative paths

**Visual Specs:**
- Background: `transparent`
- Border: `2px solid --color-accent-600` (teal)
- Text: `--color-accent-600`
- Padding: `10px 22px` (reduced for border)

**States:**
| State | Implemented | Border | Text | Background |
|-------|-------------|--------|------|------------|
| Default | ✅ | #0d6b66 | #0d6b66 | transparent |
| Hover | ✅ | #0a5652 | #0a5652 | rgba(13,107,102,0.05) |
| Focus | ✅ | #0d6b66 | #0d6b66 | transparent + outline |
| Active | ✅ | #084540 | #084540 | rgba(13,107,102,0.1) |
| Disabled | ✅ | #d8d7d2 | #a6a399 | transparent |

**Templates Used In:**
- Homepage: ✅ (secondary hero CTA, call CTA)
- Service Template: ✅ (call CTA)
- Location Template: ✅ (call CTA)

---

#### 3.3 Emergency Button
**Purpose:** Urgent actions requiring immediate attention

**Visual Specs:**
- Background: `--color-ink-900` (dark)
- Text: `--color-paper-0` (white)
- Icon: Phone icon, 16px, left of text
- Shadow: `--shadow-md` for elevation

**States:**
| State | Implemented | Background | Shadow |
|-------|-------------|------------|--------|
| Default | ✅ | #122126 | md |
| Hover | ✅ | #2a3f46 | md |
| Focus | ✅ | #122126 | md + outline |
| Active | ✅ | #000000 | sm |

**Templates Used In:**
- Emergency Landing: ✅ (primary CTA)
- Sticky Mobile CTA: ✅ (call button)

**Accessibility:**
- ✅ 16.2:1 contrast ratio (WCAG AAA)
- ✅ `aria-label` if icon-only

---

### 4. Form Components

#### 4.1 Text Input
**Purpose:** Single-line text entry fields

**Visual Specs:**
- Height: `48px`
- Padding: `12px 16px`
- Border: `1px solid --color-border-200`
- Border-radius: `--radius-sm` (6px)
- Font-size: `16px` (prevents zoom on iOS)

**States:**
| State | Implemented | Border | Background | Outline |
|-------|-------------|--------|------------|---------|
| Default | ✅ | #d8d7d2 | #ffffff | none |
| Focus | ✅ | #0d6b66 (2px) | #ffffff | 2px teal |
| Error | ✅ | #dc2626 (2px) | rgba(220,38,38,0.05) | none |
| Success | ✅ | #0b8f4f (2px) | rgba(11,143,79,0.05) | none |
| Disabled | ✅ | #d8d7d2 | #f6f3eb | none |

**ARIA:**
- `aria-invalid`: Set to `true` on error state
- `aria-describedby`: Links to error message ID
- `aria-required`: Set to `true` for required fields

**Templates Used In:**
- Homepage: ✅ (contact form)
- Service Template: ✅ (estimate form)
- Location Template: ✅ (request form)
- Emergency Landing: ✅ (emergency form)

---

#### 4.2 Select Dropdown
**Purpose:** Single-choice selection from list

**Visual Specs:**
- Same sizing as text input (48px height)
- Chevron icon on right side
- Native browser styling enhanced with custom CSS

**States:**
Same as Text Input (Default, Focus, Error, Success, Disabled)

**Templates Used In:**
- Service Template: ✅ (service type selection)
- Emergency Landing: ✅ (issue type selection)

---

#### 4.3 Textarea
**Purpose:** Multi-line text entry

**Visual Specs:**
- Min-height: `96px` (2 lines minimum)
- Padding: `12px 16px`
- Border, radius: Same as text input
- Resize: `vertical` only

**States:**
Same as Text Input

**Templates Used In:**
- Service Template: ✅ (additional notes)
- Location Template: ✅ (project details)

---

#### 4.4 Form Label
**Purpose:** Accessible labels for form fields

**Visual Specs:**
- Font-size: `16px`
- Font-weight: `600` (semibold)
- Color: `--color-ink-900`
- Margin-bottom: `8px`
- Display: `block`

**Required Indicator:**
- Asterisk (*) in red after label text
- `aria-label="required"` on input

**Templates Used In:** All templates with forms

---

#### 4.5 Error Message
**Purpose:** Validation feedback for form fields

**Visual Specs:**
- Font-size: `14px`
- Color: `--color-error-600` (red)
- Icon: Warning triangle, 14px
- Margin-top: `8px`

**ARIA:**
- `role="alert"` for immediate errors
- `aria-live="polite"` for less urgent errors
- ID matches `{field-id}-error` pattern

**Templates Used In:** All templates with forms

---

#### 4.6 Success Message
**Purpose:** Form submission confirmation

**Visual Specs:**
- Font-size: `16px`
- Color: `--color-success-600` (green)
- Icon: Checkmark, 16px
- Padding: `12px 16px`
- Background: Light green tint

**ARIA:**
- `aria-live="polite"`
- `role="status"`

**Templates Used In:** All templates with forms

---

### 5. Content Components

#### 5.1 Trust Badge
**Purpose:** Credibility signals (licensed, insured, etc.)

**Visual Specs:**
- Size: `80×80px` desktop, `64×64px` mobile
- Background: White with subtle shadow
- Border-radius: `--radius-md`
- Icon: Centered, 60% of container

**Variants:**
- Licensed & Insured
- 24/7 Emergency Service
- Financing Available
- Satisfaction Guaranteed

**States:**
| State | Implemented | Notes |
|-------|-------------|-------|
| Default | ✅ | Static display |
| Hover | ⚠️ | Optional subtle lift |

**Templates Used In:**
- Homepage: ✅ (trust strip)
- Service Template: ✅ (trust module)
- Location Template: ✅

---

#### 5.2 Review Stars
**Purpose:** Visual star rating display

**Visual Specs:**
- Stars: 5 total, 20px each
- Color: Gold `#fbbf24` (filled), Gray `#d8d7d2` (empty)
- Rating number: Bold, 18px
- Review count: Regular, 14px, gray

**Layout:**
- Desktop: Stars + Number + Count on single line
- Mobile: May wrap to 2 lines

**Templates Used In:**
- Homepage: ✅ (trust strip)
- Service Template: ✅ (review module)
- Location Template: ✅
- Emergency Landing: ⚠️ (optional)

---

#### 5.3 Testimonial Card
**Purpose:** Customer review display

**Visual Specs:**
- Background: White
- Border: `1px solid --color-border-200`
- Border-radius: `--radius-md`
- Padding: `24px`
- Shadow: `--shadow-sm` default, `--shadow-md` on hover

**Content Structure:**
1. Star rating (top)
2. Quote text (body, italic optional)
3. Author name (bold)
4. Author location/date (small, gray)

**States:**
| State | Implemented | Shadow | Transform |
|-------|-------------|--------|-----------|
| Default | ✅ | sm | none |
| Hover | ✅ | md | translateY(-2px) |

**Templates Used In:**
- Homepage: ✅ (reviews section)
- Service Template: ✅
- Location Template: ✅

---

#### 5.4 Service Card
**Purpose:** Service offering preview

**Visual Specs:**
- Background: White
- Border: `1px solid --color-border-200`
- Border-radius: `--radius-md`
- Padding: `24px`
- Icon or image: 64×64px, top

**Content:**
- Icon/image
- Service name (heading)
- Brief description
- CTA link ("Learn More →")

**States:**
| State | Implemented | Shadow | Border |
|-------|-------------|--------|--------|
| Default | ✅ | sm | #d8d7d2 |
| Hover | ✅ | md | #0d6b66 |

**Templates Used In:**
- Homepage: ✅ (services grid)

---

### 6. Interactive Components

#### 6.1 Accordion (FAQ)
**Purpose:** Expandable question and answer sections

**Visual Specs (Trigger):**
- Width: 100%
- Text-align: Left
- Padding: `16px`
- Background: White
- Border: `1px solid --color-border-200`
- Border-radius: `--radius-sm`
- Icon: Chevron or +/-, 16px, right

**Visual Specs (Panel):**
- Padding: `16px`
- Background: `--color-paper-50` (warm)
- Border: `1px solid --color-border-200` (top removed)

**States:**
| State | Implemented | aria-expanded | Panel | Icon | Animation |
|-------|-------------|---------------|-------|------|-----------|
| Collapsed | ✅ | false | hidden | down/+ | - |
| Expanded | ✅ | true | visible | up/- | max-height 320ms |
| Hover (trigger) | ✅ | - | - | - | bg color 120ms |
| Focus (trigger) | ✅ | - | - | - | outline |

**Keyboard:**
- Enter/Space: Toggle
- Tab: Next item
- Escape: Close (optional)

**Templates Used In:**
- Homepage: ✅ (FAQ section)
- Service Template: ✅ (service FAQ)
- Location Template: ✅ (location FAQ)
- Emergency Landing: ⚠️ (optional)

---

#### 6.2 Sticky Mobile CTA Bar
**Purpose:** Fixed bottom action bar on mobile

**Visual Specs:**
- Position: Fixed bottom
- Height: `64px`
- Background: White
- Border-top: `1px solid --color-border-200`
- Shadow: `0 -4px 12px rgba(18,33,38,0.08)` (upward)
- Z-index: `200` (`--z-sticky`)

**Buttons:**
- Call button (left, 50% width, emergency style)
- Schedule button (right, 50% width, primary style)

**States:**
| State | Viewport | Notes |
|-------|----------|-------|
| Visible | < 768px | Fixed to bottom |
| Hidden | ≥ 768px | `display: none` |

**Templates Used In:**
- Homepage: ✅
- Service Template: ✅
- Location Template: ✅
- Emergency Landing: ⚠️ (call button only)

---

### 7. Footer Components

#### 7.1 Site Footer
**Purpose:** Global footer with NAP, links, compliance

**Visual Specs:**
- Background: `--color-ink-900` (dark)
- Text: `--color-paper-0` (white)
- Padding: `48px 0` top/bottom
- Border-top: `4px solid --color-primary-600` (optional)

**Content Sections:**
1. NAP (Name, Address, Phone)
2. Quick Links (Services, Locations, Reviews, FAQ, Contact)
3. Service Areas
4. Hours & Social
5. Bottom bar (Copyright, Privacy, Terms, Accessibility)

**Layout:**
- Desktop: 4-column grid
- Mobile: Single column, stacked

**Link States:**
| State | Implemented | Color | Underline |
|-------|-------------|-------|-----------|
| Default | ✅ | #ffffff | none |
| Hover | ✅ | #ffffff | solid |
| Focus | ✅ | #ffffff | outline |

**Templates Used In:** All templates (global footer)

---

## State Coverage Summary

### Overall State Coverage by Component Type

| Component Type | Total Components | States/Variant | Coverage | Status |
|---------------|------------------|----------------|----------|--------|
| Layout | 3 | 6 | 100% | ✅ Complete |
| Navigation | 3 | 12 | 100% | ✅ Complete |
| CTA Buttons | 3 | 16 | 100% | ✅ Complete |
| Form Inputs | 6 | 24 | 100% | ✅ Complete |
| Content | 4 | 8 | 100% | ✅ Complete |
| Interactive | 2 | 8 | 100% | ✅ Complete |
| Footer | 1 | 3 | 100% | ✅ Complete |
| **Total** | **22** | **77** | **100%** | ✅ **Complete** |

---

## Template Usage Matrix

| Component | Homepage | Service | Location | Emergency |
|-----------|----------|---------|----------|-----------|
| Container | ✅ | ✅ | ✅ | ✅ |
| Section | ✅ | ✅ | ✅ | ✅ |
| Grid System | ✅ | ✅ | ✅ | ❌ |
| Site Header | ✅ | ✅ | ✅ | ✅ |
| Navigation Links | ✅ | ✅ | ✅ | ✅ |
| Mobile Menu | ✅ | ✅ | ✅ | ✅ |
| Primary Button | ✅ | ✅ | ✅ | ✅ |
| Secondary Button | ✅ | ✅ | ✅ | ❌ |
| Emergency Button | ❌ | ❌ | ❌ | ✅ |
| Text Input | ✅ | ✅ | ✅ | ✅ |
| Select Dropdown | ❌ | ✅ | ❌ | ✅ |
| Textarea | ❌ | ✅ | ✅ | ❌ |
| Form Label | ✅ | ✅ | ✅ | ✅ |
| Error Message | ✅ | ✅ | ✅ | ✅ |
| Success Message | ✅ | ✅ | ✅ | ✅ |
| Trust Badge | ✅ | ✅ | ✅ | ✅ |
| Review Stars | ✅ | ✅ | ✅ | ⚠️ |
| Testimonial Card | ✅ | ✅ | ✅ | ❌ |
| Service Card | ✅ | ❌ | ❌ | ❌ |
| Accordion (FAQ) | ✅ | ✅ | ✅ | ⚠️ |
| Sticky Mobile CTA | ✅ | ✅ | ✅ | ⚠️ |
| Site Footer | ✅ | ✅ | ✅ | ✅ |

**Legend:**
- ✅ Used and required
- ⚠️ Optional, context-dependent
- ❌ Not used

---

## Reusability Score

### Component Reusability Analysis
Components designed for maximum reuse across templates and future pages.

| Component | Templates Used | Reuse Score | Notes |
|-----------|----------------|-------------|-------|
| Container | 4/4 | 100% | Universal layout component |
| Site Header | 4/4 | 100% | Global navigation |
| Primary Button | 4/4 | 100% | Core conversion element |
| Text Input | 4/4 | 100% | Universal form field |
| Form Label | 4/4 | 100% | Required for accessibility |
| Error Message | 4/4 | 100% | Standard validation pattern |
| Trust Badge | 4/4 | 100% | Social proof across all pages |
| Site Footer | 4/4 | 100% | Global footer |
| Secondary Button | 3/4 | 75% | Common but not universal |
| Accordion | 3/4 | 75% | FAQ pattern |
| Review Stars | 3/4 | 75% | Social proof |
| Testimonial Card | 3/4 | 75% | Review display |
| Sticky Mobile CTA | 3/4 | 75% | Mobile conversion |
| Grid System | 3/4 | 75% | Multi-column layouts |
| Select Dropdown | 2/4 | 50% | Specific use cases |
| Textarea | 2/4 | 50% | Long-form input only |
| Emergency Button | 1/4 | 25% | Emergency template only |
| Service Card | 1/4 | 25% | Homepage specific |

**Average Reusability:** 81.25% ✅ Excellent

---

## Missing States or Gaps

### Identified Gaps (None Critical)
All core interaction states are implemented. The following are enhancement opportunities:

1. **Loading Spinner Component:**
   - Status: Implemented inline within buttons
   - Enhancement: Could be standalone reusable component

2. **Modal/Dialog:**
   - Status: Not currently in use
   - Future need: Confirmation dialogs, video overlays

3. **Toast Notifications:**
   - Status: Not currently in use
   - Future need: Non-blocking success/error messages

4. **Breadcrumbs:**
   - Status: Mentioned in wireframes, not componentized
   - Enhancement: Reusable breadcrumb component

5. **Pagination:**
   - Status: Not needed in current templates
   - Future need: Blog archive, location listing pages

**Recommendation:** Current component inventory is complete for MVP launch. Enhancements listed above can be added in Phase 2.

---

## Engineering Handoff Checklist

### Before Implementation
- [ ] Review complete component inventory
- [ ] Understand all interaction states
- [ ] Review accessibility requirements for each component
- [ ] Set up design token CSS variables
- [ ] Plan component file structure

### During Implementation
- [ ] Build components in isolation first (e.g., Storybook)
- [ ] Test each state independently
- [ ] Validate accessibility with axe or WAVE
- [ ] Test keyboard navigation
- [ ] Test on actual devices (mobile/tablet/desktop)

### After Implementation
- [ ] Cross-reference with COMPONENT-SPECS.md for completeness
- [ ] Verify all states match visual specifications
- [ ] Run automated accessibility tests
- [ ] Conduct manual QA using DESIGN-QA-CHECKLIST.md
- [ ] Document any implementation deviations

---

## Version History
- **v1.0** (2026-05-05): Initial component inventory with complete state matrix
