# Frontend Implementation Guide

## Scope
This package provides reusable frontend primitives and four core templates:
- homepage
- service template
- location template
- emergency landing template

## Shared Systems
- CSS tokens and primitives: frontend/assets/css/system.css
- Interaction behavior: frontend/assets/js/system.js
- Reusable component conventions: frontend/components/README.md

## How To Extend Templates
1. Start from the closest template file under frontend/templates.
2. Reuse existing section and component classes before introducing new classes.
3. If visual values are missing, add tokens in design-system/TOKENS.md first.
4. Keep two conversion paths on every template (form and call or schedule and call).
5. Ensure all interactive elements are keyboard reachable and have visible focus.

## Conversion Components
- Forms: use data-validate="true" and required fields with error spans mapped by id.
- CTA tracking: add data-track attribute to links and buttons.
- Click-to-call: use tel links with descriptive labels.

## Accessibility Requirements
- Include skip link and semantic landmarks.
- Keep one h1 per page and logical heading structure.
- Ensure labels are explicitly associated with controls.
- Keep error and success text in aria-live regions.

## Responsive Requirements
- Validate at 360px, 768px, 1024px, and 1440px.
- Keep touch target heights at or above 44px.
- Ensure sticky mobile CTA remains visible and unobtrusive.
