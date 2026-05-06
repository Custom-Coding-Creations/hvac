# KPI Baseline Sheet

**Version:** 2.0  
**Status:** Active  
**Last Updated:** 2026-05-06  
**Owner:** Analytics Lead  
**Review Cadence:** Weekly (conversion/technical), Monthly (business)  

---

## Purpose

This document defines all key performance indicators (KPIs) for the HVAC website program. Each KPI includes formula, baseline, targets, owner, source of truth, and reporting cadence to enable data-driven decision making and progress tracking.

---

## Baseline Data Sources

### Primary Sources
- **Historical Data:** `docs/website-analysis-roi-research.md`
- **Prospect Analysis:** `.customer/potter-perrone/prospect-analysis-potter-perrone.md`
- **Current Analytics:** Google Analytics 4 (to be instrumented)
- **CRM Data:** Sales pipeline data (to be connected)
- **Technical Monitoring:** PageSpeed Insights, Search Console, Uptime monitoring

### Baseline Window
- **Period:** 30-day rolling average before implementation
- **Date Range:** 2026-04-01 to 2026-05-01
- **Baseline Type:** Estimated from audit data (to be replaced with actual instrumentation)
- **Update Trigger:** First 2 weeks of real data available, update if variance >20%

---

## Business KPIs

### Lead Volume
**Definition:** Unique qualified leads captured per month from all sources  
**Formula:** `COUNT(DISTINCT lead_id WHERE lead_date >= month_start AND lead_date < month_end)`  
**Owner:** Analytics Lead  
**Source of Truth:** CRM lead tracking system  
**Reporting Cadence:** Weekly rollup, reviewed in weekly operating review  
**Measurement Method:** Automated CRM export, deduplicated by email/phone  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 36 leads/month | Current average from historical data |
| 30-Day Target | 54 leads/month | +50% improvement |
| 90-Day Target | 90 leads/month | +150% improvement (sustainable target) |
| Alert Threshold | <40 leads/month at 30 days | Trigger investigation if trending low |
| Stretch Goal | 100 leads/month | Aggressive target if conversion exceeds plan |

---

### Qualified Lead Rate
**Definition:** Percentage of total leads that meet qualification criteria (budget, timeline, geography)  
**Formula:** `(qualified_leads / total_leads) × 100`  
**Owner:** Sales Ops Lead  
**Source of Truth:** CRM qualification status field  
**Reporting Cadence:** Weekly  
**Measurement Method:** Sales team qualification logged in CRM within 48 hours of lead capture  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 32% | Current qualification rate |
| 30-Day Target | 36% | +4pp improvement through better intent targeting |
| 90-Day Target | 42% | +10pp improvement (best-in-class target) |
| Alert Threshold | <33% at 30 days | May indicate poor lead quality or targeting issues |
| Qualification Criteria | Budget ≥$2k, timeline ≤90 days, service area = Syracuse metro | Documented in CRM |

---

### Booked Jobs
**Definition:** Number of jobs booked (contract signed) per month from qualified leads  
**Formula:** `COUNT(job_id WHERE status = 'booked' AND booking_date >= month_start AND booking_date < month_end)`  
**Owner:** Sales Manager  
**Source of Truth:** CRM job tracking system  
**Reporting Cadence:** Weekly  
**Measurement Method:** Sales team updates job status in CRM upon contract signature  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 12 jobs/month | Current average |
| 30-Day Target | 17 jobs/month | +42% improvement |
| 90-Day Target | 29 jobs/month | +142% improvement aligned to lead volume growth |
| Alert Threshold | <14 jobs/month at 30 days | May indicate conversion funnel issues |
| Average Job Value | $3,500 | Used for revenue calculations |

---

### Close Rate
**Definition:** Percentage of qualified leads that convert to booked jobs  
**Formula:** `(won_jobs / qualified_leads) × 100`  
**Owner:** Sales Manager  
**Source of Truth:** CRM pipeline reports  
**Reporting Cadence:** Weekly  
**Measurement Method:** CRM automated calculation from pipeline data  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 32% | Current close rate from qualified leads |
| 30-Day Target | 33% | +1pp improvement (modest early goal) |
| 90-Day Target | 35% | +3pp improvement through better lead quality |
| Alert Threshold | <31% at 30 days | May indicate sales process or lead quality issues |
| Industry Benchmark | 30-40% | Home services typical range |

---

