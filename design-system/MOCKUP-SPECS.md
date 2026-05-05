# High-Fidelity Mockup Specifications

**Version:** 1.0  
**Last Updated:** 2026-05-05  
**Purpose:** Visual mockup specifications for all core templates  
**Linked to:** Issue 2 IA and UX artifacts  
**Status:** Production Ready

## Overview
This document provides detailed high-fidelity visual specifications for all core templates, linking design decisions to the information architecture and user journeys defined in Issue 2. Each template includes desktop and mobile variants with exact specifications for engineering handoff.

---

## Template Hierarchy and Mapping

### Issue 2 Artifact Mapping
All templates directly implement the wireframe specifications and conversion UX blueprint from Issue 2:

| Template | Issue 2 Wireframe | UX Blueprint Section | Journey Mapping |
|----------|-------------------|---------------------|-----------------|
| Homepage | ux/WIREFRAME-SPECS-v1.md (Homepage) | CONVERSION-UX-BLUEPRINT-v1.md | All 3 journeys |
| Service Template | ux/WIREFRAME-SPECS-v1.md (Service) | CONVERSION-UX-BLUEPRINT-v1.md | Journey 2: Estimate Shopper |
| Location Template | ux/WIREFRAME-SPECS-v1.md (Location) | CONVERSION-UX-BLUEPRINT-v1.md | Journey 2 + Local intent |
| Emergency Landing | ux/WIREFRAME-SPECS-v1.md (Emergency) | CONVERSION-UX-BLUEPRINT-v1.md | Journey 1: Emergency User |

### Sitemap Integration
Each template maps to URL patterns defined in `ux/IA-SITEMAP-v1.md`:

- **Homepage:** `/` (root)
- **Service Template:** `/services/{service-name}/` (e.g., `/services/heating-repair/`)
- **Location Template:** `/locations/{city-name}/` (e.g., `/locations/syracuse-ny/`)
- **Emergency Landing:** `/emergency-hvac/`, `/emergency-plumbing/`

---

## 1. Homepage Template

### Purpose and User Intent
**Primary Goals:**
1. Establish trust and credibility immediately
2. Guide users to relevant service pages
3. Capture emergency leads via prominent CTAs
4. Support all three user journeys (emergency, estimate, financing)

**Target Audience:**
- Emergency users (immediate need)
- Estimate shoppers (research mode)
- Financing-constrained users (cost-conscious)

**Journey Mapping Reference:** `ux/JOURNEY-MAPS-v1.md` - All three journeys

---

### Desktop Layout (≥ 1024px)

#### 1.1 Header
**Dimensions:**
- Height: `80px`
- Container: Max-width `1200px`, centered

**Layout:**
```
+------------------------------------------------------------------+
| [Logo]              [Services] [Locations] [Reviews] [Contact]  |
|                                           [Call CTA] [Schedule]  |
+------------------------------------------------------------------+
```

**Component Breakdown:**
- **Logo:** 120×40px, left-aligned, links to homepage
- **Navigation:** 5 links (Services, Locations, Reviews, FAQ, Contact), centered
- **Call CTA:** Secondary button, phone number displayed, `tel:` link
- **Schedule CTA:** Primary button, links to `#schedule-form`

**Color Specifications:**
- Background: `#ffffff` (`--color-paper-0`)
- Logo: Full color
- Nav links: `#0d6b66` default, `#0a5652` hover
- Call button: Teal border and text
- Schedule button: Red background, white text

**Sticky Behavior:**
- Position: `sticky`, `top: 0`
- Compact on scroll: Reduces to 64px height after 100px scroll
- Shadow: `0 1px 3px rgba(18, 33, 38, 0.12)`

---

#### 1.2 Hero Section
**Dimensions:**
- Height: Min `500px`, content-driven
- Padding: `60px 0` (top/bottom)
- Background: Gradient from `#f6f3eb` to `#ffffff`

**Layout (2-column):**
```
+----------------------------------+----------------------------------+
|  [Headline]                     |                                  |
|  [Subheadline]                  |       [Hero Image]               |
|  [Primary CTA] [Secondary CTA]  |                                  |
|  [Trust badges]                 |                                  |
+----------------------------------+----------------------------------+
```

**Content Specifications:**

