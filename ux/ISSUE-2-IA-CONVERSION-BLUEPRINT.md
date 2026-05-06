# Issue 2 IA And Conversion UX Blueprint

## Purpose
This artifact is the canonical UX/IA handoff for the HVAC website program. It defines the scalable sitemap, URL strategy, intent model, conversion journeys, CTA logic, mobile-first behavior, wireframe blueprints, KPI traceability, implementation dependencies, documented assumptions, and owner-level trade-offs.

## Artifact Links And Inputs
| Artifact | Role |
| --- | --- |
| `ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md` | Canonical Issue 2 blueprint |
| `qa/ISSUE-2-VALIDATION-CHECKLIST.md` | Acceptance and validation checklist |
| `ux/IA-SITEMAP-v1.md` | Baseline sitemap input |
| `ux/JOURNEY-MAPS-v1.md` | Baseline journey input |
| `ux/CONVERSION-UX-BLUEPRINT-v1.md` | Baseline conversion input |
| `ux/WIREFRAME-SPECS-v1.md` | Baseline wireframe input |
| `governance/KPI-BASELINE-SHEET-v1.md` | Issue 1 KPI source |
| `frontend/templates/homepage.html` | Homepage implementation target |
| `frontend/templates/service-template.html` | Service template implementation target |
| `frontend/templates/location-template.html` | Location template implementation target |
| `frontend/templates/emergency-landing.html` | Emergency template implementation target |

## Assumptions And Rationale
| ID | Assumption | Rationale | Validation Trigger |
| --- | --- | --- | --- |
| A-01 | Mobile traffic is the primary conversion context. | Local HVAC users often arrive from search, map listings, and paid ads while actively dealing with an equipment issue. | Revisit if mobile sessions are below 45% for 30 consecutive days. |
| A-02 | Emergency pages should prioritize calls over forms. | Emergency HVAC and plumbing intent has high time sensitivity and requires dispatch confidence. | Revisit if emergency form leads book at least 20% better than emergency calls. |
| A-03 | Estimate shoppers need price confidence, proof, and process clarity before form submission. | Non-emergency users compare providers and need risk reduction before sharing contact details. | Revisit if service pages show high CTA clicks but low form starts. |
| A-04 | Financing-constrained users need a softer first conversion than a full quote request. | Payment concern is a blocker; forcing a full service form can suppress lead volume. | Revisit if financing leads underperform qualified lead rate by more than 15%. |
| A-05 | Initial IA must scale from static templates to multi-service, multi-location content. | The program requires repeatable expansion without URL churn or duplicate content. | Revisit when the service catalog exceeds 12 services or location catalog exceeds 10 locations. |
| A-06 | The phase-1 geography is Syracuse/Central New York. | Current baseline artifacts and prospect context reference Syracuse-area service demand. | Revisit when ownership confirms additional markets. |

## Sitemap And URL Strategy

### IA Principles
1. Put high-intent paths closest to the root: emergency, financing, services, and locations are top-level concepts.
2. Keep service and location pages canonical and reusable before creating long-tail service-in-location pages.
3. Make every primary template support at least two conversion paths: call plus form, schedule, estimate, callback, or financing.
4. Preserve SEO clarity with one canonical URL per page, deterministic slugs, and local/service schema opportunities.
5. Avoid content islands: every service, location, emergency, and financing page must cross-link to the next logical conversion-support page.