### Revenue Per Visitor
**Definition:** Average revenue generated per website session  
**Formula:** `(total_monthly_revenue / monthly_sessions)`  
**Owner:** Finance Owner  
**Source of Truth:** CRM revenue data + Google Analytics session data  
**Reporting Cadence:** Monthly  
**Measurement Method:** Finance calculates monthly revenue, Analytics provides session count, values joined for calculation  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | $13.07 USD | Current estimated revenue per visitor |
| 30-Day Target | $18.00 USD | +38% improvement |
| 90-Day Target | $24.00 USD | +84% improvement |
| Alert Threshold | <$14.00 at 30 days | May indicate traffic quality or conversion issues |
| Calculation Example | $45,000 revenue ÷ 3,000 sessions = $15.00 per visitor | |

---

### Customer Acquisition Cost (CAC) Proxy
**Definition:** Total marketing and website costs per new customer acquired  
**Formula:** `(monthly_marketing_cost + monthly_website_cost) / new_customers_acquired`  
**Owner:** Finance Owner  
**Source of Truth:** Finance expense tracking + CRM new customer count  
**Reporting Cadence:** Monthly  
**Measurement Method:** Finance aggregates costs, CRM provides new customer count  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | $420 USD | Current estimated CAC |
| 30-Day Target | $360 USD | -14% reduction through better conversion |
| 90-Day Target | $300 USD | -29% reduction (target efficiency) |
| Alert Threshold | >$450 at 30 days | May indicate cost increase or conversion drop |
| Target CAC:LTV Ratio | 1:3 or better | LTV estimated at $1,200 per customer |

---

### Payback Period
**Definition:** Number of days to recover implementation investment through incremental gross profit  
**Formula:** `implementation_cost / (monthly_incremental_gross_profit / 30)`  
**Owner:** Program Lead  
**Source of Truth:** Finance implementation cost tracking + monthly profit reports  
**Reporting Cadence:** Monthly  
**Measurement Method:** Finance calculates incremental profit vs. baseline, divides total cost by daily incremental profit  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 9 days (estimate) | Based on projected improvements |
| 30-Day Target | ≤20 days (actual) | Acceptable payback threshold |
| 90-Day Target | ≤15 days (sustained) | Optimized payback |
| Alert Threshold | >25 days at 30 days | May require intervention or timeline adjustment |
| Implementation Cost | $15,000 (estimated) | Includes design, development, QA |
| Monthly Incremental Profit | $18,000 (projected) | Based on lead volume and revenue improvements |

---

## Conversion KPIs

### Form Completion Rate
**Definition:** Percentage of started forms that are successfully submitted  
**Formula:** `(completed_forms / started_forms) × 100`  
**Owner:** Frontend Lead  
**Source of Truth:** Google Analytics 4 form events  
**Reporting Cadence:** Weekly  
**Measurement Method:** GA4 tracks `form_start` and `form_submit` events, completion rate calculated automatically  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 28% | Current estimate (industry low-average) |
| 30-Day Target | 40% | +12pp improvement through UX optimization |
| 90-Day Target | 52% | +24pp improvement (best-in-class target) |
| Alert Threshold | <35% at 30 days | May indicate form UX or validation issues |
| Instrumentation | GA4 events: `form_start`, `form_submit`, `form_error` | Track by form type |

**Form Types Tracked:**
- Emergency request form (short)
- General estimate form (medium)
- Financing inquiry form (long)
- Newsletter signup (minimal)

---

### Click-to-Call CTR
**Definition:** Percentage of sessions that result in a phone call click  
**Formula:** `(call_clicks / total_sessions) × 100`  
**Owner:** Frontend Lead  
**Source of Truth:** Google Analytics 4 click events  
**Reporting Cadence:** Weekly  
**Measurement Method:** GA4 tracks clicks on `tel:` links, CTR calculated from session count  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 1.8% | Current estimate |
| 30-Day Target | 3.0% | +1.2pp improvement |
| 90-Day Target | 4.5% | +2.7pp improvement |
| Alert Threshold | <2.5% at 30 days | May indicate CTA visibility or mobile UX issues |
| Instrumentation | GA4 event: `click_to_call` with parameters: `cta_location`, `device_type` | |

**CTA Locations Tracked:**
- Header CTA (desktop)
- Sticky mobile CTA bar
- Emergency banner
- Service page CTAs
- Footer

---