**Headline:**
- Font: Barlow Condensed
- Size: `clamp(2rem, 6vw, 3.25rem)` (52px max)
- Weight: 700 (bold)
- Color: `#122126` (`--color-ink-900`)
- Line-height: 1.05
- Text: "Syracuse's Most Trusted HVAC & Plumbing Experts"

**Subheadline:**
- Font: Public Sans
- Size: `1.125rem` (18px)
- Weight: 400 (normal)
- Color: `#2a3f46` (`--color-ink-700`)
- Line-height: 1.5
- Text: "24/7 emergency service. Licensed & insured. Same-day appointments available."

**Primary CTA:**
- Button: Primary variant
- Text: "Schedule Service"
- href: `#schedule-form`
- data-track: `schedule_hero`

**Secondary CTA:**
- Button: Secondary variant
- Text: "Call (315) 555-0100"
- href: `tel:+13155550100`
- data-track: `call_hero`

**Trust Badges:**
- Layout: 3 badges in horizontal row
- Badges: "Licensed & Insured", "24/7 Emergency", "Financing Available"
- Size: 64×64px each
- Spacing: 16px gap

**Hero Image:**
- Size: 500×400px (approximate)
- Subject: HVAC technician working or happy customer
- Format: WebP with JPG fallback
- Alt text: "Professional HVAC technician servicing heating system"

**Conversion Entry Point:** Entry Point 1 (per CONVERSION-UX-BLUEPRINT-v1.md)

---

#### 1.3 Trust Strip
**Dimensions:**
- Padding: `32px 0`
- Background: `#ffffff`

**Layout (Horizontal):**
```
+------------------------------------------------------------------------+
| ⭐⭐⭐⭐⭐ 4.9 (247 reviews) | Licensed & Insured | Same-Day Service |
+------------------------------------------------------------------------+
```

**Components:**
- **Review Stars:** 5 gold stars, 20px each, rating number "4.9" bold, review count "(247 reviews)"
- **Badges:** Inline text badges with icons
- **Spacing:** 32px gap between items

**Color:**
- Stars: `#fbbf24` (gold)
- Text: `#122126` (dark)
- Dividers: `#d8d7d2` (subtle gray)

---

#### 1.4 Services Grid
**Dimensions:**
- Padding: `48px 0`
- Background: `#f6f3eb` (warm paper)

**Heading:**
- Text: "Our Services"
- Font: Barlow Condensed, 2.25rem (36px), bold
- Alignment: Center
- Margin-bottom: 32px

**Layout (3-column grid):**
```
+----------------+  +----------------+  +----------------+
| [Icon]         |  | [Icon]         |  | [Icon]         |
| Heating Repair |  | AC Repair      |  | Plumbing       |
| [Description]  |  | [Description]  |  | [Description]  |
| [Learn More →] |  | [Learn More →] |  | [Learn More →] |
+----------------+  +----------------+  +----------------+
```

**Service Card Specs:**
- Background: `#ffffff`
- Border: `1px solid #d8d7d2`
- Border-radius: `10px` (`--radius-md`)
- Padding: `24px`
- Shadow: `0 1px 3px rgba(18, 33, 38, 0.12)` default, `0 8px 24px rgba(18, 33, 38, 0.12)` on hover
- Icon: 64×64px, centered top
- Title: 22px, bold, dark
- Description: 16px, normal, gray, 2-3 lines
- Link: Teal, underline on hover, arrow icon

**Services:**
1. Heating Repair & Installation
2. AC Repair & Installation
3. Plumbing Services
4. HVAC Maintenance
5. Emergency Services
6. Financing Options

**Note:** Display top 3 on mobile, all 6 on desktop in 3×2 grid

---

#### 1.5 Financing Module
**Dimensions:**
- Padding: `48px 0`
- Background: `#ffffff`

**Layout (2-column):**
```
+--------------------------------+--------------------------------+
| [Icon/Image]                   | [Heading]                      |
|                                | [Description]                  |
|                                | [Pre-Qualify CTA]              |
+--------------------------------+--------------------------------+
```

**Content:**
- **Heading:** "Flexible Financing Options"
- **Description:** "We offer financing to help make your HVAC investment affordable. Quick pre-qualification, no impact on credit score."
- **CTA:** Primary button, "Check Financing Options", links to `/financing/`

**Visual Treatment:**
- Icon: Credit card or dollar sign, 80×80px
- Border: 2px solid teal (accent color) around entire module
- Background: Light teal tint `rgba(13, 107, 102, 0.05)`

