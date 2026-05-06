# IA And Conversion UX Blueprint v2

## Purpose
This v2 artifact consolidates IA, URL strategy, journey logic, conversion entry points, mobile-first behavior, wireframe guidance, KPI mapping, and implementation dependencies into one handoff.

## Scope
- In scope: IA and URL strategy, intent clusters, conversion journeys, CTA logic by template, mobile behaviors, wireframe specs for four core templates, KPI alignment, design/frontend dependency notes, assumptions, and unresolved trade-offs.
- Out of scope: backend implementation, analytics vendor setup, financing provider integration, and geolocation service build-out.

## Assumptions And Rationale
| ID | Assumption | Rationale | Validation Trigger |
| --- | --- | --- | --- |
| A-01 | Initial launch uses static HTML templates with shared CSS/JS | Existing templates are already implemented and testable | Revisit if page count grows above 40 URLs |
| A-02 | Service and location growth will be handled by a structured content data model | Multi-service and multi-location expansion is a hard requirement | Revisit when adding first two new services and first two new locations |
| A-03 | Emergency flows prioritize phone conversion over form completion | Emergency intent requires fastest path to dispatch | Revisit if call abandonment exceeds form conversion on emergency URLs |
| A-04 | Financing users need lower-friction capture before full qualification | Financing-constrained users abandon long forms at higher rates | Revisit if pre-qual lead quality is below target |
| A-05 | Mobile is primary acquisition context | Local search and paid traffic for HVAC is mobile-heavy | Revisit if desktop share exceeds 55% for three consecutive months |

## Complete Sitemap And URL Strategy

### URL Principles
1. Intent-first hierarchy: emergency and financing remain top-level.
2. Scalable dynamic patterns: service and location pages follow deterministic slug rules.
3. Canonical consistency: each page has one canonical URL; variants 301 to canonical.
4. SEO-safe expansion: each template supports unique metadata and structured data.

### Current Core URL Set
- /
- /services/
- /services/heating-repair/
- /services/ac-repair/
- /services/plumbing-repair/
- /services/maintenance/
- /services/system-installation/
- /locations/
- /locations/syracuse-ny/
- /locations/cicero-ny/
- /locations/liverpool-ny/
- /emergency-hvac/
- /emergency-plumbing/
- /financing/
- /reviews/
- /faq/
- /blog/
- /careers/
- /referral/
- /contact/

### Scalable URL Patterns
| Page Type | Pattern | Example | Notes |
| --- | --- | --- | --- |
| Service detail | /services/{service-slug}/ | /services/ductless-mini-split-installation/ | service-slug from service catalog; lowercase kebab-case |
| Location detail | /locations/{location-slug}/ | /locations/fayetteville-ny/ | location-slug from city + state abbrev |
| Emergency service | /emergency-{service-slug}/ | /emergency-heating-repair/ | reserve for high-intent emergency services only |
| Service in location (optional scale phase) | /locations/{location-slug}/{service-slug}/ | /locations/syracuse-ny/heating-repair/ | phase-2 pattern for high-volume geo+service pages |

### Slug Rules
1. Normalize to lowercase ASCII.
2. Replace spaces and punctuation with single hyphen.
3. Collapse duplicate hyphens.
4. Location slugs append state abbreviation (city-st).
5. If collision occurs, append county or area suffix.

### Metadata And Canonicalization Rules
- Canonical URL equals page URL without query parameters.
- Service pages: title pattern "{Service} in {Primary Area} | Brand".
- Location pages: title pattern "HVAC And Plumbing in {City}, {State} | Brand".
- Emergency pages: title starts with "24/7 Emergency" and includes local modifier.
- Add LocalBusiness and Service schema on location and service pages.

## IA To Intent Mapping Table
| URL Pattern | Intent Cluster | Primary User Need | Core Template | Primary CTA | Secondary CTA |
| --- | --- | --- | --- | --- | --- |
| / | Trust validation + triage | Choose path quickly | Homepage | Schedule service | Call now |
| /emergency-hvac/ and /emergency-plumbing/ | Emergency | Immediate response | Emergency template | Call dispatch now | Emergency callback form |
| /services/{service-slug}/ | Repair or replacement | Evaluate options and request estimate | Service template | Request estimate | Call service line |
| /locations/{location-slug}/ | Location-based trust | Confirm local coverage and availability | Location template | Check local availability | Call local dispatch |
| /financing/ | Financing-constrained | Understand payment options | Financing-focused interior section/template | Check financing options | Call financing support |
| /reviews/ and /faq/ | Trust validation | Reduce risk and uncertainty | Standard interior | Request service | Call now |
| /contact/ | General conversion fallback | Reach team with minimal friction | Contact interior | Submit contact form | Call now |

## Intent Clusters And Journeys

### Cluster Definitions
- Emergency: urgent breakdown, safety concerns, no cooling/heating, active leak.
- Estimate shopper: comparing providers, pricing, timelines, and process confidence.
- Financing-constrained: interested but payment confidence is blocker.
- Trust validation: verifies licensing, reviews, and guarantees.
- Location-based: confirms service coverage and local response expectations.