### Chat-to-Lead Rate
**Definition:** Percentage of chat conversations that convert to qualified leads  
**Formula:** `(qualified_chat_leads / chat_starts) × 100`  
**Owner:** CX Lead  
**Source of Truth:** Chat platform analytics + CRM lead tracking  
**Reporting Cadence:** Weekly  
**Measurement Method:** Chat platform provides conversation count, CRM tracks leads sourced from chat  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 10% | Current estimate (if chat implemented) |
| 30-Day Target | 16% | +6pp improvement |
| 90-Day Target | 22% | +12pp improvement |
| Alert Threshold | <14% at 30 days | May indicate chat script or qualification issues |
| Chat Platform | TBD (Drift, Intercom, or similar) | To be selected |

**Qualification Criteria for Chat Leads:**
- Contact info collected (name, phone, email)
- Service need identified
- Timeline discussed (≤90 days preferred)
- Geography confirmed (service area)

---

### Scheduler Completion Rate
**Definition:** Percentage of scheduler interactions that result in a confirmed booking  
**Formula:** `(completed_bookings / scheduler_starts) × 100`  
**Owner:** CX Lead  
**Source of Truth:** Scheduling platform analytics  
**Reporting Cadence:** Weekly  
**Measurement Method:** Scheduling platform (e.g., Calendly, Acuity) provides funnel data  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 18% | Current estimate (industry low) |
| 30-Day Target | 30% | +12pp improvement |
| 90-Day Target | 45% | +27pp improvement |
| Alert Threshold | <25% at 30 days | May indicate scheduler UX or availability issues |
| Scheduler Platform | TBD (Calendly, Acuity, or similar) | To be selected |

**Drop-off Points Tracked:**
- Service selection
- Date/time selection
- Contact info entry
- Confirmation

---

## Technical KPIs

### Core Web Vitals Pass Rate
**Definition:** Percentage of page URLs that pass all Core Web Vitals thresholds  
**Formula:** `(pages_passing_cwv / total_measured_pages) × 100`  
**Owner:** Frontend Lead  
**Source of Truth:** Google Search Console + PageSpeed Insights  
**Reporting Cadence:** Weekly  
**Measurement Method:** Search Console Core Web Vitals report + manual PageSpeed audits  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 35% | Current estimate (poor) |
| 30-Day Target | 70% | +35pp improvement |
| 90-Day Target | 90% | +55pp improvement (target) |
| Alert Threshold | <60% at 30 days | May indicate performance regression |
| Pass Criteria | LCP ≤2.5s AND CLS ≤0.10 AND INP ≤200ms | All three must pass |

**Pages Measured:**
- Homepage
- All service template instances
- All location template instances
- Emergency landing page

---

### Largest Contentful Paint (LCP) p75
**Definition:** 75th percentile time to render largest above-the-fold element  
**Formula:** `PERCENTILE(lcp_measurements, 75)`  
**Owner:** Frontend Lead  
**Source of Truth:** Chrome User Experience Report (CrUX) via Search Console  
**Reporting Cadence:** Weekly  
**Measurement Method:** CrUX provides field data, supplemented by PageSpeed Insights lab data  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 4.2s | Current estimate (poor) |
| 30-Day Target | ≤3.0s | "Needs improvement" threshold |
| 90-Day Target | ≤2.5s | "Good" threshold |
| Alert Threshold | >3.5s at 30 days | Trigger performance optimization sprint |
| Optimization Priority | Critical - directly impacts SEO and conversion | |

**Optimization Strategies:**
- Image optimization (WebP, lazy loading, responsive sizes)
- CSS critical path optimization
- Font loading optimization (preload, font-display: swap)
- Server response time improvement

---

### Cumulative Layout Shift (CLS) p75
**Definition:** 75th percentile visual stability score (lower is better)  
**Formula:** `PERCENTILE(cls_measurements, 75)`  
**Owner:** Frontend Lead  
**Source of Truth:** Chrome User Experience Report (CrUX) via Search Console  
**Reporting Cadence:** Weekly  
**Measurement Method:** CrUX provides field data, supplemented by PageSpeed Insights lab data  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 0.19 | Current estimate (poor) |
| 30-Day Target | ≤0.12 | "Needs improvement" threshold |
| 90-Day Target | ≤0.10 | "Good" threshold |
| Alert Threshold | >0.15 at 30 days | Trigger layout stability fixes |
| Optimization Priority | High - impacts user experience and conversion | |