**Conversion Entry Point:** Entry Point 3 (financing-constrained user path)

---

#### 1.6 Reviews Block
**Dimensions:**
- Padding: `48px 0`
- Background: `#f6f3eb`

**Heading:**
- Text: "What Our Customers Say"
- Alignment: Center

**Layout (3-column grid):**
```
+------------------+  +------------------+  +------------------+
| ⭐⭐⭐⭐⭐        |  | ⭐⭐⭐⭐⭐        |  | ⭐⭐⭐⭐⭐        |
| "Great service..." |  | "Fast response..." |  | "Professional..." |
| - John S.        |  | - Mary K.        |  | - Tom R.         |
| Syracuse, NY     |  | Liverpool, NY    |  | Cicero, NY       |
+------------------+  +------------------+  +------------------+
```

**Testimonial Card Specs:**
- Background: `#ffffff`
- Border: `1px solid #d8d7d2`
- Border-radius: `10px`
- Padding: `24px`
- Shadow: Subtle, increases on hover

**Content:**
- Stars: 5 stars, 16px each
- Quote: 2-3 sentences, italic optional
- Author: Bold, dark
- Location: Regular, gray, smaller

**Trust Signal:** Social proof supporting all user journeys

---

#### 1.7 FAQ Accordion
**Dimensions:**
- Padding: `48px 0`
- Background: `#ffffff`

**Heading:**
- Text: "Frequently Asked Questions"
- Alignment: Center

**Layout (Single column, stacked):**
```
+--------------------------------------------------------------+
| > What areas do you serve?                              [+] |
+--------------------------------------------------------------+
| > Do you offer emergency service?                       [+] |
+--------------------------------------------------------------+
| > What payment methods do you accept?                   [+] |
+--------------------------------------------------------------+
| > Are you licensed and insured?                         [+] |
+--------------------------------------------------------------+
| > Do you offer financing?                               [+] |
+--------------------------------------------------------------+
```

**Accordion Item Specs:**
- Trigger: Full-width button, left-aligned text, icon right
- Background: `#ffffff` closed, `#f6f3eb` open
- Border: `1px solid #d8d7d2`
- Border-radius: `6px`
- Padding: `16px`
- Animation: 320ms height expansion

**Icon:**
- Closed: `+` or chevron down
- Open: `-` or chevron up
- Size: 16×16px
- Color: Teal

**Panel:**
- Background: `#f6f3eb`
- Padding: `16px`
- Text: Regular body text, answers 2-4 sentences

---

#### 1.8 Footer
**Dimensions:**
- Padding: `48px 0`
- Background: `#122126` (dark)
- Border-top: `4px solid #cc142a` (red accent)

**Layout (4-column grid):**
```
+-------------+-------------+-------------+-------------+
| NAP         | Quick Links | Service     | Hours &     |
| Company Name| Services    | Areas       | Social      |
| Address     | Locations   | Syracuse    | Mon-Fri     |
| Phone       | Reviews     | Liverpool   | 8am-5pm     |
| Email       | Contact     | Cicero      | 24/7 Emerg. |
+-------------+-------------+-------------+-------------+
| Copyright © 2026 | Privacy Policy | Terms | Accessibility |
+--------------------------------------------------------------+
```

**Color:**
- Background: `#122126` (dark)
- Text: `#ffffff` (white)
- Links: `#ffffff`, underline on hover
- Border-top: `#cc142a` (red)

**Typography:**
- Headings: 16px, semibold, white
- Links: 14px, normal, white
- NAP: 14px, normal, white
- Copyright: 14px, gray tint

**Phone Number:**
- Display: `(315) 555-0100`
- Format: Click-to-call `tel:` link
- Icon: Phone icon, 16px

---

### Mobile Layout (< 768px)

#### Key Differences from Desktop:

**Header:**
- Height: `64px` (reduced)
- Logo: 100px width (reduced)
- Navigation: Hidden, replaced with hamburger menu
- CTAs: Moved inside mobile menu

**Hero:**
- Single column, stacked
- Image: Below text content or removed
- CTAs: Full-width buttons, stacked vertically

**Services Grid:**
- Single column, show top 3 services
- "View All Services" link at bottom

**Financing Module:**
- Single column, stacked
- Icon above text

**Reviews:**
- Horizontal scroll carousel or single column

