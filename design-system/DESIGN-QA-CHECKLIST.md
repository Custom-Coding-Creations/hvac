# Design QA Checklist v2

**Version:** 2.0  
**Last Updated:** 2026-05-05  
**Purpose:** Verify build fidelity and design system compliance  
**Status:** Production Ready

## Overview
This checklist ensures that implemented templates match design specifications and meet quality standards for accessibility, performance, and usability. Use this document during build review and before launch approval.

---

## 1. Design Token Compliance

### Color Usage
- [ ] All colors use CSS custom property tokens from TOKENS.md
- [ ] No hard-coded hex values in component styles (except in :root definition)
- [ ] Primary brand color (`--color-primary-600`) used consistently for CTAs
- [ ] Accent color (`--color-accent-600`) used for secondary actions
- [ ] Feedback colors (success, error, warning) used appropriately
- [ ] Background color tokens (`--color-paper-*`) applied to sections
- [ ] Text color tokens (`--color-ink-*`) applied to typography
- [ ] Border color tokens (`--color-border-*`) used for dividers and outlines

**Validation Method:** Inspect CSS files, search for `#` followed by hex values outside `:root`

### Typography Compliance
- [ ] Font families use `--font-family-display` for headings
- [ ] Font families use `--font-family-body` for body text
- [ ] Font sizes use token scale (`--font-size-100` through `--font-size-700`)
- [ ] Line heights use tokens (`--line-height-tight`, `--line-height-body`, etc.)
- [ ] Font weights use tokens (`--font-weight-normal`, `--font-weight-semibold`, etc.)
- [ ] Letter spacing uses tokens where applicable
- [ ] Responsive typography implemented with clamp() or media queries
- [ ] No arbitrary font-size pixel values (e.g., `font-size: 17px;`)

**Validation Method:** Inspect rendered text, verify font stack and sizes match tokens

### Spacing Compliance
- [ ] All padding values use spacing tokens (`--space-1` through `--space-12`)
- [ ] All margin values use spacing tokens
- [ ] Section spacing uses `--space-6` or `--space-7` for vertical rhythm
- [ ] Component internal spacing uses `--space-3` to `--space-5`
- [ ] No arbitrary spacing values (e.g., `margin: 13px;`)
- [ ] Consistent spacing patterns across similar components
- [ ] Mobile and desktop spacing scales appropriately

**Validation Method:** Inspect element spacing in DevTools, verify token usage

### Border Radius and Elevation
- [ ] Border radius uses tokens (`--radius-sm`, `--radius-md`, `--radius-lg`)
- [ ] Shadows use elevation tokens (`--shadow-sm`, `--shadow-md`, etc.)
- [ ] Hover states increase elevation consistently
- [ ] Focus states use `--shadow-focus` in addition to outline
- [ ] No one-off radius or shadow values
- [ ] Cards use `--radius-md` consistently
- [ ] Buttons use `--radius-sm` consistently

**Validation Method:** Inspect border-radius and box-shadow properties

### Motion and Timing
- [ ] Transitions use duration tokens (`--motion-fast`, `--motion-base`, `--motion-slow`)
- [ ] Easing functions use tokens (`--easing-standard`, `--easing-entrance`, etc.)
- [ ] Hover transitions use `--motion-fast` (120ms)
- [ ] Panel animations use `--motion-slow` (320ms)
- [ ] No arbitrary transition durations (e.g., `transition: 250ms;`)
- [ ] `prefers-reduced-motion` respected for users who request it
- [ ] No auto-playing animations on page load

**Validation Method:** Inspect transition and animation properties

### Exceptions Log
Document any approved deviations from token system:

| Component | Property | Value | Reason | Approved By | Date |
|-----------|----------|-------|--------|-------------|------|
| - | - | - | - | - | - |

---

## 2. Component State Validation

### Header Component
- [ ] **Default state:** Logo, navigation, and CTAs visible on desktop
- [ ] **Compact on scroll:** Header reduces height after scrolling (desktop only)
- [ ] **Mobile variant:** Hamburger menu replaces horizontal navigation (< 768px)
- [ ] **Mobile menu open:** Panel slides in, overlay appears, focus trapped
- [ ] **Focus visible:** All navigation links show focus indicator
- [ ] **Sticky behavior:** Header remains fixed at top on scroll
- [ ] **Skip link:** "Skip to main content" link visible on focus