### Journey 1: Emergency User
1. Trigger: emergency search/ad or direct return visitor.
2. Entry pages: /emergency-hvac/ or /emergency-plumbing/.
3. First-screen experience: urgent value proposition, dispatch promise, click-to-call dominant.
4. Path A: tap call CTA and connect to dispatch.
5. Path B: submit one-screen callback form if call cannot be completed.
6. Reinforcement: trust strip with licensing, response window, and guarantee.

### Journey 2: Estimate Shopper
1. Trigger: service-intent local search.
2. Entry pages: /services/{service-slug}/ and homepage service modules.
3. First-screen experience: problem-solution framing, process clarity, social proof.
4. Path A: request estimate form.
5. Path B: schedule consultation CTA.
6. Reinforcement: pricing guidance, FAQs, financing teaser, review highlights.

### Journey 3: Financing-Constrained User
1. Trigger: financing keyword or financing CTA from service pages.
2. Entry pages: /financing/ and financing blocks on homepage/service/location.
3. First-screen experience: plain-language financing summary and trust safeguards.
4. Path A: pre-qualify interest capture.
5. Path B: call financing support.
6. Reinforcement: monthly payment examples and no-pressure messaging.

## Conversion Entry Points And CTA Logic By Template
| Template | Entry Point 1 | Entry Point 2 | Entry Point 3 | CTA Logic |
| --- | --- | --- | --- | --- |
| Homepage | Hero schedule CTA | Sticky header call CTA | Sticky mobile CTA bar | If user scrolls > 35% without interaction, show in-content CTA block after next section |
| Service template | Above-fold estimate CTA | In-content CTA after process section | Sticky call CTA | If issue selector indicates urgent symptom, prioritize call CTA copy and color treatment |
| Location template | Local availability CTA | Click-to-call strip | Review module CTA | If location has same-day dispatch, expose speed reassurance badge near primary CTA |
| Emergency template | Urgent call CTA | One-screen emergency short form | Sticky call CTA | Primary always call-first; callback form as fail-safe and must remain above fold on mobile |

### CTA Copy Personalization Rules
- Emergency pages: "Call Dispatch Now" as primary language.
- Service pages: "Request {Service} Estimate" as primary language.
- Location pages: "Check {City} Availability" as primary language.
- Financing modules: "Check Financing Options" as primary language.

### Event Taxonomy Standard
Use format: action_object_context_template.
- Example: click_call_header_homepage
- Example: submit_form_emergency_abovefold_emergency
- Example: click_cta_financing_servicecard_service

## Mobile-First Behavior Specification

### Breakpoint Contract
- 360 to 767: mobile single-column priority.
- 768 to 1023: tablet hybrid layout.
- 1024 to 1439: desktop standard layout.
- 1440+: wide desktop spacing expansion.

### Navigation Behavior
1. Mobile nav collapses into disclosure button.
2. Opening nav traps focus inside menu and locks body scroll.
3. Escape key closes menu and restores focus to trigger.
4. Primary conversion CTA remains accessible in header or sticky bar.

### Sticky CTA Behavior
1. Mobile sticky bar is always visible after first viewport load.
2. If keyboard is open in form field, sticky bar reduces height to avoid overlap.
3. Bar includes two actions: call now and schedule/request callback.
4. Touch targets are minimum 44x44.

### Form Behavior
1. Emergency forms stay one-screen on mobile with minimal required fields.
2. Service and location forms start short, then reveal optional detailed fields.
3. Validation is inline, accessible, and announced with aria-live.
4. No step requires non-essential inputs before lead capture.

### Trust Module Behavior
1. Trust strip appears above fold on emergency and near first CTA on other templates.
2. Trust cards stack in one column on mobile, two columns on tablet where space permits.
3. Badge and review modules avoid pushing primary CTA below first viewport on mobile.

## HVAC-Specific Wireframes

### Homepage Wireframe
#### Desktop
1. Header: brand, service nav, call button, schedule button.
2. Hero: seasonal problem headline, value prop, two CTAs.
3. Trust strip: license badge, rating snapshot, response promise.
4. Services grid: heating, cooling, plumbing, maintenance cards.
5. Financing block: payment comfort messaging and CTA.
6. Review highlights.
7. FAQ accordion.
8. Footer with NAP, hours, service area links.

#### Mobile
1. Compact header with nav toggle and call CTA.
2. Hero with one primary CTA plus tap-to-call secondary.
3. Sticky CTA bar after initial render.
4. Services cards as swipe-safe stacked blocks.
5. Financing module condensed to summary + CTA.
6. FAQ collapsible with large touch targets.

### Service Template Wireframe
#### Desktop
1. Breadcrumb + service hero.
2. Symptom checker block with urgent symptom escalation note.
3. Process timeline in three steps.
4. Trust module with service-specific certifications.
5. Financing teaser for replacement-heavy services.
6. Inline estimate form.
7. Service FAQ.