**FAQ:**
- Same as desktop, full-width

**Footer:**
- Single column, stacked sections

**Sticky Mobile CTA:**
- Fixed bottom bar, 64px height
- Two buttons: Call (left) and Schedule (right), equal width
- Always visible while scrolling

---

## 2. Service Template

### Purpose and User Intent
**Primary Goal:** Convert estimate shoppers into leads

**Target Audience:** Users researching specific services (heating repair, AC repair, etc.)

**Journey Mapping Reference:** `ux/JOURNEY-MAPS-v1.md` - Journey 2: Estimate Shopper

**IA Reference:** `ux/IA-SITEMAP-v1.md` - Intent Cluster: Repair

---

### Desktop Layout (≥ 1024px)

#### 2.1 Header
Same as Homepage

#### 2.2 Breadcrumbs
**Dimensions:**
- Padding: `16px 0`
- Background: Transparent

**Layout:**
```
Home > Services > Heating Repair
```

**Typography:**
- Font-size: 14px
- Color: Gray for non-active, Dark for current page
- Separator: `/` or `>`

---

#### 2.3 Service Hero
**Dimensions:**
- Padding: `48px 0`
- Background: Gradient (similar to homepage hero)

**Layout (2-column):**
```
+--------------------------------+--------------------------------+
| [Headline]                     | [Request Estimate Form]        |
| [Subheadline]                  | - Name                         |
| [Trust badges]                 | - Phone                        |
| [Primary CTA]                  | - ZIP                          |
|                                | - Issue Type                   |
|                                | [Submit Button]                |
+--------------------------------+--------------------------------+
```

**Headline:**
- Text: "Expert Heating Repair in Syracuse"
- Font: Barlow Condensed, 48px, bold
- Color: Dark

**Subheadline:**
- Text: "Fast, reliable furnace and boiler repair. Same-day service available."

**Trust Badges:**
- Same 3 badges as homepage

**Primary CTA:**
- Button: Primary variant
- Text: "Call for Urgent Repair: (315) 555-0100"
- href: `tel:+13155550100`

**Request Estimate Form (Short Form):**
- Fields: Name, Phone, ZIP, Issue Type (dropdown)
- All fields required
- Submit button: Primary variant, "Request Estimate"
- Positioned in right column, card style with shadow

**Conversion Entry Point:** Entry Point 1 (above-fold request estimate)

---

#### 2.4 Problem Symptoms Section
**Dimensions:**
- Padding: `48px 0`
- Background: White

**Heading:**
- Text: "Signs You Need Heating Repair"

**Layout (2-column grid):**
```
+------------------------------+  +------------------------------+
| ❌ Furnace won't turn on     |  | ❌ Uneven heating            |
| ❌ Strange noises            |  | ❌ High energy bills         |
| ❌ Pilot light issues        |  | ❌ Frequent cycling          |
+------------------------------+  +------------------------------+
```

**List Items:**
- Icon: Red X or warning icon, 24px
- Text: 16px, dark, 1-2 sentences per symptom

---

#### 2.5 Service Process Timeline
**Dimensions:**
- Padding: `48px 0`
- Background: Warm paper (`#f6f3eb`)

**Heading:**
- Text: "Our Service Process"

**Layout (4-step horizontal timeline):**
```
1. Call Us → 2. Diagnosis → 3. Repair → 4. Guarantee
```

**Step Specs:**
- Number: Large, bold, teal
- Title: 18px, semibold, dark
- Description: 14px, normal, gray, 2-3 sentences
- Connector: Line or arrow between steps

---

#### 2.6 Review/Trust Module
Same as Homepage reviews block, 3 testimonials

**Conversion Support:** Social proof for estimate shoppers

---

#### 2.7 Financing CTA Block
**Dimensions:**
- Padding: `32px`
- Background: Light teal tint
- Border: 2px solid teal

**Layout (Single row):**
```
[Icon] Flexible Financing Available | No credit check to pre-qualify | [CTA]
```

**CTA Button:**
- Primary variant
- Text: "View Financing Options"
- href: `/financing/`

**Conversion Entry Point:** Entry Point 2 (financing path)

---

#### 2.8 Inline Estimate Form (Long Form)
**Dimensions:**
- Padding: `48px 0`
- Background: White

**Heading:**
- Text: "Get a Free Estimate"

