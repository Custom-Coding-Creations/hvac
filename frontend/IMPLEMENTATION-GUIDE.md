# Frontend Implementation Guide

## Scope
This package provides reusable frontend primitives and four core templates:
- homepage
- service template
- location template
- emergency landing template

## Shared Systems
- CSS tokens and primitives: `frontend/assets/css/system.css`
- Interaction behavior: `frontend/assets/js/system.js`
- Reusable component conventions: `frontend/components/README.md`

## File Structure

```
frontend/
├── assets/
│   ├── css/
│   │   └── system.css           # All design tokens and base styles
│   └── js/
│       └── system.js             # Form validation, nav, accordion logic
├── components/
│   └── README.md                 # Component patterns and HTML examples
├── templates/
│   ├── homepage.html             # Primary landing page template
│   ├── service-template.html      # Service detail page template
│   ├── location-template.html     # Local service area page template
│   └── emergency-landing.html     # Emergency routing page template
├── IMPLEMENTATION-GUIDE.md        # This file
└── README.md                      # Deprecated - use IMPLEMENTATION-GUIDE.md
```

## Getting Started

1. **Copy a template** closest to your use case from `frontend/templates/`
2. **Replace content** but keep all class names and structure intact
3. **Use only existing CSS classes** from `system.css` before adding custom styles
4. **Preserve all interactive patterns** (forms, nav, accordions) exactly as-is

## How To Extend Templates

### Adding a New Section
1. Copy an existing `<section class="section">` block
2. Add a unique `id` attribute for internal linking
3. Maintain the `.container` wrapper
4. Reuse `.grid-2` or `.grid-3` for layout

### Creating New Component Variants
1. If you need a new color, size, or state, add it to design-system/TOKENS.md first
2. Create a new CSS class that uses the token variable
3. Add the class to your template
4. Document in frontend/components/README.md with an example

### Adding Form Fields
1. Always use the `.form-field` wrapper structure
2. Set required attributes on input/select/textarea
3. Create corresponding error spans with id=`{field-id}-error`
4. Use `type="tel"` for phone, `type="email"` for email, `type="text"` for name
5. Include `aria-live="polite"` on error span for screen reader announcement

## Conversion Components

### Forms (data-validate="true")
```html
<form data-validate="true" novalidate>
  <div class="form-field">
    <label for="contact-name">Full Name</label>
    <input id="contact-name" type="text" name="name" required />
    <span class="form-error" id="contact-name-error" aria-live="polite"></span>
  </div>
  <button class="btn btn-primary" type="submit">Submit</button>
  <p class="form-success" aria-live="polite"></p>
</form>
```

System.js handles:
- Required field validation
- Error message population
- aria-invalid setting/clearing
- aria-busy state during "submit" simulation
- Success message display on valid submit
- Focus management to first invalid field

### CTA Tracking (data-track attribute)
```html
<a class="btn btn-primary" href="#target" data-track="button_name_action">Submit</a>
```

System.js logs all data-track values. Replace `console.log` with your analytics provider:
```javascript
// In system.js, replace the tracking section:
document.querySelectorAll("[data-track]").forEach(function (el) {
  el.addEventListener("click", function () {
    const eventName = el.getAttribute("data-track");
    // Call your analytics provider:
    gtag('event', eventName);  // Google Analytics
    // OR
    _leq.push(['track', eventName]);  // LeadExec
  });
});
```

### Click-to-Call (tel: links)
```html
<a class="btn btn-emergency" href="tel:+13155550100" data-track="call_emergency">Call Now</a>
```

Works on mobile and desktop. Desktop users may be prompted to choose their calling app.

## Accessibility Requirements