### Required Launch Sitemap
| Section | URL | Page Type | Primary Purpose |
| --- | --- | --- | --- |
| Home | `/` | Homepage | Triage emergency, service, financing, and trust intent. |
| Services index | `/services/` | Index | Route users into the right service category. |
| Heating repair | `/services/heating-repair/` | Service detail | Capture furnace/heat-pump repair estimates and calls. |
| AC repair | `/services/ac-repair/` | Service detail | Capture cooling repair estimates and calls. |
| Plumbing repair | `/services/plumbing-repair/` | Service detail | Capture plumbing repair estimates and calls. |
| Maintenance | `/services/maintenance/` | Service detail | Convert tune-up and preventive maintenance intent. |
| System installation | `/services/system-installation/` | Service detail | Convert replacement shoppers and financing users. |
| Locations index | `/locations/` | Index | Confirm coverage and route to local pages. |
| Syracuse | `/locations/syracuse-ny/` | Location detail | Convert local proof and availability intent. |
| Cicero | `/locations/cicero-ny/` | Location detail | Convert local proof and availability intent. |
| Liverpool | `/locations/liverpool-ny/` | Location detail | Convert local proof and availability intent. |
| HVAC emergency | `/emergency-hvac/` | Emergency landing | Convert urgent no-heat/no-cooling calls and callbacks. |
| Plumbing emergency | `/emergency-plumbing/` | Emergency landing | Convert active leak/no-water urgent calls and callbacks. |
| Financing | `/financing/` | Financing page | Convert payment-concerned users into pre-qual or support leads. |
| Reviews | `/reviews/` | Trust page | Reduce risk for shoppers near decision. |
| FAQ | `/faq/` | Trust/support page | Answer objections and route back to conversion paths. |
| Blog | `/blog/` | Education index | Support SEO and route to service pages. |
| Careers | `/careers/` | Recruiting page | Separate hiring intent from customer conversion flows. |
| Referral | `/referral/` | Referral page | Capture word-of-mouth and existing-customer referrals. |
| Contact | `/contact/` | Contact page | Provide fallback conversion and general inquiry route. |

### Scalable URL Patterns
| Pattern | Example | Use When | Canonical Notes |
| --- | --- | --- | --- |
| `/services/{service-slug}/` | `/services/ductless-mini-split-installation/` | A service has distinct search demand, copy, FAQs, and conversion logic. | Canonical service URL; no city modifier unless page is localized. |
| `/locations/{city-st}/` | `/locations/fayetteville-ny/` | A city has meaningful service coverage, reviews, or dispatch claims. | Canonical location URL; include unique local proof. |
| `/emergency-{service-slug}/` | `/emergency-heating-repair/` | A service has urgent, high-volume search demand. | Use only for urgent services to avoid thin pages. |
| `/locations/{city-st}/{service-slug}/` | `/locations/syracuse-ny/ac-repair/` | Phase-2 SEO expansion for proven service plus location demand. | Requires unique local proof, service specifics, and internal links to parent pages. |
| `/blog/{topic-slug}/` | `/blog/furnace-short-cycling/` | Educational content targets diagnostic or research intent. | Must include service and emergency escape CTAs. |

### Slug And Canonical Rules
| Rule | Specification |
| --- | --- |
| Slug format | Lowercase ASCII, kebab-case, no dates unless content truly expires. |
| Location format | `{city}-{state-abbrev}`, for example `syracuse-ny`. |
| Collision handling | Add county or neighborhood qualifier only when required. |
| Query parameters | Never canonical; strip from canonical tags and sitemap entries. |
| Trailing slash | Use trailing slash consistently for all public routes. |
| Redirects | Redirect variants, uppercase paths, and no-slash routes to canonical URL. |
| Metadata | Service title: `{Service} in Central New York | Brand`; location title: `HVAC And Plumbing in {City}, NY | Brand`; emergency title: `24/7 Emergency {Service} in Central New York | Brand`. |
| Structured data | Use LocalBusiness on home/location; Service on service/emergency; FAQPage where visible FAQs exist. |

