# Issue 2 Validation Checklist

## Objective
Validate that Issue 2 is complete as a UX/IA architecture deliverable and that every execution requirement, validation requirement, and constraint has traceable evidence.

## Artifact Links And Paths
| Artifact | Path | Status |
| --- | --- | --- |
| Canonical IA and conversion UX blueprint | `ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md` | Complete |
| Baseline sitemap | `ux/IA-SITEMAP-v1.md` | Complete |
| Baseline journey maps | `ux/JOURNEY-MAPS-v1.md` | Complete |
| Baseline conversion UX blueprint | `ux/CONVERSION-UX-BLUEPRINT-v1.md` | Complete |
| Baseline wireframe specs | `ux/WIREFRAME-SPECS-v1.md` | Complete |
| Consolidated v2 reference | `ux/IA-CONVERSION-BLUEPRINT-v2.md` | Complete |
| Issue 1 KPI source | `governance/KPI-BASELINE-SHEET-v1.md` | Complete |
| Traceability matrix | `qa/ISSUE-2-3-TRACEABILITY-MATRIX.md` | Updated |
| Frontend target templates | `frontend/templates/homepage.html`, `frontend/templates/service-template.html`, `frontend/templates/location-template.html`, `frontend/templates/emergency-landing.html` | Complete |

## IA-To-Intent Mapping Table
| Intent Cluster | Primary URL Evidence | Template Evidence | Primary CTA | KPI Outcome |
| --- | --- | --- | --- | --- |
| Emergency | `/emergency-hvac/`, `/emergency-plumbing/` | Emergency template wireframe in `ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md` | Call Dispatch Now | Click-to-Call CTR, Booked Jobs |
| Estimate shopper | `/services/{service-slug}/` | Service template wireframe in `ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md` | Request {Service} Estimate | Form Completion Rate, Qualified Lead Rate |
| Financing-constrained | `/financing/` and financing modules on service pages | Financing journey and CTA logic in `ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md` | Check Financing Options | Revenue Per Visitor, Qualified Lead Rate |
| Trust validation | `/reviews/`, `/faq/`, homepage trust modules | Homepage and trust routing in `ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md` | Request service | Qualified Lead Rate, Close Rate |
| Location-based | `/locations/{city-st}/` | Location template wireframe in `ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md` | Check {City} Availability | Booked Jobs, Qualified Lead Rate |

## Execution Requirement Coverage
| Requirement | Evidence | Status |
| --- | --- | --- |
| Deliver a complete sitemap and URL strategy covering all required page types. | `ux/ISSUE-2-IA-CONVERSION-BLUEPRINT.md` section `Sitemap And URL Strategy` | Pass |
| Map user intent clusters and 3+ primary journeys. | Sections `Intent Clusters` and `Primary Journeys`; includes emergency, estimate, financing, and location journeys | Pass |
| Define conversion entry points and CTA logic for each core template. | Section `Conversion Entry Points And CTA Logic` | Pass |
| Specify mobile-first behaviors: nav, sticky CTAs, forms, and trust modules. | Section `Mobile-First Behavior Specification` | Pass |
| Produce wireframes for homepage, service template, location template, and emergency template. | Section `HVAC-Specific Wireframes` | Pass |
| Ensure IA and journeys map back to KPI outcomes from Issue 1. | Section `KPI Mapping Back To Issue 1`; KPI source `governance/KPI-BASELINE-SHEET-v1.md` | Pass |
| Include a dependency note for design and frontend teams. | Section `Design And Frontend Dependencies` | Pass |

## Validation Requirement Coverage
| Requirement | Evidence | Status |
| --- | --- | --- |
| Provide artifact links/paths. | Section `Artifact Links And Inputs` in blueprint and `Artifact Links And Paths` in this checklist | Pass |
| Provide an IA-to-intent mapping table. | Section `IA-To-Intent Mapping Table` in blueprint and summarized table in this checklist | Pass |
| Include checklist showing each acceptance criterion has been addressed. | `Acceptance Criteria Checklist` in blueprint and this validation file | Pass |
| Highlight unresolved IA trade-offs requiring owner decision. | Section `Unresolved IA Trade-Offs Requiring Owner Decision` | Pass |

## Constraints Compliance
| Constraint | Evidence | Status |
| --- | --- | --- |
| No generic wireframes; reflect HVAC conversion realities. | Wireframes include urgent symptoms, dispatch calls, service-area validation, repair/replacement estimate flows, maintenance, financing, and local proof. | Pass |
| Keep structure scalable to multi-service and multi-location expansion. | URL patterns include service, location, emergency service, and phase-2 service-in-location routes with canonical rules. | Pass |
| Avoid assumptions without documenting rationale. | `Assumptions And Rationale` table includes rationale and validation triggers. | Pass |

## Acceptance Criteria Checklist
- [x] Complete sitemap and URL strategy are documented.
- [x] Required page types are included: homepage, services index, service details, locations index, location details, emergency pages, financing, reviews, FAQ, blog, careers, referral, contact.
- [x] Scalable URL patterns and slug rules are documented.
- [x] Intent clusters are mapped to URLs, templates, CTAs, and KPIs.
- [x] At least three journeys are documented; four are included.
- [x] Conversion entry points and CTA logic are specified for homepage, service, location, and emergency templates.
- [x] Mobile nav behavior, sticky CTA behavior, form behavior, and trust module behavior are specified.
- [x] Homepage, service, location, and emergency wireframes are HVAC-specific.
- [x] KPI mapping references Issue 1 KPI categories and expected UX levers.
- [x] Design dependencies are documented.
- [x] Frontend dependencies are documented.
- [x] External dependencies are documented.
- [x] Owner-level IA trade-offs are highlighted.
- [x] Artifact paths are listed.

## Unresolved Owner Decisions
| Decision | Recommended Default | Owner Needed |
| --- | --- | --- |
| Content rendering model | Hybrid static generation with structured data | Program Lead and Frontend Lead |
| Service-in-location expansion | Create only proven high-demand combinations | SEO Owner |
| Emergency page proliferation | Broad pages now, service-specific pages after demand proof | Program Sponsor and SEO Owner |
| Service area validation | Zip/city allowlist now, geospatial later | Operations Owner |
| Financing flow | On-site capture then provider handoff | Finance Owner and Legal/Compliance |
| Chat placement | Defer until call/form tracking is stable | CX Lead |

## Validation Result
Issue 2 is complete and implementation-ready from a UX/IA architecture standpoint. Remaining items are owner decisions, not documentation blockers.