**Test:** Load page, scroll down, toggle mobile menu, tab through navigation

### Navigation Links
- [ ] **Default state:** Link color is `--color-accent-600`
- [ ] **Hover state:** Color darkens to `--color-accent-700`, underline appears
- [ ] **Focus state:** Outline visible with 2px offset
- [ ] **Active state:** Current page link styled differently (optional)
- [ ] **Mobile:** Links stack vertically in mobile menu
- [ ] **Keyboard:** All links reachable via Tab

**Test:** Hover and focus each link, verify color and outline

### CTA Buttons
- [ ] **Primary default:** Red background (`--color-primary-600`), white text
- [ ] **Primary hover:** Background darkens to `--color-primary-700`
- [ ] **Primary focus:** Outline and shadow visible
- [ ] **Primary active:** Background darkens to `--color-primary-800`, subtle shift down
- [ ] **Primary disabled:** Gray background, muted text, not interactive
- [ ] **Primary loading:** Spinner visible, `aria-busy="true"` set
- [ ] **Secondary default:** Transparent background, teal border and text
- [ ] **Secondary hover:** Border and text darken
- [ ] **Emergency default:** Dark background, white text, phone icon (if applicable)
- [ ] **Emergency hover:** Background darkens

**Test:** Interact with each button variant, verify visual states

### Form Fields
- [ ] **Default state:** White background, gray border, normal height (48px)
- [ ] **Focus state:** Border changes to teal (`--color-accent-600`), outline visible
- [ ] **Error state:** Red border (`--color-error-600`), light red background tint, error text visible
- [ ] **Success state:** Green border (`--color-success-600`), checkmark icon (optional)
- [ ] **Disabled state:** Gray background, muted text, not interactive
- [ ] **Placeholder text:** Visible and readable (sufficient contrast)
- [ ] **Required indicator:** Asterisk (*) in red after label

**Test:** Focus, blur with invalid data, blur with valid data, submit form

### Form Validation
- [ ] **On blur:** Field validates when user leaves field
- [ ] **On submit:** Entire form validates, focus moves to first error
- [ ] **Error messages:** Clear, specific, actionable (not just "Invalid")
- [ ] **Error announcement:** Screen reader announces errors via `aria-live`
- [ ] **Error linking:** Errors linked to fields via `aria-describedby`
- [ ] **Success message:** Appears after successful submission
- [ ] **Loading state:** Form shows `aria-busy="true"` during submission

**Test:** Submit with empty fields, submit with invalid data, submit with valid data

### FAQ Accordion
- [ ] **Collapsed default:** Panel hidden, `aria-expanded="false"`
- [ ] **Expanded state:** Panel visible, `aria-expanded="true"`, icon rotated
- [ ] **Hover state:** Trigger background changes color
- [ ] **Focus state:** Trigger shows visible outline
- [ ] **Keyboard:** Enter and Space toggle expansion
- [ ] **Animation:** Panel expands/collapses smoothly (320ms)
- [ ] **Multiple panels:** Only one open at a time (or multiple, depending on design)

**Test:** Click and keyboard-navigate accordion items

### Trust Modules
- [ ] **Default state:** Cards visible with proper spacing
- [ ] **Hover state:** Cards elevate with increased shadow (optional)
- [ ] **Mobile layout:** Cards stack vertically (< 768px)
- [ ] **Icons/badges:** Display correctly at all viewport sizes
- [ ] **Review stars:** Correct number of stars, proper color (gold)

**Test:** Resize viewport, verify card layout changes

### Footer
- [ ] **Background:** Dark background (`--color-ink-900`)
- [ ] **Text color:** White text (`--color-paper-0`), sufficient contrast
- [ ] **Links:** Visible and interactive, focus indicators present
- [ ] **NAP information:** Name, address, phone clearly visible
- [ ] **Mobile layout:** Sections stack vertically (< 768px)
- [ ] **Copyright:** Current year displayed