## IA-To-Intent Mapping Table
| URL Or Pattern | Intent Cluster | User Questions | Core Template | Primary CTA | Secondary CTA | KPI Link |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Trust validation and path triage | Are they credible, local, and able to help with my issue? | Homepage | Schedule service | Call now | Lead Volume, Click-to-Call CTR |
| `/services/` | Service discovery | Do they handle my problem? | Service index | Choose service | Call now | Qualified Lead Rate |
| `/services/heating-repair/` | Repair estimate | Can they fix my heat, how soon, and what happens next? | Service | Request Heating Repair Estimate | Call service line | Form Completion Rate, Booked Jobs |
| `/services/ac-repair/` | Repair estimate | Can they restore cooling and diagnose the issue? | Service | Request AC Repair Estimate | Call service line | Form Completion Rate, Booked Jobs |
| `/services/plumbing-repair/` | Repair estimate or urgent issue | Is this urgent, and can they stop the problem? | Service | Request Plumbing Repair Estimate | Call service line | Qualified Lead Rate, Click-to-Call CTR |
| `/services/maintenance/` | Preventive care | Can I avoid breakdowns and schedule a tune-up? | Service | Schedule Maintenance | Call service line | Scheduler Completion Rate |
| `/services/system-installation/` | Replacement shopper | Should I replace, what is the process, and can I afford it? | Service | Request Installation Estimate | Check financing | Revenue Per Visitor, Qualified Lead Rate |
| `/locations/{city-st}/` | Local proof | Do they serve my city and respond quickly here? | Location | Check {City} Availability | Call local dispatch | Booked Jobs, Qualified Lead Rate |
| `/emergency-hvac/` | Emergency | Can someone respond now? | Emergency | Call Dispatch Now | Request emergency callback | Click-to-Call CTR, Booked Jobs |
| `/emergency-plumbing/` | Emergency | Can someone stop the leak or urgent plumbing issue now? | Emergency | Call Dispatch Now | Request emergency callback | Click-to-Call CTR, Booked Jobs |
| `/financing/` | Financing constrained | Can I pay over time without pressure? | Financing | Check Financing Options | Call financing support | Qualified Lead Rate, Revenue Per Visitor |
| `/reviews/` | Trust validation | Are they safe to hire? | Trust | Request service | Call now | Qualified Lead Rate |
| `/faq/` | Objection handling | What happens next, what does it cost, and what should I do? | FAQ | Request service | Call now | Form Completion Rate |
| `/contact/` | General conversion fallback | How do I reach them? | Contact | Submit contact form | Call now | Lead Volume |

## Intent Clusters
| Cluster | Behavioral Signal | Content Need | Conversion Need |
| --- | --- | --- | --- |
| Emergency | Searches include emergency, 24/7, no heat, no AC, leak, burst, smell, or immediate help. | Response expectation, safety guidance, coverage validation, direct phone access. | One-tap call and one-screen callback form. |
| Estimate shopper | Searches include repair, replacement, install, cost, near me, best company, or service type. | Symptoms, process, proof, pricing guidance, FAQs. | Estimate form, schedule CTA, and phone fallback. |
| Financing-constrained | Searches include financing, payment plan, monthly payment, replacement cost, or affordable HVAC. | Plain-language options, trust safeguards, low-pressure path. | Financing interest capture and support call. |
| Trust validation | Arrives from reviews, brand search, referrals, or FAQ content. | Licensing, guarantee, reviews, service area proof, recognizable local details. | Return to service request or call. |
| Location-based | Searches include city/neighborhood and service terms. | Coverage, local testimonials, nearby landmarks or neighborhoods, dispatch expectations. | Availability check and local call. |

## Primary Journeys

### Journey 1: Emergency User
| Stage | User State | UX Response | Conversion Event | KPI |
| --- | --- | --- | --- | --- |
| Entry | Equipment failed or active plumbing issue. | Dedicated emergency URL or emergency route from homepage/service urgent symptoms. | `view_emergency_template` | Lead Volume |
| First decision | Needs immediate reassurance. | Call-first hero with response expectation, service area note, and trust strip. | `click_call_hero_emergency` | Click-to-Call CTR |
| Fallback | Cannot call or line is busy. | One-screen callback form: name, phone, zip, emergency type. | `submit_form_request_emergency` | Form Completion Rate |
| Qualification | Dispatcher needs fit and locality. | Zip/city field and issue type route to dispatch notes. | `complete_emergency_lead` | Qualified Lead Rate |
| Booking | User commits to appointment or dispatch. | Confirmation state repeats phone number and next step. | `book_emergency_job` | Booked Jobs |