**Layout (2-column form):**
- Left column: Name, Phone, Email, ZIP
- Right column: Preferred Date, Equipment Details (textarea), Notes (textarea)
- Bottom: Submit button (full-width)

**Submit Button:**
- Primary variant
- Text: "Request Detailed Estimate"

**Conversion Entry Point:** Entry Point 3 (detailed estimate)

---

#### 2.9 Service-Specific FAQ
Same accordion pattern as homepage, 5-7 service-specific questions

---

#### 2.10 Footer
Same as Homepage

---

### Mobile Layout (< 768px)
- Single column throughout
- Form moved below hero content (not side-by-side)
- Timeline: Vertical stack instead of horizontal
- Sticky mobile CTA bar visible

---

## 3. Location Template

### Purpose and User Intent
**Primary Goal:** Capture local leads and establish geographic authority

**Target Audience:** Users searching for local HVAC services (e.g., "HVAC Syracuse")

**Journey Mapping Reference:** `ux/JOURNEY-MAPS-v1.md` - Journey 2 + Local intent

**IA Reference:** `ux/IA-SITEMAP-v1.md` - Intent Cluster: Location-Based

---

### Desktop Layout (≥ 1024px)

#### 3.1 Header
Same as Homepage

#### 3.2 Local Proof Hero
**Dimensions:**
- Padding: `48px 0`
- Background: Gradient

**Layout:**
```
+--------------------------------------------------------------+
| Serving Syracuse Since 2010                                  |
| Your Trusted Local HVAC & Plumbing Experts                   |
| [Call Local Number] [Schedule Local Service]                |
| ⭐⭐⭐⭐⭐ 4.9 stars from Syracuse residents                  |
+--------------------------------------------------------------+
```

**Headline:**
- Emphasize "Syracuse" and local connection
- Font: Barlow Condensed, 48px, bold

**CTAs:**
- Display local phone number prominently
- Primary CTA: "Schedule Service in Syracuse"

---

#### 3.3 Service Availability by Neighborhood
**Dimensions:**
- Padding: `48px 0`
- Background: White

**Heading:**
- Text: "Neighborhoods We Serve in Syracuse"

**Layout (3-column grid):**
```
+------------------+  +------------------+  +------------------+
| Downtown         |  | University Hill  |  | North Syracuse   |
| Westcott         |  | Eastwood         |  | Strathmore       |
| Sedgwick         |  | Brighton         |  | Franklin Square  |
+------------------+  +------------------+  +------------------+
```

**List Style:**
- Checkmark icon, 16px, teal
- Neighborhood name, 16px, dark
- No additional description

---

#### 3.4 Local Testimonials
Same as Homepage reviews, but testimonials from Syracuse residents

**Content Emphasis:**
- Author location: "Syracuse, NY" or specific neighborhood
- Service mention: Local references (e.g., "After the snowstorm...")

---

#### 3.5 Click-to-Call Strip
**Dimensions:**
- Padding: `32px 0`
- Background: Teal (`#0d6b66`)

**Layout (Centered):**
```
+--------------------------------------------------------------+
| Need service in Syracuse? Call now: (315) 555-0100         |
|                      [Call Now Button]                      |
+--------------------------------------------------------------+
```

**Colors:**
- Background: Teal
- Text: White
- Button: White background, teal text (inverted)

**Conversion Entry Point:** Entry Point 2 (click-to-call)

---

#### 3.6 Location-Specific FAQ
Same accordion pattern, location-specific questions:
- "What areas of Syracuse do you serve?"
- "Do you offer same-day service in Syracuse?"
- "What's your response time in Syracuse?"

---

#### 3.7 Inline Request Form
Similar to Service Template long form, but with location pre-filled or prominent

---

#### 3.8 Footer
Same as Homepage, with local phone number emphasized

---

### Mobile Layout
- Single column
- Local number prominently displayed in hero
- Sticky mobile CTA with local number

---

## 4. Emergency Landing Template

### Purpose and User Intent
**Primary Goal:** Immediate conversion (call or form submission) for emergency situations

**Target Audience:** Users with urgent HVAC or plumbing emergencies

**Journey Mapping Reference:** `ux/JOURNEY-MAPS-v1.md` - Journey 1: Emergency User

**IA Reference:** `ux/IA-SITEMAP-v1.md` - Intent Cluster: Emergency

---

### Desktop Layout (≥ 1024px)