**Test:** Inspect footer on mobile and desktop, verify link hover/focus

### Sticky Mobile CTA
- [ ] **Mobile only:** Visible on viewports < 768px
- [ ] **Hidden on desktop:** Not visible on viewports ≥ 768px
- [ ] **Fixed position:** Stays at bottom of viewport on scroll
- [ ] **Two buttons:** Call and schedule buttons equal width
- [ ] **Touch targets:** Each button ≥ 44px height
- [ ] **Z-index:** Appears above content but below modals

**Test:** View on mobile device, scroll page, tap both buttons

---

## 3. Accessibility Validation

### Color Contrast (WCAG 2.1 AA)
- [ ] All normal text meets 4.5:1 minimum contrast ratio
- [ ] Large text (≥18pt or ≥14pt bold) meets 3:1 minimum
- [ ] Button text on backgrounds meets 4.5:1 minimum
- [ ] Link text on backgrounds meets 4.5:1 minimum
- [ ] UI component borders meet 3:1 minimum (interactive elements)
- [ ] Error messages meet 4.5:1 minimum contrast
- [ ] Success messages meet 4.5:1 minimum contrast
- [ ] Footer text (white on dark) meets 4.5:1 minimum

**Test:** Use WebAIM Contrast Checker or browser DevTools contrast tool

### Keyboard Navigation
- [ ] All interactive elements reachable via Tab key
- [ ] Tab order is logical (left to right, top to bottom)
- [ ] Shift+Tab reverses navigation correctly
- [ ] Focus indicators visible on all interactive elements
- [ ] Focus outline minimum 2px width with 2px offset
- [ ] No keyboard traps (can always move forward/backward)
- [ ] Skip link visible on focus, allows bypassing header
- [ ] Mobile menu traps focus while open
- [ ] Escape key closes mobile menu and modals
- [ ] Enter/Space activates buttons and links

**Test:** Navigate entire page using only keyboard, no mouse

### ARIA and Semantics
- [ ] One `<h1>` per page, describes primary topic
- [ ] Heading hierarchy is logical (no skipped levels)
- [ ] Landmark regions present: header, nav, main, footer
- [ ] Navigation has `aria-label="Primary"` or similar
- [ ] Form fields have associated labels via `for` attribute
- [ ] Required fields marked with `required` and `aria-required="true"`
- [ ] Error messages linked via `aria-describedby`
- [ ] Live regions use `aria-live="polite"` or `"assertive"`
- [ ] Mobile menu button has `aria-expanded` and `aria-controls`
- [ ] Accordion triggers have `aria-expanded` and `aria-controls`
- [ ] Icon-only buttons have `aria-label`
- [ ] Loading states have `aria-busy="true"`
- [ ] Images have appropriate alt text (or `alt=""` if decorative)

**Test:** Inspect HTML, use axe DevTools or WAVE browser extension

### Screen Reader Testing
- [ ] Test with NVDA (Windows) or VoiceOver (macOS)
- [ ] Navigate by headings (H key in NVDA/JAWS)
- [ ] Navigate by landmarks (D key in NVDA/JAWS)
- [ ] Form labels announced correctly
- [ ] Error messages announced when triggered
- [ ] Success messages announced after submission
- [ ] Button purposes clear from announced text
- [ ] Image alt text provides sufficient context
- [ ] Mobile menu state changes announced

**Test:** Use screen reader to navigate page and fill out form with eyes closed

### Touch Targets (Mobile)
- [ ] All buttons minimum 44×44 CSS pixels
- [ ] Form inputs minimum 48px height
- [ ] Mobile nav toggle minimum 44×44px
- [ ] Accordion triggers minimum 44px height
- [ ] Link text with adequate line-height for tapping
- [ ] Sticky mobile CTA buttons minimum 44px height
- [ ] Adequate spacing between adjacent touch targets

**Test:** Test on actual mobile device, verify buttons easy to tap

---

## 4. Responsive Design Validation

### Breakpoint Testing
Test at each major breakpoint:

