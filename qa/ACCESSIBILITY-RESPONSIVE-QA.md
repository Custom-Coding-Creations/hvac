# Accessibility And Responsive QA Notes

## Accessibility Notes
- Semantic landmarks implemented: header, nav, main, footer.
- Skip link is present in all templates.
- Form labels are explicit and paired with controls.
- Error and success messages use aria-live polite regions.
- Navigation trigger uses aria-expanded and aria-controls.
- Focus-visible styles are defined across interactive controls.

## Keyboard Interaction Notes
- Mobile menu can be opened with keyboard and closed via Escape.
- Focus is moved into menu on open and returned to trigger on close.
- Focus is trapped in mobile navigation while menu is open.
- Accordion triggers are keyboard operable buttons.

## Form State Notes
- Invalid required fields are marked with aria-invalid.
- Forms clear stale success state before running a new validation pass.
- Forms set aria-busy during submit simulation and restore idle state after completion.

## Responsive Notes
- Layout defaults to one-column mobile-first behavior.
- Breakpoint transitions implemented at 768px and up.
- Header CTAs collapse on small screens in favor of sticky mobile CTA.
- Grid modules adapt from one column to two/three columns on larger screens.

## QA Coverage Matrix
| Viewport | Header/Nav | Forms | CTA Visibility | Trust Module |
| --- | --- | --- | --- | --- |
| 360px | pass | pass | pass | pass |
| 768px | pass | pass | pass | pass |
| 1024px | pass | pass | pass | pass |
| 1440px | pass | pass | pass | pass |
