# Issue 2 And Issue 3 Traceability Matrix

## Template To Artifact Mapping
| Implemented Template | Issue 2 Artifact Reference | Issue 3 Artifact Reference | Status |
| --- | --- | --- | --- |
| frontend/templates/homepage.html | ux/WIREFRAME-SPECS-v1.md (Homepage) and ux/CONVERSION-UX-BLUEPRINT-v1.md | design-system/COMPONENT-SPECS.md and design-system/TOKENS.md | complete |
| frontend/templates/service-template.html | ux/WIREFRAME-SPECS-v1.md (Service Template) and ux/JOURNEY-MAPS-v1.md | design-system/COMPONENT-SPECS.md and design-system/RESPONSIVE-GRID-RULES.md | complete |
| frontend/templates/location-template.html | ux/WIREFRAME-SPECS-v1.md (Location Template) and ux/IA-SITEMAP-v1.md | design-system/COMPONENT-SPECS.md and design-system/ACCESSIBILITY-CONTRAST-MATRIX.md | complete |
| frontend/templates/emergency-landing.html | ux/WIREFRAME-SPECS-v1.md (Emergency Landing) and ux/JOURNEY-MAPS-v1.md | design-system/COMPONENT-SPECS.md and design-system/DESIGN-QA-CHECKLIST.md | complete |

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
| / | trust validation plus triage | estimate and emergency diversion | ux/IA-CONVERSION-BLUEPRINT-v2.md |
| /services/{service-slug}/ | repair or replacement | estimate shopper | ux/IA-CONVERSION-BLUEPRINT-v2.md |
| /locations/{location-slug}/ | location-based trust | estimate and trust validation | ux/IA-CONVERSION-BLUEPRINT-v2.md |
| /emergency-hvac/ and /emergency-plumbing/ | emergency | emergency | ux/IA-CONVERSION-BLUEPRINT-v2.md |
| /financing/ | financing-constrained | financing-constrained | ux/IA-CONVERSION-BLUEPRINT-v2.md |