#### 360px (Minimum Mobile)
- [ ] No horizontal scroll
- [ ] All text readable without zooming
- [ ] Touch targets ≥ 44×44px
- [ ] Single-column layout
- [ ] Images scale to container width
- [ ] Forms use full width with single-column fields
- [ ] Mobile menu accessible and functional
- [ ] Sticky mobile CTA visible and functional

#### 768px (Tablet)
- [ ] Layout transitions to multi-column where appropriate
- [ ] Navigation switches from mobile menu to horizontal desktop nav
- [ ] Two-column content grids display correctly
- [ ] Sticky mobile CTA hidden, header CTAs visible
- [ ] Touch targets still accessible
- [ ] Cards display in 2-column grid

#### 1024px (Desktop)
- [ ] Three-column layouts display correctly
- [ ] Header fully expanded with all CTAs visible
- [ ] Service grids and feature sections use multiple columns
- [ ] Container max-width applied (1200px)
- [ ] Typography scales up appropriately
- [ ] All desktop-specific features visible

#### 1440px+ (Large Desktop)
- [ ] Container remains centered with max-width
- [ ] No excessive white space on sides
- [ ] Typography at optimal sizes
- [ ] Images maintain quality and aspect ratio
- [ ] Layout doesn't break on ultra-wide screens

**Test:** Use browser DevTools responsive mode, test on actual devices

### Mobile-First Implementation
- [ ] Base styles target mobile (360px+)
- [ ] Media queries use `min-width` for progressive enhancement
- [ ] Layout expands from 1-column → 2-column → 3-column
- [ ] No `max-width` media queries (except for hiding mobile-only elements)
- [ ] Performance optimized for mobile (smaller images, minimal JS)

**Test:** Inspect CSS media queries, verify mobile-first approach

### Content Reflow
- [ ] At 200% zoom, no horizontal scroll required
- [ ] At 400% zoom, mobile layout triggered
- [ ] Text wraps appropriately at all zoom levels
- [ ] No content loss at any zoom level
- [ ] Images scale proportionally

**Test:** Zoom to 200% and 400%, verify no horizontal scroll

---

## 5. Template Fidelity

### Homepage Template
- [ ] Hero section with headline, subheadline, primary and secondary CTAs
- [ ] Trust strip with badges and review score
- [ ] Services grid with minimum 3 service cards
- [ ] Financing module with pre-qualify CTA
- [ ] Reviews block with testimonial cards
- [ ] FAQ accordion with minimum 5 questions
- [ ] Footer with NAP, links, hours, compliance links
- [ ] Sticky mobile CTA (mobile only)
- [ ] Minimum 2 conversion paths present

**Test:** Compare to wireframe specs in ux/WIREFRAME-SPECS-v1.md

### Service Template
- [ ] Breadcrumb navigation
- [ ] Service hero with issue-specific headline and CTA
- [ ] Problem symptoms section
- [ ] Service process timeline or steps
- [ ] Trust/review module
- [ ] Financing CTA block
- [ ] Inline estimate form (short or long form)
- [ ] FAQ accordion specific to service
- [ ] Footer
- [ ] Minimum 2 conversion paths present

**Test:** Compare to wireframe specs

### Location Template
- [ ] Header with local proof (e.g., "Serving Syracuse since 2010")
- [ ] Service availability by neighborhood
- [ ] Local testimonials or reviews
- [ ] Click-to-call strip with local phone number
- [ ] Location-specific FAQ
- [ ] Inline request form
- [ ] Footer
- [ ] Minimum 2 conversion paths present

**Test:** Compare to wireframe specs

### Emergency Landing Template
- [ ] Minimal header with emergency call CTA
- [ ] Urgency hero with response-time promise (e.g., "24/7 Emergency Response")
- [ ] One-screen emergency short form (visible without scrolling)
- [ ] Service area validation or coverage map
- [ ] Trust and guarantee strip
- [ ] Backup CTA (alternative to form)
- [ ] Footer
- [ ] Minimum 2 conversion paths present (call + form)

**Test:** Compare to wireframe specs

---

## 6. Conversion Architecture Validation

### Conversion Entry Points
Verify each template has minimum 2 distinct conversion paths:

#### Homepage
- [ ] Entry point 1: Hero schedule CTA
- [ ] Entry point 2: Sticky click-to-call (desktop) or mobile CTA bar
- [ ] Entry point 3: Trust module CTA or inline form
- [ ] CTAs clearly visible and distinct from each other

#### Service Template
- [ ] Entry point 1: Above-fold request estimate CTA
- [ ] Entry point 2: In-content service CTA or financing CTA
- [ ] Entry point 3: Sticky call CTA or inline form
- [ ] CTAs placed at logical decision points

#### Location Template
- [ ] Entry point 1: Local availability CTA
- [ ] Entry point 2: Click-to-call with local number
- [ ] Entry point 3: Review module CTA or request form

#### Emergency Template
- [ ] Entry point 1: Urgent call CTA (prominent, above fold)
- [ ] Entry point 2: Emergency short form (visible without scrolling)
- [ ] Entry point 3: Sticky call CTA or backup CTA

**Test:** Identify and count conversion CTAs on each template

### CTA Hierarchy
- [ ] Primary action is most visually prominent (size, color, position)
- [ ] Secondary action is visible but less emphasized
- [ ] No more than 2-3 CTAs competing for attention in same view
- [ ] Call CTAs use `tel:` links for one-tap dialing on mobile
- [ ] All CTAs have `data-track` attributes for analytics
- [ ] CTAs use action-oriented language ("Schedule Now", "Get Estimate")

**Test:** Review CTA placement and visual hierarchy

### Form Architecture
- [ ] Short form present for quick captures (4-5 fields max)
- [ ] Long form available where appropriate (optional fields)
- [ ] Emergency pages default to short form only
- [ ] Forms validate on blur and on submit
- [ ] Success messages clear and actionable
- [ ] Forms accessible via keyboard

**Test:** Submit both short and long form variants

### Persistent CTA Strategy
- [ ] **Desktop:** Sticky header contains call and schedule CTA
- [ ] **Mobile:** Sticky bottom bar with call and schedule buttons
- [ ] In-content CTA blocks appear every major section
- [ ] CTAs remain accessible while scrolling
- [ ] Sticky elements don't obscure content

**Test:** Scroll page, verify CTAs remain visible

---

## 7. Performance and Optimization

### Asset Optimization
- [ ] Images compressed and optimized (WebP format recommended)
- [ ] Images use `loading="lazy"` attribute for below-fold content
- [ ] Images have explicit width and height to prevent layout shift
- [ ] No unnecessarily large images (size appropriate for display)
- [ ] Web fonts preloaded or use `font-display: swap`
- [ ] CSS minified for production
- [ ] JavaScript minified for production
- [ ] No unused CSS or JavaScript

**Test:** Run Lighthouse audit, check Network tab in DevTools

### Core Web Vitals Targets
- [ ] **LCP (Largest Contentful Paint):** ≤ 2.5s (75th percentile)
- [ ] **CLS (Cumulative Layout Shift):** ≤ 0.10
- [ ] **INP (Interaction to Next Paint):** ≤ 200ms
- [ ] **FCP (First Contentful Paint):** ≤ 1.8s

**Test:** Run Lighthouse or PageSpeed Insights

### Motion and Animation
- [ ] No auto-playing animations on page load (CLS risk)
- [ ] Transitions smooth and performant (60fps)
- [ ] `prefers-reduced-motion` media query respected
- [ ] Animation durations use token values
- [ ] No excessive or distracting animations

**Test:** Check for animations, enable reduced motion in OS settings

---

## 8. Cross-Browser and Device Testing

### Desktop Browsers
- [ ] **Chrome (latest):** All features functional
- [ ] **Firefox (latest):** All features functional
- [ ] **Safari (latest):** All features functional
- [ ] **Edge (latest):** All features functional

**Test:** Manual testing in each browser

### Mobile Browsers
- [ ] **iOS Safari (iPhone):** Touch interactions, forms, navigation work
- [ ] **Chrome Android:** All features functional
- [ ] **Samsung Internet:** All features functional

**Test:** Test on actual devices or BrowserStack