### Journey 2: Estimate Shopper
| Stage | User State | UX Response | Conversion Event | KPI |
| --- | --- | --- | --- | --- |
| Entry | Comparing providers for repair or replacement. | Service page hero names the problem and primary service. | `view_service_template` | Lead Volume |
| Evaluation | Wants confidence before contact. | Symptoms, process timeline, reviews, license/guarantee trust. | `expand_faq_service` | Qualified Lead Rate |
| Conversion | Ready for next step. | Short estimate form and sticky call/schedule fallback. | `submit_form_request_service` | Form Completion Rate |
| Objection | Concerned about cost or timeline. | Financing teaser, pricing context, appointment expectations. | `click_cta_financing_service` | Revenue Per Visitor |
| Booking | Confirms appointment. | Success state and scheduler handoff. | `complete_scheduler_service` | Scheduler Completion Rate |

### Journey 3: Financing-Constrained User
| Stage | User State | UX Response | Conversion Event | KPI |
| --- | --- | --- | --- | --- |
| Entry | Needs repair/replacement but payment is blocker. | Financing page or module uses plain language and no-pressure positioning. | `view_financing_page` | Lead Volume |
| Confidence | Needs to know options without committing. | Monthly-payment examples, eligibility caveats, trust notes. | `click_cta_financing_options` | Qualified Lead Rate |
| Soft conversion | Will share contact for options. | Financing interest form: name, phone, zip, project type. | `submit_form_financing` | Form Completion Rate |
| Sales support | Wants human explanation. | Financing support phone CTA. | `click_call_financing` | Click-to-Call CTR |
| Revenue path | Moves from financing discussion to estimate. | Service estimate cross-link after financing capture. | `complete_financing_lead` | Revenue Per Visitor |

### Journey 4: Location-Based Trust User
| Stage | User State | UX Response | Conversion Event | KPI |
| --- | --- | --- | --- | --- |
| Entry | Searches for HVAC/plumbing in a specific city. | Location page confirms city coverage above fold. | `view_location_template` | Lead Volume |
| Validation | Wants proof they are local and available. | Neighborhood list, city testimonials, service-area note. | `click_review_location` | Qualified Lead Rate |
| Conversion | Needs availability confirmation. | "Check {City} Availability" form and local call strip. | `submit_form_request_location` | Booked Jobs |

## Conversion Entry Points And CTA Logic

### Global CTA Hierarchy
| Intent State | Primary CTA | Secondary CTA | Tertiary Support |
| --- | --- | --- | --- |
| Emergency | Call Dispatch Now | Request Emergency Callback | Service area confirmation |
| Repair | Request {Service} Estimate | Call Service Line | Symptom checker |
| Replacement | Request Installation Estimate | Check Financing Options | Reviews and warranty proof |
| Maintenance | Schedule Maintenance | Call Service Line | Plan/tune-up benefits |
| Local proof | Check {City} Availability | Call Local Dispatch | Local testimonials |
| Financing | Check Financing Options | Call Financing Support | Monthly payment examples |

### CTA Logic By Core Template
| Template | Entry Points | Above-Fold Rule | Scroll Rule | Urgency Rule | Measurement |
| --- | --- | --- | --- | --- | --- |
| Homepage | Hero schedule CTA, header call CTA, mobile sticky bar, service-card CTAs, financing module. | Show one primary schedule CTA and one call CTA without requiring scroll. | After services grid, repeat CTA matching the most prominent service category. | Emergency strip routes to `/emergency-hvac/` or `/emergency-plumbing/`. | Track header, hero, service-card, financing, and sticky CTA separately. |
| Service | Hero estimate CTA, call CTA, urgent symptom escalation, inline form, financing teaser. | Primary CTA uses service name; phone fallback visible. | Repeat CTA after symptom block and before FAQ. | If symptom is no heat/no cooling/active leak/safety concern, promote call copy and expose emergency path. | Track service slug and urgency selection. |
| Location | City availability CTA, call strip, local request form, reviews CTA. | City name and coverage proof must appear before first CTA or directly inside hero. | Repeat availability CTA after local proof/reviews. | If same-day availability is supported, show badge near CTA; otherwise avoid unverified speed claim. | Track location slug and form/call path. |
| Emergency | Hero call CTA, sticky call bar, emergency callback form, backup CTA. | Call is dominant and callback form begins in first viewport on mobile when feasible. | Repeat call CTA after trust strip and before footer. | Always call-first; form is fail-safe. | Track calls, callback starts, callback submits, and zip eligibility. |

