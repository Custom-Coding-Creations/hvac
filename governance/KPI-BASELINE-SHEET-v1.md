# KPI Baseline Sheet v1

## Baseline Assumptions Source
- docs/website-analysis-roi-research.md
- .customer/potter-perrone/prospect-analysis-potter-perrone.md

## Business KPIs

| KPI | Formula | Owner | Baseline | 30-Day Target | 90-Day Target | Source Cadence |
| --- | --- | --- | --- | --- | --- | --- |
| Lead Volume | unique leads per month | Analytics Lead | 36 leads/month | 54 leads/month | 90 leads/month | weekly rollup |
| Qualified Lead Rate | qualified leads / total leads | Sales Ops Lead | 0.32 | 0.36 | 0.42 | weekly |
| Booked Jobs | booked jobs per month | Sales Manager | 12 jobs/month | 17 jobs/month | 29 jobs/month | weekly |
| Close Rate | won jobs / qualified leads | Sales Manager | 0.32 | 0.33 | 0.35 | weekly |
| Revenue Per Visitor | monthly revenue / monthly sessions | Finance Owner | 13.07 USD | 18.00 USD | 24.00 USD | monthly |
| CAC Proxy | monthly marketing and web cost / new customers | Finance Owner | 420 USD | 360 USD | 300 USD | monthly |
| Payback Period | implementation cost / monthly incremental gross profit | Program Lead | 9 days (estimate) | <= 20 days actualized | <= 15 days sustained | monthly |

## Conversion KPIs

| KPI | Formula | Owner | Baseline | 30-Day Target | 90-Day Target | Source Cadence |
| --- | --- | --- | --- | --- | --- | --- |
| Form Completion Rate | completed forms / started forms | Frontend Lead | 0.28 | 0.40 | 0.52 | weekly |
| Click-to-Call CTR | call clicks / sessions | Frontend Lead | 0.018 | 0.030 | 0.045 | weekly |
| Chat-to-Lead Rate | qualified chat leads / chat starts | CX Lead | 0.10 | 0.16 | 0.22 | weekly |
| Scheduler Completion Rate | completed bookings / scheduler starts | CX Lead | 0.18 | 0.30 | 0.45 | weekly |

## Technical KPIs

| KPI | Formula | Owner | Baseline | 30-Day Target | 90-Day Target | Source Cadence |
| --- | --- | --- | --- | --- | --- | --- |
| Core Web Vitals Pass Rate | pages passing CWV / measured pages | Frontend Lead | 0.35 | 0.70 | 0.90 |
| LCP p75 | 75th percentile largest contentful paint | Frontend Lead | 4.2s | <= 3.0s | <= 2.5s |
| CLS p75 | 75th percentile cumulative layout shift | Frontend Lead | 0.19 | <= 0.12 | <= 0.10 |
| INP p75 | 75th percentile interaction to next paint | Frontend Lead | 280ms | <= 220ms | <= 200ms |
| Uptime SLA | successful uptime minutes / total minutes | Platform Owner | 99.0% | 99.5% | 99.9% |
| Accessibility Score | audited checks passed / total checks | QA Owner | 0.74 | 0.88 | 0.95 |
| Index Coverage | valid indexed pages / submitted pages | SEO Owner | 0.62 | 0.80 | 0.95 |
| JS Error Budget | uncaught JS errors / 1000 sessions | Frontend Lead | 14 | <= 8 | <= 3 |

## KPI Definitions And Measurement Rules
- Baseline window is current 30-day estimate from audit reports.
- 30-day target is transitional and must be operationally feasible.
- 90-day target is required for launch success review.
- If a KPI data source is unavailable, status is set to At Risk and escalated in weekly review.