### Devices
- [ ] **iPhone SE (375px width):** Layout intact, no horizontal scroll
- [ ] **iPhone 12/13 (390px):** Optimal mobile experience
- [ ] **iPad (768px):** Tablet layout displays correctly
- [ ] **Desktop (1440px):** Full desktop layout

**Test:** Use actual devices or device labs

---

## 9. Analytics and Tracking

### Event Tracking
- [ ] All CTAs have `data-track` attributes
- [ ] Event names follow consistent naming convention
- [ ] Form submissions tracked
- [ ] Click-to-call links tracked
- [ ] Navigation clicks tracked
- [ ] Analytics implementation documented in IMPLEMENTATION-GUIDE.md

**Test:** Inspect elements, verify data-track attributes present

### Naming Convention
Standard format: `{action}_{location/context}`

Examples:
- `schedule_hero`
- `call_header`
- `form_submit_homepage`
- `estimate_service_cta`

**Test:** Review all data-track values for consistency

---

## 10. Content and Copy

### Required Content
- [ ] Business name, address, phone (NAP) in footer
- [ ] Service hours displayed
- [ ] Coverage areas listed
- [ ] Privacy policy link present
- [ ] Terms of service link present (if applicable)
- [ ] Accessibility statement link present (if applicable)

**Test:** Review footer and compliance links

### Copy Quality
- [ ] Headlines clear and benefit-oriented
- [ ] CTA text action-oriented ("Schedule Now", not "Click Here")
- [ ] Error messages helpful and specific
- [ ] No Lorem Ipsum placeholder text in production
- [ ] Spelling and grammar correct

**Test:** Manual content review

---

## 11. Security and Privacy

### Form Security
- [ ] Forms use proper input types (`tel`, `email`, `text`)
- [ ] Input validation implemented (client-side)
- [ ] No sensitive data logged to console
- [ ] HTTPS used for all connections (production)
- [ ] No inline scripts (CSP compatible)

**Test:** Inspect form submissions, check browser console

### Privacy
- [ ] Privacy policy linked and accessible
- [ ] Cookie consent (if applicable)
- [ ] No third-party tracking without disclosure (GDPR/CCPA)

**Test:** Review privacy policy and consent mechanisms

---

## 12. Final Pre-Launch Checks

### Automated Testing
- [ ] **Lighthouse:** Accessibility score ≥ 95
- [ ] **Lighthouse:** Performance score ≥ 85
- [ ] **Lighthouse:** Best Practices score ≥ 95
- [ ] **Lighthouse:** SEO score ≥ 95
- [ ] **axe DevTools:** 0 violations
- [ ] **WAVE:** 0 errors
- [ ] **Nu HTML Checker:** Valid HTML5

**Test:** Run all automated tools

### Manual Review
- [ ] All templates reviewed by designer
- [ ] All templates reviewed by developer
- [ ] All templates tested by QA
- [ ] Accessibility reviewed by specialist (if available)
- [ ] Content reviewed by stakeholder
- [ ] Legal/compliance review (if required)

**Test:** Conduct stakeholder review

### Documentation
- [ ] All components documented in frontend/components/README.md
- [ ] Implementation guide updated (frontend/IMPLEMENTATION-GUIDE.md)
- [ ] Design system docs current (design-system/*.md)
- [ ] UX artifacts current (ux/*.md)
- [ ] QA evidence logged (qa/*.md)

**Test:** Review all documentation files

---

## Sign-Off

### QA Approval
- **Tester Name:** _______________________
- **Date:** _______________________
- **Build Version:** _______________________
- **Blockers Found:** ___ (if > 0, do not approve)
- **Signature:** _______________________

### Design Approval
- **Designer Name:** _______________________
- **Date:** _______________________
- **Fidelity Score:** ___/10 (must be ≥ 9.0)
- **Signature:** _______________________

### Stakeholder Approval
- **Stakeholder Name:** _______________________
- **Date:** _______________________
- **Approval Status:** [ ] Approved [ ] Conditional [ ] Rejected
- **Signature:** _______________________

---

## Version History
- **v2.0** (2026-05-05): Comprehensive production-ready QA checklist
- **v1.0** (initial): Basic validation checklist