### Form Architecture
| Form Type | Required Fields | Optional Fields | Reasoning |
| --- | --- | --- | --- |
| Emergency callback | Name, phone, zip, emergency type. | Notes, callback preference. | Captures dispatch-critical data with minimal typing. |
| Service estimate | Name, phone, zip, service issue. | Email, preferred time, equipment age, notes. | Short-first capture improves starts while optional details help qualification. |
| Location availability | Name, phone, zip or city, service needed. | Neighborhood, preferred time. | Validates coverage and supports routing. |
| Financing interest | Name, phone, zip, project type. | Email, estimated budget, preferred contact time. | Avoids forcing sensitive financial details before trust is established. |
| Contact fallback | Name, phone or email, reason. | Message. | General capture without competing with service-specific flows. |

## Mobile-First Behavior Specification

### Navigation
| Behavior | Requirement |
| --- | --- |
| Header | Compact logo, nav disclosure button, and call affordance remain visible. |
| Menu | Opens as a focused disclosure/drawer, traps focus, locks body scroll, closes on Escape, restores focus to trigger. |
| Priority links | Emergency, Services, Locations, Financing, Reviews, Contact. |
| Service expansion | Services can expand inside the mobile menu; emergency links remain visually distinct. |
| Touch targets | Every interactive element is at least 44x44px. |

### Sticky CTAs
| Context | Mobile Sticky CTA Behavior |
| --- | --- |
| Homepage | Two actions: Call Now and Schedule. Visible after initial render; does not cover footer content. |
| Service | Two actions: Call and Estimate. If urgent symptom selected, Call becomes visually primary. |
| Location | Two actions: Call and Check Availability. City label can appear in accessible text, not cramped button text. |
| Emergency | Call action dominates; callback is secondary. Sticky bar remains persistent except when keyboard overlap requires compression. |
| Forms | When focused input opens the keyboard, sticky bar reduces or yields enough viewport space to avoid covering submit/error states. |

### Forms
| Behavior | Requirement |
| --- | --- |
| Layout | One-column fields on mobile; labels stay visible above controls. |
| Validation | Inline errors, `aria-live`, `aria-invalid`, focus to first invalid field on failed submit. |
| Progressive disclosure | Service/location forms capture required fields first and reveal optional details after initial contact fields. |
| Input mode | Use `tel` for phone, numeric input mode for zip, service selectors for issue type where possible. |
| Success state | Confirmation states repeat next step and phone fallback. |

### Trust Modules
| Module | Mobile Placement |
| --- | --- |
| License/insured proof | Above fold on emergency; near first CTA on homepage/service/location. |
| Reviews | Short review snapshot near first conversion path, deeper reviews lower on page. |
| Response expectation | Above fold on emergency and location; near CTA on service pages where verified. |
| Financing proof | On replacement-heavy service pages and financing page; must not displace primary emergency CTA. |
| Guarantees | Near form or after process section to reduce hesitation before conversion. |

## HVAC-Specific Wireframes