#### Mobile
1. Hero with sticky call and estimate actions.
2. Symptom list in collapsible cards.
3. Process steps as vertical progress cards.
4. Form short-first with optional expansion.

### Location Template Wireframe
#### Desktop
1. Local proof hero with city reference.
2. Coverage and dispatch window block.
3. Local testimonials and neighborhood references.
4. Click-to-call strip.
5. Location FAQ and inline request form.

#### Mobile
1. City availability proof above fold.
2. Fast-call strip before deep content.
3. Reviews and trust proof condensed.
4. One-column request form with neighborhood or zip.

### Emergency Template Wireframe
#### Desktop
1. Minimal emergency header.
2. Urgent hero with explicit response window language.
3. One-screen emergency callback form.
4. Service area validation block.
5. Guarantee and trust strip.
6. Backup CTA.

#### Mobile
1. Call-first hero with dominant tap target.
2. Sticky call bar persistent.
3. Callback form directly below hero.
4. Service area confirmation before footer.

## KPI Mapping To IA And Journeys
| KPI | IA Or UX Lever | Expected Influence |
| --- | --- | --- |
| Lead Volume | Multi-entry CTA architecture and low-friction forms | More captured opportunities across templates |
| Qualified Lead Rate | Intent-aligned entry pages and service/location specificity | Better lead quality from better intent match |
| Booked Jobs | Emergency call-first and local availability clarity | Higher call-to-book throughput |
| Form Completion Rate | Short-first form architecture | Reduced abandonment |
| Click-to-Call CTR | Sticky header and mobile sticky call CTA | Increased call actions per session |
| Scheduler Completion Rate | Persistent schedule CTA + progressive detail capture | Improved completed bookings |
| LCP/CLS/INP | Mobile-first simplified layouts and controlled interaction load | Better technical performance |
| Accessibility Score | Keyboard/focus/aria requirements in all conversion modules | Higher audit pass rate |
| JS Error Budget | Standardized conversion component behaviors and event schema | Fewer client-side failures |

## Dependency Notes For Design And Frontend

### Design Dependencies
1. Maintain token fidelity from design-system/TOKENS.md.
2. Keep component state coverage from design-system/COMPONENT-SPECS.md.
3. Ensure contrast and keyboard rules stay compliant with design-system/ACCESSIBILITY-CONTRAST-MATRIX.md.
4. Apply responsive rhythm from design-system/RESPONSIVE-GRID-RULES.md.

### Frontend Dependencies
1. Implement CTA/event taxonomy in frontend/assets/js/system.js using standard naming.
2. Ensure template variants preserve two or more conversion paths per template.
3. Support dynamic content injection for service and location pages via structured data source.
4. Preserve mobile nav and focus behavior without regression.

### Integration Dependencies (External)
1. Form submission endpoint contract for emergency, service, location, and financing forms.
2. Analytics provider contract for standardized conversion events.
3. Financing provider flow contract (pre-qual and follow-up).
4. Service area validation data contract (zip, city, or geospatial rules).

## Unresolved IA Trade-Offs Requiring Owner Decision
| Decision | Option A | Option B | Option C | Recommendation |
| --- | --- | --- | --- | --- |
| Content rendering model | Static generation per slug | Runtime rendering from CMS/API | Hybrid pre-render + runtime long-tail | Option C for scale and performance balance |
| Analytics schema | Keep current mixed events | Enforce project standard taxonomy | Adopt GA4-native schema and map standard | Option B with GA4 mapping layer |
| Service area validation | Zip allowlist only | City plus zip eligibility | Geospatial polygons | Option B now, Option C phase-2 |
| Emergency page proliferation | Keep two emergency pages | Add one per high-volume service | Single universal emergency page | Option B for high-intent SEO + conversion |

## Acceptance Coverage Checklist (Execution Requirements)
- Complete sitemap and URL strategy: covered in "Complete Sitemap And URL Strategy".
- Intent clusters and three primary journeys: covered in "Intent Clusters And Journeys".
- Conversion entry points and CTA logic per template: covered in "Conversion Entry Points And CTA Logic By Template".
- Mobile-first behaviors (nav, sticky CTA, forms, trust): covered in "Mobile-First Behavior Specification".
- Wireframes for homepage, service, location, emergency: covered in "HVAC-Specific Wireframes".
- KPI mapping from Issue 1: covered in "KPI Mapping To IA And Journeys".
- Dependency notes for design and frontend: covered in "Dependency Notes For Design And Frontend".

## Artifact Paths
- ux/IA-CONVERSION-BLUEPRINT-v2.md (this document)
- ux/IA-SITEMAP-v1.md (baseline input)
- ux/JOURNEY-MAPS-v1.md (baseline input)
- ux/CONVERSION-UX-BLUEPRINT-v1.md (baseline input)
- ux/WIREFRAME-SPECS-v1.md (baseline input)
