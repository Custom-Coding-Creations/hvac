# Accessibility And Contrast Matrix v1

| Pair | Usage | Contrast Target | Status |
| --- | --- | --- | --- |
| #122126 on #f6f3eb | body text on warm paper background | >= 4.5:1 | Pass |
| #ffffff on #cc142a | primary button text | >= 4.5:1 | Pass |
| #122126 on #ffffff | default content text | >= 4.5:1 | Pass |
| #0d6b66 on #ffffff | secondary CTA text | >= 4.5:1 | Pass |
| #d97706 on #122126 | warning badge text | >= 4.5:1 | Needs darkening in implementation |

## Keyboard Rules
- All interactive elements must be reachable by Tab.
- Focus outline minimum 2px with non-color-only distinction.
- Mobile nav must trap focus while open.

## Semantic Rules
- One h1 per template.
- Landmark regions: header, nav, main, footer.
- Form controls have associated labels.
- Error messages announced to assistive tech.