### Homepage Wireframe
```text
Mobile first
[Skip link]
[Header: Logo | Menu | Call]
[Hero]
  H1: Local heating, cooling, and plumbing help
  Seasonal subhead: repair, replacement, maintenance, emergency routing
  Primary CTA: Schedule Service
  Secondary CTA: Call Now
  Emergency quick links: Emergency HVAC | Emergency Plumbing
[Trust strip]
  Licensed/insured | Review score | Local response promise
[Service triage]
  Heating Repair -> Request Heating Repair Estimate
  AC Repair -> Request AC Repair Estimate
  Plumbing Repair -> Request Plumbing Repair Estimate
  Maintenance -> Schedule Maintenance
  Installation -> Request Installation Estimate + Financing cue
[Short request form]
  Name, phone, zip, service needed
[Financing band]
  Payment-options copy, "Check Financing Options"
[Reviews]
  2-3 short proof points, link to Reviews
[FAQ accordion]
  Cost, timing, emergency criteria, service area
[Footer]
  NAP, hours, service area links, emergency phone
[Sticky mobile CTA: Call | Schedule]

Desktop additions
[Header includes Services, Locations, Financing, Reviews, Contact, Call, Schedule]
[Hero uses two-column composition: copy/CTAs + compact request form or trust proof]
[Services display in responsive grid; financing and reviews appear as full-width bands]
```

### Service Template Wireframe
```text
Mobile first
[Header: Logo | Menu | Call]
[Breadcrumb: Home > Services > {Service}]
[Service hero]
  H1: {Service} in Central New York
  Symptom-aware intro
  Primary CTA: Request {Service} Estimate
  Secondary CTA: Call Service Line
  Trust microcopy: licensed, local, clear next step
[Urgent symptom selector]
  Options: no heat, no cooling, leak, safety concern, routine issue
  Urgent selection reveals: "This may need immediate dispatch" + Call Dispatch Now
[Common symptoms]
  Collapsible cards tied to HVAC/plumbing realities
[Process timeline]
  1. Diagnose  2. Explain options  3. Repair/replace or schedule follow-up
[Service-specific trust]
  Certifications, warranty/guarantee, review quote
[Financing teaser]
  Visible for installation/replacement; secondary for repair
[Estimate form]
  Required: name, phone, zip, issue
  Optional: email, preferred time, equipment age, notes
[FAQ]
  Cost, timing, emergency threshold, financing, coverage
[Footer]
[Sticky mobile CTA: Call | Estimate]

Desktop additions
[Hero can place form/trust proof beside service copy]
[Symptoms and process can use two-column layout]
[CTA repeats after process and before FAQ]
```

### Location Template Wireframe
```text
Mobile first
[Header: Logo | Menu | Call]
[Breadcrumb: Home > Locations > {City}]
[Local proof hero]
  H1: HVAC and plumbing service in {City}, NY
  Coverage proof: neighborhoods/nearby areas served
  Primary CTA: Check {City} Availability
  Secondary CTA: Call Local Dispatch
[Coverage block]
  Service area confirmation, dispatch expectation if verified, zip/city check
[Local services]
  Heating, cooling, plumbing, maintenance, installation
[Local testimonials]
  City-labeled proof; avoid unverifiable claims
[Click-to-call strip]
  Phone, hours, emergency route
[Availability form]
  Name, phone, zip/city, service needed
[Location FAQ]
  Service area, travel fees, same-day availability, emergency handling
[Footer with nearby location links]
[Sticky mobile CTA: Call | Availability]

Desktop additions
[Hero can pair local copy with availability form]
[Neighborhood/service modules use compact grid]
[Nearby locations and parent locations index linked from footer area]
```

### Emergency Template Wireframe
```text
Mobile first
[Minimal header: Logo | Call Dispatch Now]
[Urgent hero]
  H1: 24/7 emergency HVAC/plumbing help
  Clear issue examples: no heat, no cooling, active leak, safety concern
  Dominant CTA: Call Dispatch Now
  Secondary CTA: Request Emergency Callback
  Trust strip: licensed/insured, local dispatch, service area
[Emergency callback form]
  Name, phone, zip, emergency type
  Submit: Request Emergency Callback
[What to expect]
  1. Call/callback  2. Confirm location and issue  3. Dispatch/next step
[Service area check]
  Zip/city confirmation and emergency service area note
[Guarantee/trust]
  Review snapshot, safety note, no-pressure explanation
[Backup CTA]
  Call Dispatch Now
[Footer with emergency phone repeated]
[Sticky mobile CTA: Call Dispatch Now | Callback]

Desktop additions
[Hero and emergency form appear side by side where viewport allows]
[Non-critical content remains below conversion area]
[No large nav or content detours above first conversion path]
```