#### 4.1 Minimal Header
**Dimensions:**
- Height: `64px` (reduced for urgency)
- Background: Red accent (`#cc142a`)

**Layout:**
```
+--------------------------------------------------------------+
| [Logo]                           [CALL NOW: (315) 555-0100] |
+--------------------------------------------------------------+
```

**Colors:**
- Background: Red (`#cc142a`)
- Text: White
- Call button: White background, red text (inverted)

**Note:** No navigation menu, minimal distractions

---

#### 4.2 Urgency Hero
**Dimensions:**
- Padding: `48px 0`
- Background: White

**Layout (Centered, single column):**
```
+--------------------------------------------------------------+
|                  🚨 24/7 Emergency HVAC Service              |
|                  Response Time: Under 1 Hour                 |
|                                                              |
|              [CALL NOW: (315) 555-0100]                      |
|                                                              |
|                  Or submit emergency request below:          |
+--------------------------------------------------------------+
```

**Headline:**
- Text: "24/7 Emergency HVAC Service"
- Font: Barlow Condensed, 52px, bold, red color
- Icon: Emergency emoji or red warning icon

**Response Promise:**
- Text: "Response Time: Under 1 Hour"
- Font: Public Sans, 24px, semibold, dark
- Urgency indicator (e.g., clock icon)

**Primary CTA:**
- Emergency button variant (dark background, white text)
- Text: "CALL NOW: (315) 555-0100"
- href: `tel:+13155550100`
- Size: Larger than standard (60px height)
- Icon: Phone, 24px

**Conversion Entry Point:** Entry Point 1 (urgent call CTA)

---

#### 4.3 Emergency Short Form (One-Screen Visible)
**Dimensions:**
- Max-width: `600px`, centered
- Background: Light red tint (`rgba(220, 38, 38, 0.05)`)
- Border: 2px solid red
- Padding: `32px`
- Border-radius: `10px`

**Layout:**
```
+--------------------------------------------------------------+
| Emergency Request Form                                       |
|                                                              |
| Full Name:              [___________________]                |
| Phone Number:           [___________________]                |
| ZIP Code:               [___________________]                |
| Emergency Type:         [▼ Select Issue    ]                |
|                                                              |
|                 [Submit Emergency Request]                   |
|                                                              |
| ⚡ We'll call you back within 15 minutes                    |
+--------------------------------------------------------------+
```

**Fields:**
- All required, minimal
- Dropdown options: "No Heat", "No AC", "Water Leak", "Gas Smell", "Other Emergency"

**Submit Button:**
- Emergency button variant
- Text: "Submit Emergency Request"
- Full-width
- Large size (56px height)

**Reassurance Text:**
- Below form: "⚡ We'll call you back within 15 minutes"
- Color: Teal (trust color)
- Icon: Lightning bolt for speed

**Conversion Entry Point:** Entry Point 2 (emergency form)

---

#### 4.4 Service Area Validation
**Dimensions:**
- Padding: `32px 0`
- Background: Warm paper

**Layout:**
```
+--------------------------------------------------------------+
| ✓ Serving Syracuse, Liverpool, Cicero & Surrounding Areas   |
| 24/7 emergency coverage in Central New York                 |
+--------------------------------------------------------------+
```

**Content:**
- Checkmark icon, green
- City list
- 24/7 availability statement

---

#### 4.5 Trust and Guarantee Strip
**Dimensions:**
- Padding: `32px 0`
- Background: White

**Layout (3-column):**
```
+---------------------+---------------------+---------------------+
| Licensed & Insured  | 24/7 Availability   | Satisfaction        |
|                     |                     | Guaranteed          |
+---------------------+---------------------+---------------------+
```

**Trust Signals:**
- Icons: 48×48px
- Text: 16px, centered
- No lengthy descriptions (keep it fast)

---

#### 4.6 Backup CTA
**Dimensions:**
- Padding: `32px`
- Background: Red accent
- Full-width

**Layout (Centered):**
```
+--------------------------------------------------------------+
| Still need help? Call our emergency line now:               |
|              [CALL (315) 555-0100]                           |
+--------------------------------------------------------------+
```

**Colors:**
- Background: Red
- Text: White
- Button: White background, red text

**Conversion Entry Point:** Entry Point 3 (backup call CTA)

---

#### 4.7 Footer (Minimal)
**Content:**
- Business name, phone, address only
- No extensive link lists (reduce distractions)
- Privacy policy link