### Required on Every Template
- ✅ Skip link pointing to `#main` content
- ✅ Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`
- ✅ One and only one `<h1>` element
- ✅ Logical heading hierarchy (h1 > h2 > h3, no gaps)
- ✅ Explicit labels for all form controls using `for` attribute
- ✅ Error messages with aria-live="polite" or aria-describedby
- ✅ Focus visible styles on all interactive elements
- ✅ Minimum 2:1 contrast on interactive text
- ✅ Minimum 44x44px touch targets

### Keyboard Navigation
- Tab moves focus through interactive elements
- Shift+Tab reverses
- Enter activates buttons
- Space toggles checkboxes/accordions
- Escape closes mobile nav and other overlays
- Arrow keys (optional) in selects and combo boxes

### Screen Reader Testing
Test with at least one:
- NVDA (Windows, free)
- JAWS (Windows, paid)
- VoiceOver (macOS built-in)
- TalkBack (Android built-in)

## Responsive Requirements

### Breakpoints
- **360px**: Mobile phone (target minimum)
- **768px**: Tablet portrait, small laptop
- **1024px**: Tablet landscape, desktop
- **1440px**: Large desktop, widescreen

### Mobile-First Approach
1. Default styles are mobile-first
2. `@media (min-width: 768px)` adds tablet styles
3. Layout goes: 1-column → 2-column → 3-column

### Testing Checklist
- [ ] Viewport 360px: single column, all text readable, touch targets ≥44px
- [ ] Viewport 768px: 2-column layouts, nav visible
- [ ] Viewport 1024px: 3-column grids, full layout
- [ ] Viewport 1440px: max-width container centered
- [ ] No horizontal scroll at any viewport
- [ ] Images scale responsively without distortion
- [ ] Font sizes remain readable at all sizes

## Performance Optimization

### Critical Path CSS
Extract and inline styles for above-the-fold content:
```html
<style>
  /* Critical path styles for header, hero, form */
  body { margin: 0; font-family: sans-serif; }
  .site-header { /* ... */ }
  .hero { /* ... */ }
</style>
<link rel="stylesheet" href="system.css">
```

### Web Vitals Targets
- **LCP (Largest Contentful Paint)**: ≤ 2.5s (p75)
- **CLS (Cumulative Layout Shift)**: ≤ 0.10 (p75)
- **INP (Interaction to Next Paint)**: ≤ 200ms (p75)
- **FCP (First Contentful Paint)**: ≤ 1.8s

### Image Optimization
```html
<!-- Use responsive images -->
<img src="image.jpg" alt="Descriptive text" loading="lazy" />

<!-- Or picture element for art direction -->
<picture>
  <source media="(min-width: 768px)" srcset="image-lg.jpg">
  <img src="image-sm.jpg" alt="Alt text">
</picture>
```

### Font Loading
```html
<!-- Use system fonts or preload web fonts -->
<link rel="preload" as="font" href="font.woff2" type="font/woff2" crossorigin>

<!-- Or use font-display: swap to show fallback first -->
<style>
  @font-face {
    font-family: "Custom";
    src: url("font.woff2") format("woff2");
    font-display: swap;
  }
</style>
```

## Browser Support

### Desktop
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Mobile
- iOS Safari 14+
- Chrome Android 90+
- Samsung Internet 14+

### Polyfills Needed
- None for current templates (uses standard HTML/CSS)
- If adding ES6+, use @babel/preset-env for transpilation

## Common Patterns

### Conditional Content Visibility
Use CSS and data attributes instead of JavaScript:
```html
<section data-show="desktop" class="section-desktop">
  <!-- Shows only on desktop -->
</section>

<style>
  @media (max-width: 767px) {
    [data-show="desktop"] { display: none; }
  }
</style>
```

### Multiple Conversion Paths
Ensure every template has at least 2 distinct user journeys:
1. Form entry (email/phone capture)
2. Click-to-call (immediate phone contact)

Optional third path: CTA to chat, scheduling widget, etc.

### Analytics Event Structure
Standard tracking event names:
- `{action}_click_{location}` for link clicks
- `{action}_start_{location}` for form starts
- `{action}_submit_{page}` for form submissions
- `{action}_view_{location}` for section views

Examples:
- `schedule_click_header`
- `call_click_mobile`
- `form_submit_homepage`

## Troubleshooting

### Forms Not Validating
- Check that form has `data-validate="true"` attribute
- Verify input fields have `required` attribute
- Ensure error span ids match pattern: `{field-id}-error`
- Check console for JavaScript errors

### Navigation Not Closing on Mobile
- Verify nav element has `id="primary-nav"`
- Check that nav toggle has `aria-controls="primary-nav"`
- Ensure system.js is loaded before page render
- Test in actual browser (not just emulation)

### Styles Not Applying
- Confirm system.css is linked correctly
- Check for typos in class names
- Verify CSS is loaded before inline styles override it
- Use browser DevTools inspector to debug cascade

### Accessibility Issues
- Use axe DevTools browser extension to scan
- Test keyboard navigation manually
- Test with screen reader (even briefly)
- Check color contrast with WebAIM contrast checker

## Next Steps

1. **Deploy baseline**: Use templates as-is for initial launch
2. **Measure**: Track conversions, Core Web Vitals, error rates
3. **Iterate**: A/B test CTA colors, copy, positioning
4. **Enhance**: Add chat, scheduling, video testimonials
5. **Maintain**: Update tokens in design-system/TOKENS.md, not in templates

## Version History
- v1.0: Initial release with 4 core templates
- v1.1: Added responsive typography and form enhancements
