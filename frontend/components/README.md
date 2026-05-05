# Frontend Components

This directory describes reusable component groups used by the template files.

## Component Groups

### Header and Navigation
- Sticky header with logo, navigation links, and conversion CTAs
- Mobile disclosure button with focus management and keyboard control
- Escape key closes menu and returns focus to trigger
- Focus trap prevents focus from leaving nav while open

```html
<header class="site-header" role="banner">
  <div class="container header-row">
    <a class="brand" href="#" data-track="brand">Brand Name</a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav">Menu</button>
    <nav id="primary-nav" class="primary-nav" aria-label="Primary" data-open="false">
      <ul>
        <li><a href="#section">Section Link</a></li>
      </ul>
    </nav>
    <div class="header-cta">
      <a class="btn btn-primary" href="#conversion-target">CTA</a>
    </div>
  </div>
</header>
```

### Trust Modules
- Badge rows for credibility signals
- Review highlights with star ratings
- Financing confidence cards
- Responsive: wraps to stacked below 768px

```html
<div class="trust-strip">
  <article class="trust-card">
    <strong>Trust Signal</strong>
    <p>Supporting detail or customer evidence.</p>
  </article>
</div>
```

### CTA Button System
- Variants: primary (high contrast), secondary (outlined), emergency (dark)
- States: default, hover, focus, disabled, loading
- Minimum 44px height on all breakpoints
- Icons and text supported with white-space control

```html
<a class="btn btn-primary" href="#target" data-track="event_name">Call to Action</a>
<button class="btn btn-secondary" type="button">Secondary Action</button>
<button class="btn btn-emergency" type="button">Emergency Call</button>
```

### Form Patterns
- Short form (name, phone, type) for quick captures
- Long form (short + details + preferences) for complex scenarios
- Error states: aria-invalid, red border, error text
- Success states: green text, aria-live announcement
- Loading state: aria-busy="true" on form element

```html
<form data-validate="true" novalidate>
  <div class="form-field">
    <label for="field-id">Label Text</label>
    <input id="field-id" type="text" name="field" required />
    <span class="form-error" id="field-id-error" aria-live="polite"></span>
  </div>
  <button class="btn btn-primary" type="submit">Submit</button>
  <p class="form-success" aria-live="polite"></p>
</form>
```

### FAQ Accordion
- Keyboard support: Enter/Space to toggle
- Accessibility: aria-expanded, aria-controls
- Smooth state transitions with CSS
- Nested disclosure support

```html
<div class="accordion-item">
  <button class="accordion-trigger" aria-expanded="false" aria-controls="panel-id">
    Question Text
  </button>
  <div id="panel-id" class="accordion-panel" hidden>
    <p>Answer content here.</p>
  </div>
</div>
```

### Footer
- Dark background for contrast
- NAP (Name, Address, Phone) section
- Hours and service area
- Compliance links and social (optional)

```html
<footer class="site-footer" role="contentinfo">
  <div class="container">
    <section>
      <h2>Contact</h2>
      <p><a href="tel:+13155550100">(315) 555-0100</a></p>
    </section>
  </div>
</footer>
```

### Sticky Mobile CTA
- Fixed bottom bar visible only on mobile
- Two actions: call + conversion
- Hidden at 768px and above

```html
<div class="sticky-mobile-cta" aria-label="Mobile actions">
  <a class="btn btn-emergency" href="tel:+13155550100" data-track="call">Call</a>
  <a class="btn btn-primary" href="#conversion">Action</a>
</div>
```

## Extension Rules
- Reuse classes from frontend/assets/css/system.css before creating new ones.
- If a new token is needed, add it in design-system/TOKENS.md first.
- New interactive components must provide keyboard support and visible focus styles.
- All interactive elements must have aria-labels or associated labels.
- Form errors must be linked with aria-describedby or aria-live announcement.
- Colors must pass WCAG AA contrast requirements (4.5:1 for normal text).