## KPI Mapping Back To Issue 1
| Issue 1 KPI | Blueprint Lever | Journey Link | Measurement Event Examples |
| --- | --- | --- | --- |
| Lead Volume | Full sitemap creates multiple intent-matched entry points with at least two conversion paths per template. | All journeys | `submit_form_request_service`, `submit_form_request_location`, `submit_form_financing` |
| Qualified Lead Rate | Service/location specificity, zip/service fields, urgency selectors, and financing route separation improve intent fit. | Estimate, financing, location | `complete_service_lead`, `complete_financing_lead` |
| Booked Jobs | Emergency call-first UX, local availability CTAs, and confirmation states reduce delay between need and dispatch/schedule. | Emergency, location | `click_call_hero_emergency`, `book_emergency_job` |
| Close Rate | Trust modules, process clarity, reviews, guarantees, and financing support reduce perceived risk. | Estimate, trust validation | `expand_faq_service`, `click_review_location` |
| Revenue Per Visitor | Replacement/installation paths and financing CTAs route higher-ticket users into qualified estimate flows. | Estimate, financing | `click_cta_financing_service`, `submit_form_financing` |
| CAC Proxy | Intent-first URL architecture reduces wasted clicks and supports reusable landing templates. | All journeys | Landing-page conversion by source/medium |
| Form Completion Rate | Short-first forms, accessible validation, and optional detail capture reduce abandonment. | Estimate, financing, emergency fallback | `start_form_*`, `submit_form_*` |
| Click-to-Call CTR | Header, hero, and sticky mobile call CTAs keep phone conversion accessible. | Emergency, location, service | `click_call_header_homepage`, `click_call_sticky_mobile_emergency` |
| Chat-to-Lead Rate | Chat is a secondary support path after core IA; should inherit service/location/urgency context when implemented. | Estimate, financing | Future `start_chat_service_context` |
| Scheduler Completion Rate | Schedule CTAs, location availability flows, and confirmation states support completed booking handoff. | Estimate, maintenance, location | `complete_scheduler_service` |
| Core Web Vitals Pass Rate | Mobile-first, low-complexity templates and limited above-fold modules reduce layout and interaction load. | All journeys | CWV by template |
| Accessibility Score | Focus management, visible labels, aria validation, and 44px targets are explicit UX requirements. | All journeys | Accessibility QA pass rate |
| Index Coverage | Canonical URL rules, deterministic slugs, and phase-based expansion reduce duplicate/thin-page risk. | SEO entry paths | Indexed canonical URLs |
| JS Error Budget | Standard CTA taxonomy and reusable form/nav behaviors reduce custom script drift. | All journeys | JS errors per template |

## Design And Frontend Dependencies

### Design Team Dependencies
| Dependency | Required Action |
| --- | --- |
| Design tokens | Use `design-system/TOKENS.md`; do not introduce unapproved colors, spacing, typography, or radius values. |
| Component states | Cover default, hover, focus, active, disabled, validation, loading, success, and urgent states. |
| Mobile wireframes | Start at 360px and ensure sticky CTA, form errors, and trust modules do not overlap. |
| Trust content | Provide verified license, review, guarantee, response, and financing content before final mockups. |
| Wireframe fidelity | Preserve HVAC-specific conversion order: emergency call, service estimate, local availability, financing support. |