**Optimization Strategies:**
- Reserved space for images, ads, embeds
- Avoid inserting content above existing content
- Font loading optimization (size-adjust, fallback fonts)
- CSS containment for dynamic content

---

### Interaction to Next Paint (INP) p75
**Definition:** 75th percentile responsiveness to user interactions  
**Formula:** `PERCENTILE(inp_measurements, 75)`  
**Owner:** Frontend Lead  
**Source of Truth:** Chrome User Experience Report (CrUX) via Search Console  
**Reporting Cadence:** Weekly  
**Measurement Method:** CrUX provides field data, supplemented by PageSpeed Insights lab data  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 280ms | Current estimate (needs improvement) |
| 30-Day Target | ≤220ms | "Needs improvement" threshold |
| 90-Day Target | ≤200ms | "Good" threshold |
| Alert Threshold | >250ms at 30 days | Trigger interactivity optimization |
| Optimization Priority | High - directly impacts conversion (forms, CTAs) | |

**Optimization Strategies:**
- Reduce JavaScript execution time
- Optimize event handlers (debounce, throttle)
- Code splitting and lazy loading
- Web Worker for heavy computation

---

### Uptime SLA
**Definition:** Percentage of time website is accessible and responsive  
**Formula:** `(successful_uptime_minutes / total_minutes) × 100`  
**Owner:** Platform Owner  
**Source of Truth:** Uptime monitoring service (UptimeRobot, Pingdom, or similar)  
**Reporting Cadence:** Real-time alerts, weekly review, monthly summary  
**Measurement Method:** External monitoring service pings site every 1 minute, calculates availability  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 99.0% | Current estimate (~7 hours downtime/month) |
| 30-Day Target | 99.5% | ~3.5 hours downtime/month |
| 90-Day Target | 99.9% | ~43 minutes downtime/month (target SLA) |
| Alert Threshold | <99.3% at 30 days | Trigger infrastructure review |
| Monitoring Frequency | 1-minute interval checks | |

**Downtime Categories:**
- Planned maintenance (excluded from SLA)
- Unplanned outage (counts against SLA)
- Performance degradation (>5s response time counts as down)

---

### Accessibility Score
**Definition:** Percentage of accessibility checks passed from defined checklist  
**Formula:** `(passed_checks / total_checks) × 100`  
**Owner:** QA Owner  
**Source of Truth:** Manual accessibility audit using QA checklist + automated tools (axe, WAVE)  
**Reporting Cadence:** Weekly during development, monthly after launch  
**Measurement Method:** QA team conducts manual audit, automated tools supplement, results logged in checklist  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 74% | Current estimate from initial audit |
| 30-Day Target | 88% | +14pp improvement |
| 90-Day Target | 95% | +21pp improvement (WCAG 2.1 AA compliance) |
| Alert Threshold | <85% at 30 days | Blocks launch readiness |
| Compliance Standard | WCAG 2.1 Level AA | Mandatory, no exceptions |

**Accessibility Checklist Categories:**
- Color contrast (4.5:1 normal text, 3:1 large text, 3:1 UI components)
- Keyboard navigation (Tab, Shift+Tab, Enter, Space, Escape)
- Screen reader support (semantic HTML, ARIA labels, live regions)
- Focus management (visible focus, focus trap, focus restore)
- Touch targets (≥44x44px on mobile)
- Form labels and error messages
- Alternative text for images
- Video captions and transcripts

---

### Search Index Coverage
**Definition:** Percentage of submitted pages successfully indexed by Google  
**Formula:** `(valid_indexed_pages / submitted_pages) × 100`  
**Owner:** SEO Owner  
**Source of Truth:** Google Search Console Index Coverage report  
**Reporting Cadence:** Weekly  
**Measurement Method:** Search Console provides submitted vs. indexed counts, coverage rate calculated  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 62% | Current estimate (poor) |
| 30-Day Target | 80% | +18pp improvement |
| 90-Day Target | 95% | +33pp improvement (target) |
| Alert Threshold | <75% at 30 days | May indicate technical SEO issues |
| Exclusion Reasons Tracked | Crawled - not indexed, Discovered - not indexed, Redirect, Noindex | |

**Index Optimization:**
- Fix crawl errors
- Improve page quality signals
- Optimize robots.txt and XML sitemap
- Remove duplicate content
- Improve internal linking

---

