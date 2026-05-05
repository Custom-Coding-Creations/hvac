# Component Specifications v1

## Global Header
- States: default, compact-on-scroll, mobile-open, focus-visible.
- Requirements: skip link support, keyboard access to all nav items, sticky behavior.

## Navigation
- Desktop: horizontal links with active and hover states.
- Mobile: disclosure button with aria-expanded and controlled panel.
- Focus handling: opening menu moves focus to first link, closing returns focus to trigger.

## Trust Module
- Patterns: badge row, review highlight, financing confidence card.
- Responsive behavior: wraps to stacked cards below 768px.

## CTA Button
- Variants: primary, secondary, ghost, danger-emergency.
- States: default, hover, focus, active, disabled, loading.

## Form Patterns
- Short form and long form variants.
- States: default, focus, error, success, loading.
- Errors must be linked with aria-describedby and role alert for summary.

## FAQ Accordion
- Keyboard support: Enter and Space toggle, arrow keys optional enhancement.
- State: expanded/collapsed with aria-expanded sync.

## Footer
- Includes NAP, hours, compliance links, and service area link group.
- Must preserve readable contrast at all breakpoints.
