# Issue 2 And Issue 3 Traceability Matrix

## Canonical Issue 2 Source
| Artifact | Purpose | Status |
| --- | --- | --- |
| ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md | Canonical UX/IA architecture and conversion blueprint for Issue 2, including sitemap, URL strategy, intent mapping, journeys, CTA logic, mobile behavior, wireframes, KPI mapping, dependencies, assumptions, and unresolved trade-offs | complete |
| qa/ISSUE-2-VALIDATION-CHECKLIST.md | Issue 2 validation checklist with artifact links, IA-to-intent mapping, acceptance coverage, constraints validation, and owner decisions | complete |

## Template To Artifact Mapping
| Implemented Template | Issue 2 Artifact Reference | Issue 3 Artifact Reference | Status |
| --- | --- | --- | --- |
| frontend/templates/homepage.html | ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md (Homepage wireframe, homepage CTA logic, trust/triage intent) | design-system/COMPONENT-SPECS.md and design-system/TOKENS.md | complete |
| frontend/templates/service-template.html | ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md (Service wireframe, estimate shopper journey, urgent symptom CTA rules) | design-system/COMPONENT-SPECS.md and design-system/RESPONSIVE-GRID-RULES.md | complete |
| frontend/templates/location-template.html | ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md (Location wireframe, location-based intent, availability CTA rules) | design-system/COMPONENT-SPECS.md and design-system/ACCESSIBILITY-CONTRAST-MATRIX.md | complete |
| frontend/templates/emergency-landing.html | ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md (Emergency wireframe, emergency journey, call-first CTA rules) | design-system/COMPONENT-SPECS.md and design-system/DESIGN-QA-CHECKLIST.md | complete |

## Shared System Mapping
| Implemented System | Issue 2 Requirement | Issue 3 Requirement | Status |
| --- | --- | --- | --- |
| frontend/assets/css/system.css | Mobile-first interaction support and persistent CTA architecture | Tokenized visual system and responsive grid rules | complete |
| frontend/assets/js/system.js | Sticky and persistent conversion path behavior, form architecture support | State behavior for nav, form, and accordion components | complete |
| frontend/components/README.md | Conversion entry consistency across templates | Reusable component rules and anti-drift implementation guidance | complete |

## Issue 3 v2 Architecture And Validation Mapping
| Artifact | Purpose | Requirement Coverage | Status |
| --- | --- | --- | --- |
| ux/IA-CONVERSION-BLUEPRINT-v2.md | Consolidated IA, URL strategy, journeys, CTA logic, mobile behavior, wireframes, KPI mapping, dependency notes | Execution requirements 1 through 7 | complete |
| qa/ISSUE-3-VALIDATION-CHECKLIST-v2.md | Validation matrix with artifact links, IA-to-intent checks, acceptance checklist, unresolved trade-offs | Validation requirements 1 through 3 | complete |

## IA-To-Intent Canonical Mapping Reference
| URL Pattern | Intent Cluster | Primary Journey | Source Artifact |
| --- | --- | --- | --- |
| / | trust validation plus triage | estimate and emergency diversion | ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md |
| /services/{service-slug}/ | repair or replacement | estimate shopper | ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md |
| /locations/{city-st}/ | location-based trust | location-based trust | ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md |
| /emergency-hvac/ and /emergency-plumbing/ | emergency | emergency | ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md |
| /financing/ | financing-constrained | financing-constrained | ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md |