### JavaScript Error Budget
**Definition:** Number of uncaught JavaScript errors per 1,000 sessions  
**Formula:** `(total_js_errors / total_sessions) × 1000`  
**Owner:** Frontend Lead  
**Source of Truth:** Error tracking service (Sentry, LogRocket, or GA4 exceptions)  
**Reporting Cadence:** Real-time alerts for critical errors, weekly summary  
**Measurement Method:** Error tracking service captures uncaught exceptions, normalizes by session count  

| Metric | Value | Note |
|--------|-------|------|
| Baseline | 14 errors/1000 sessions | Current estimate (high) |
| 30-Day Target | ≤8 errors/1000 sessions | -43% reduction |
| 90-Day Target | ≤3 errors/1000 sessions | -79% reduction (target) |
| Alert Threshold | >10 errors/1000 sessions at 30 days | Trigger error investigation |
| Critical Error Threshold | Any error affecting conversion paths = P0 | Immediate fix required |

**Error Categories Tracked:**
- Form validation errors (should be zero)
- Navigation errors (should be zero)
- Analytics tracking errors (low priority)
- Third-party script errors (monitor only)
- Network errors (monitor, may not be actionable)

---

## KPI Measurement Rules and Definitions

### Data Quality Standards
1. **Accuracy:** All KPIs must be measured from authoritative source of truth
2. **Completeness:** No missing data for ≥80% of measurement periods
3. **Timeliness:** Weekly KPIs reported within 24 hours of week end, monthly within 3 business days of month end
4. **Consistency:** Calculation methods remain consistent unless documented change approved

### Baseline Update Process
1. After first 2 weeks of instrumentation, compare actual vs. estimated baseline
2. If variance >20%, update baseline with actual data
3. Recalibrate 30-day and 90-day targets proportionally
4. Document change in Decision Log with rationale
5. Communicate update to all stakeholders

### Target Setting Methodology
- **30-Day Targets:** Operationally feasible improvements (typically 10-50% from baseline)
- **90-Day Targets:** Stretch goals aligned to program success criteria (typically 50-150% from baseline)
- **Alert Thresholds:** Trigger investigation if KPI <70% of target at checkpoint
- **Stretch Goals:** Optional aspirational targets if conditions exceed plan

### Reporting Schedule

| KPI Group | Reporting Cadence | Report Due | Reviewed In | Owner |
|-----------|------------------|------------|-------------|-------|
| Business KPIs | Monthly | 3rd business day of month | Monthly business review | Analytics Lead |
| Conversion KPIs | Weekly | Monday 9am ET | Weekly operating review | Frontend Lead |
| Technical KPIs | Weekly | Monday 9am ET | Weekly operating review | Frontend Lead |
| Real-time Alerts | As triggered | Immediate | Incident response | Platform Owner |

### Escalation Triggers
- Any KPI shows <70% progress to 30-day target at week 2 checkpoint
- Any KPI regresses >10% from previous measurement
- Any critical error budget exceeded (uptime <99%, JS errors >10/1000 sessions)
- Any accessibility score <85% blocking launch readiness

---

## KPI Dashboard and Visualization

### Dashboard Requirements
- **Platform:** Google Data Studio, Tableau, or similar (TBD)
- **Update Frequency:** Real-time for technical KPIs, daily for conversion KPIs, weekly for business KPIs
- **Access:** Read access for all team members, edit access for Analytics Lead only
- **Visualizations:** Trend lines, target comparison, alert indicators, segmentation by device/page

### Key Dashboard Views
1. **Executive View:** Business KPIs + top 3 conversion KPIs + critical technical KPIs
2. **Weekly Operating View:** All KPIs with week-over-week delta and target progress
3. **Technical Deep Dive:** All technical KPIs with segmentation and error details
4. **Conversion Funnel View:** All conversion KPIs with drop-off analysis

---

## Document Control

**Version History:**
- v1.0 (2026-05-05): Initial baseline from audit data
- v2.0 (2026-05-06): Enhanced with formulas, sources, measurement methods, and reporting cadence

**Review Schedule:** Weekly during operating review, major revision quarterly

**Owner:** Analytics Lead

**Approvers:** Program Lead, Program Sponsor

---

## Related Documents
- [Program Charter](PROGRAM-CHARTER.md)
- [Weekly Review Template](WEEKLY-REVIEW-TEMPLATE.md)
- [Decision Log](DECISION-LOG.md)
- [Risk Register](RISK-REGISTER.md)
- [Go/No-Go Criteria](GO-NO-GO-CRITERIA.md)
