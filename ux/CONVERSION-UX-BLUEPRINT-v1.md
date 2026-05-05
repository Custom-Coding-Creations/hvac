# Conversion UX Blueprint v1

## Core Principles
- Every core template has two or more conversion paths.
- CTA hierarchy is stable: primary action first, trust signal second, secondary action third.
- Mobile interaction minimizes typing and tap distance.

## Persistent CTA Strategy
- Desktop: sticky header contains call and schedule CTA.
- Mobile: sticky bottom bar contains call CTA plus schedule CTA.
- In-content CTA blocks appear every major content section.

## Form Architecture
- Short form: name, phone, zip, issue type.
- Long form: short form fields plus preferred time, equipment details, notes.
- Emergency pages default to short form and optional callback preference.

## Template Conversion Entry Points
| Template | Entry Point 1 | Entry Point 2 | Entry Point 3 |
| --- | --- | --- | --- |
| Homepage | hero schedule CTA | sticky click-to-call | trust module CTA |
| Service Template | above-fold request estimate | in-content service CTA | sticky call CTA |
| Location Template | local availability CTA | click-to-call | review module CTA |
| Emergency Template | urgent call CTA | emergency short form | sticky call CTA |

## Mobile Interaction Specifications
- Header nav collapses to disclosure button at <= 768px.
- Focus must move into mobile menu when opened.
- Body scroll lock while mobile menu is open.
- Minimum touch target size 44x44 pixels.
- Form fields use one-column layout on <= 768px.

## Trust Modules
- Review highlights.
- License and certification badges.
- Financing options summary.
- Service guarantee statement.

## Validation Rules
- No template passes if fewer than two conversion paths are present.
- No conversion component passes without focus and error state support.