---

### Mobile Layout (< 768px)

**Key Differences:**
- Header: Emergency call button even more prominent
- Hero: Text and CTA stacked
- Form: Full-width, all fields stacked
- Sticky mobile CTA: **Call button only** (no schedule), 64px height, red background

**Critical:** Form must be visible without scrolling on mobile (one-screen rule)

---

## Design-to-Development Handoff Checklist

### Assets Required
- [ ] Logo files (SVG, PNG @1x, @2x)
- [ ] Icon set (trust badges, process steps, UI icons)
- [ ] Hero images (WebP + JPG fallback, optimized)
- [ ] Service card images/icons
- [ ] Testimonial photos (optional)

### Color Palette Export
- [ ] CSS custom properties file (`:root` with all tokens)
- [ ] Color swatches for design tools (Figma, Sketch, Adobe)

### Typography
- [ ] Web font files (WOFF2, WOFF) or Google Fonts links
- [ ] Font licensing confirmed
- [ ] Fallback font stack defined

### Spacing and Grid
- [ ] Spacing scale documented (design-system/TOKENS.md)
- [ ] Breakpoint values confirmed
- [ ] Container max-width documented

### Component States
- [ ] All button states defined (hover, focus, active, disabled)
- [ ] Form field states defined (focus, error, success)
- [ ] Navigation states (open, closed, hover)
- [ ] Accordion states (expanded, collapsed)

### Accessibility
- [ ] Color contrast ratios validated (WCAG 2.1 AA)
- [ ] Focus indicators specified
- [ ] ARIA attributes documented
- [ ] Keyboard interactions defined

### Responsive Behavior
- [ ] Mobile layout (360px, 375px)
- [ ] Tablet layout (768px)
- [ ] Desktop layout (1024px, 1440px)
- [ ] Component breakpoints specified

### Interactions and Animations
- [ ] Transition durations defined
- [ ] Easing functions specified
- [ ] Hover effects documented
- [ ] Scroll behaviors defined

### Content Specifications
- [ ] Placeholder copy provided
- [ ] Character limits for dynamic fields
- [ ] Image aspect ratios and sizes
- [ ] Alt text guidelines

---

## Mockup File Structure (Recommended)

If using design tools like Figma, Adobe XD, or Sketch:

```
/mockups/
  /homepage/
    - homepage-desktop-1440.png
    - homepage-tablet-768.png
    - homepage-mobile-375.png
    - homepage-interactive.fig (Figma file)
  /service-template/
    - service-desktop-1440.png
    - service-tablet-768.png
    - service-mobile-375.png
    - service-interactive.fig
  /location-template/
    - location-desktop-1440.png
    - location-tablet-768.png
    - location-mobile-375.png
    - location-interactive.fig
  /emergency-landing/
    - emergency-desktop-1440.png
    - emergency-tablet-768.png
    - emergency-mobile-375.png
    - emergency-interactive.fig
  /components/
    - header-variants.png
    - button-states.png
    - form-fields.png
    - cards.png
    - accordion.png
```

**Note:** This repository uses code-based templates (HTML/CSS) rather than image mockups for implementation efficiency. Visual specifications above serve as the "mockup" reference.

---

## Issue 2 Cross-Reference

### IA Sitemap Compliance
✅ All templates map to URL structure defined in `ux/IA-SITEMAP-v1.md`

### Journey Maps Compliance
✅ All three user journeys supported:
- Journey 1 (Emergency): Emergency Landing Template
- Journey 2 (Estimate Shopper): Service Template + Location Template
- Journey 3 (Financing-Constrained): Homepage + Service Template financing CTAs

### Conversion UX Blueprint Compliance
✅ All templates have minimum 2 conversion paths per `ux/CONVERSION-UX-BLUEPRINT-v1.md`:
- Homepage: 3 paths (hero CTA, sticky CTA, trust module CTA)
- Service Template: 3 paths (request estimate, call CTA, financing CTA)
- Location Template: 3 paths (local availability CTA, call CTA, request form)
- Emergency Landing: 2 paths (call CTA, emergency form)

### Wireframe Specs Compliance
✅ All templates implement sections defined in `ux/WIREFRAME-SPECS-v1.md`

---

## Version History
- **v1.0** (2026-05-05): Initial high-fidelity mockup specifications with Issue 2 linkage