### Frontend Team Dependencies
| Dependency | Required Action |
| --- | --- |
| Template data model | Represent services, locations, emergency routes, FAQs, CTAs, reviews, and trust badges as structured data. |
| CTA taxonomy | Implement canonical `action_object_context_template` events through `data-track`. |
| Forms | Preserve short-first architecture, accessible validation, and form-specific required fields. |
| Mobile nav | Keep focus trap, Escape handling, scroll lock, and focus restore. |
| Sticky CTAs | Prevent overlap with form fields, submit buttons, validation messages, and footer content. |
| SEO | Implement canonical tags, sitemap entries, metadata patterns, and schema per page type. |
| Analytics | Map form starts, submits, call clicks, sticky CTA clicks, urgency selections, and financing clicks to KPI reporting. |

### External Dependencies
| Dependency | Owner Decision Needed |
| --- | --- |
| Form endpoint | Define payload shape and routing for emergency, service, location, financing, and contact forms. |
| Dispatch availability | Confirm whether same-day or response-window claims can be made by service/location. |
| Financing provider | Confirm provider, compliance language, pre-qual flow, and whether users leave site. |
| Reviews source | Confirm verified review feed or approved static review excerpts. |
| Service area model | Confirm city/zip eligibility rules and phase-2 geospatial plan. |

## Unresolved IA Trade-Offs Requiring Owner Decision
| Decision | Option A | Option B | Option C | Recommended Default | Why It Matters |
| --- | --- | --- | --- | --- | --- |
| Content rendering model | Static HTML pages | CMS/runtime rendering | Hybrid static generation with structured data | Option C | Balances page speed, scale, and content governance. |
| Service-in-location expansion | Do not create long-tail pages | Create all service x city pages immediately | Create only proven high-demand combinations | Option C | Avoids thin content while preserving SEO upside. |
| Emergency page proliferation | Two broad emergency pages | One page per urgent service | Broad pages now, service-specific pages after demand proof | Option C | Protects conversion clarity and avoids unnecessary content maintenance. |
| Service area validation | City list only | Zip/city allowlist | Geospatial polygons | Option B now, Option C later | Prevents unserviceable leads while keeping forms simple. |
| Financing flow | On-site interest form | Third-party prequal redirect | On-site capture then provider handoff | Option C | Preserves lead capture before users enter compliance/provider flow. |
| Chat placement | Persistent chat on all pages | Contextual chat after scroll | Defer until core call/form tracking is stable | Option C | Prevents chat from cannibalizing urgent phone/form conversions without data. |

## Acceptance Criteria Checklist
| Requirement | Status | Evidence |
| --- | --- | --- |
| Complete sitemap and URL strategy covering all required page types | Done | `Sitemap And URL Strategy` section |
| User intent clusters and 3+ primary journeys | Done | `Intent Clusters` and `Primary Journeys` sections |
| Conversion entry points and CTA logic for each core template | Done | `Conversion Entry Points And CTA Logic` section |
| Mobile-first behaviors: nav, sticky CTAs, forms, trust modules | Done | `Mobile-First Behavior Specification` section |
| Wireframes for homepage, service, location, emergency templates | Done | `HVAC-Specific Wireframes` section |
| IA and journeys map back to Issue 1 KPI outcomes | Done | `KPI Mapping Back To Issue 1` section |
| Dependency note for design and frontend teams | Done | `Design And Frontend Dependencies` section |
| Artifact links and paths | Done | `Artifact Links And Inputs` section |
| IA-to-intent mapping table | Done | `IA-To-Intent Mapping Table` section |
| Acceptance checklist | Done | This section plus `qa/ISSUE-2-VALIDATION-CHECKLIST.md` |
| Unresolved IA trade-offs requiring owner decision | Done | `Unresolved IA Trade-Offs Requiring Owner Decision` section |
| HVAC-specific, non-generic wireframes | Done | Wireframes include emergency, symptoms, dispatch, financing, local proof, and service-area realities |
| Scalable multi-service and multi-location structure | Done | URL patterns, slug rules, phase-2 service-in-location pattern |
| Assumptions documented with rationale | Done | `Assumptions And Rationale` section |
