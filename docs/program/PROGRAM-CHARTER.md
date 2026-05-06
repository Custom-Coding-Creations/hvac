# HVAC Website Program Charter

**Program Name:** HVAC Website Performance & Delivery Program  
**Version:** 2.0  
**Status:** Active  
**Last Updated:** 2026-05-06  
**Program Lead:** Program Lead  
**Program Sponsor:** Program Sponsor  

---

## Executive Summary

This program establishes production-grade technical architecture, secure environments, and CI/CD workflow to deliver speed, reliability, and maintainability for the HVAC website system. The charter defines governance, KPI tracking, decision authority, and delivery standards for all website work.

---

## Business Objectives

### Primary Objectives
1. **Increase lead volume** by improving discoverability and conversion
2. **Increase qualified lead rate** by intent-based page structure and clearer CTAs
3. **Increase booked jobs** and close rate through lower-friction conversion paths
4. **Improve revenue per visitor** while reducing customer acquisition cost proxy
5. **Establish repeatable governance** model for weekly operating decisions

### Measurable Outcomes
- Lead volume: 36 → 90 leads/month (90-day target)
- Qualified lead rate: 32% → 42% (90-day target)
- Booked jobs: 12 → 29 jobs/month (90-day target)
- Close rate: 32% → 35% (90-day target)
- Revenue per visitor: $13.07 → $24.00 (90-day target)
- CAC proxy: $420 → $300 (90-day target)

---

## Program Scope

### In Scope
1. **Technical Architecture**
   - Platform architecture (WordPress + Bricks or alternatives documented)
   - Environment strategy (dev/staging/prod)
   - CI/CD and deployment safety
   - Security and observability baseline

2. **Governance and KPI Operating Model**
   - Weekly operating review cadence
   - KPI tracking and reporting
   - Decision log and risk management
   - Go/No-Go criteria enforcement

3. **Information Architecture and Conversion UX**
   - IA sitemap with URL hierarchy and intent clustering
   - Journey maps for key conversion paths
   - Conversion blueprint with persistent CTA strategy
   - Wireframe specifications

4. **Design System**
   - Design tokens (color, typography, spacing, motion)
   - Component specifications with interaction states
   - Accessibility compliance (WCAG 2.1 AA)
   - Responsive grid rules

5. **Frontend Implementation**
   - Core templates (homepage, service, location, emergency)
   - Shared CSS and JavaScript systems
   - Component patterns and documentation
   - Form validation and analytics hooks

6. **Quality Assurance and Validation**
   - Accessibility testing (keyboard, screen reader, contrast)
   - Responsive testing (360px to 1440px)
   - Functional testing (nav, forms, CTAs, accordions)
   - Traceability to requirements

### Out of Scope (This Increment)
- Full CI/CD hardening and deployment automation beyond baseline checks
- Paid media strategy design and campaign execution
- CMS backend development (WordPress/Bricks implementation)
- Third-party integrations (CRM, payment processing, scheduling)
- Content creation and copywriting
- Production hosting and DNS configuration

---

## Program Structure

### Governance Cadence
- **Weekly Operating Review:** Tuesday 10:00 ET, 45 minutes
- **KPI Reporting Cycle:** Weekly for conversion/technical KPIs, monthly for business KPIs
- **Decision Review:** As needed, logged in Decision Log
- **Risk Review:** Weekly during operating review
- **Go/No-Go Review:** Before each major release

### Ownership and Roles

| Role | Owner | Responsibilities |
|------|-------|-----------------|
| Program Lead | Program Lead | Overall delivery, scope management, escalation triage |
| Program Sponsor | Program Sponsor | Strategic direction, budget authority, go/no-go authority |
| Frontend Lead | Frontend Lead | Technical architecture, code quality, performance KPIs |
| Analytics Lead | Analytics Lead | KPI instrumentation, data quality, reporting |
| UX Owner | UX Owner | Conversion design, journey optimization, usability |
| QA Owner | QA Owner | Accessibility, functional testing, quality gates |
| SEO Owner | SEO Owner | Index coverage, technical SEO, organic visibility |
| Sales Manager | Sales Manager | Lead qualification, close rate, sales feedback |
| Sales Ops Lead | Sales Ops Lead | Lead tracking, qualification criteria, pipeline health |
| CX Lead | CX Lead | Chat optimization, scheduler completion, customer feedback |
| Platform Owner | Platform Owner | Uptime, infrastructure, deployment automation |
| Finance Owner | Finance Owner | ROI tracking, budget management, payback analysis |

---

## Decision Rights and Authority

### Decision Matrix

| Decision Type | Authority | Approval Required | Documentation |
|---------------|-----------|-------------------|---------------|
| **Scope Changes** | Program Sponsor | Yes | Decision Log |
| **KPI Definition Changes** | Program Sponsor | Yes | KPI Baseline Sheet + Decision Log |
| **Design System Deviations** | Design Owner + Frontend Lead | Both required | Decision Log |
| **Launch/No-Launch** | Program Sponsor + Frontend Lead | Joint sign-off | Go/No-Go Criteria + Decision Log |
| **Technical Architecture** | Frontend Lead | Program Sponsor review | Architecture Decision Records (ADR) |
| **Risk Acceptance** | Program Lead | Program Sponsor for High impact | Risk Register |
| **Budget Changes** | Finance Owner + Program Sponsor | Both required | Decision Log |
| **Timeline Changes** | Program Lead | Program Sponsor approval if >1 week slip | Decision Log |

### Escalation Authority
1. **Level 1 (Owner):** Individual role owner handles execution issues
2. **Level 2 (Program Lead):** Triage within one business day for blockers
3. **Level 3 (Program Sponsor):** Escalate within 24 hours if unresolved
4. **Level 4 (Executive):** Material launch risk requires same-day executive review

---

## Dependencies and Constraints

### Critical Dependencies
- **Issue 2 Artifacts:** IA sitemap, journey maps, conversion blueprint, wireframe specs
- **Issue 3 Artifacts:** Design tokens, component specs, accessibility matrix, QA checklist
- **Issue 4 Stream:** Architecture decisions, environment provisioning, CI/CD setup
- **Data Infrastructure:** Analytics instrumentation for KPI tracking
- **Platform Selection:** WordPress + Bricks or documented alternative

### Known Constraints
- **Timeline:** 5-week initial delivery cycle
- **Budget:** Implementation cost must achieve ≤20 day payback period
- **Quality:** WCAG 2.1 AA compliance mandatory, no exceptions
- **Performance:** Core Web Vitals must meet "good" thresholds (LCP ≤2.5s, CLS ≤0.10, INP ≤200ms)
- **Conversion:** Minimum two conversion paths per core template

---

## Success Criteria

### Governance Success Criteria
- [x] KPI baseline sheet includes formula, owner, baseline, 30-day target, 90-day target for all KPIs
- [x] Weekly operating review cadence assigned and active
- [x] Decision log and risk register initialized and in use
- [x] Go/No-Go criteria defined with measurable thresholds

### Technical Success Criteria
- [ ] Architecture diagram published and reviewed
- [ ] Environment setup docs complete (dev/staging/prod)
- [ ] CI/CD workflow config active with required checks
- [ ] Security baseline checklist complete with no critical gaps
- [ ] End-to-end deploy from main to staging and production works reproducibly
- [ ] Rollback procedure tested at least once
- [ ] Monitoring and alerting verified
- [ ] Pipeline is active and required for merges

### Delivery Success Criteria
- [x] Core templates delivered (homepage, service, location, emergency)
- [x] Each template includes at least two distinct conversion paths
- [x] Accessibility pass rate ≥95% on defined checklist
- [x] Responsive QA passed for 360, 768, 1024, 1440 viewports
- [ ] Performance targets met (LCP ≤2.5s, CLS ≤0.10, INP ≤200ms)

---

## Program Timeline

### Phase 1: Foundation (Week 1)
- [x] Governance package complete and approved
- [x] KPI baseline established
- [x] Weekly review cadence started

### Phase 2: Design and IA (Week 2)
- [x] IA and design system artifact bootstrap complete
- [x] Journey maps and conversion blueprint finalized
- [x] Component specifications documented

### Phase 3: Frontend Implementation (Week 3-4)
- [x] Frontend primitives, templates, conversion components delivered
- [x] Shared CSS and JavaScript systems implemented
- [x] Component patterns documented

### Phase 4: QA and Launch Prep (Week 5)
- [x] QA evidence collected
- [x] Traceability matrix completed
- [ ] Go/No-Go review conducted
- [ ] Architecture and deployment documentation complete

### Phase 5: Production Deployment (Post-Week 5)
- [ ] Staging environment validated
- [ ] Production deployment executed
- [ ] Monitoring and alerting active
- [ ] Rollback procedure tested

---

## Escalation Protocol

### Escalation Triggers
1. **Execution Blocker:** Any owner identifies a blocker preventing progress
2. **KPI at Risk:** Any KPI shows <70% progress to 30-day target
3. **Quality Gate Failure:** Any mandatory gate fails in Go/No-Go review
4. **Security Issue:** Any critical or high-severity security vulnerability discovered
5. **Timeline Risk:** Any activity exceeds planned duration by >2 days
6. **Budget Risk:** Any cost exceeds planned budget by >10%

### Escalation Process
```
Step 1: Owner logs issue in Risk Register with timestamp
        ↓
Step 2: Program Lead triages within 1 business day
        ↓
Step 3: If unresolved in 24 hours → escalate to Program Sponsor
        ↓
Step 4: If launch risk is material → mandatory same-day executive review
        ↓
Step 5: Document decision in Decision Log with rationale and impact
```

### Escalation SLA
- **Owner to Program Lead:** Within 4 hours of identification
- **Program Lead triage:** Within 1 business day
- **Program Lead to Sponsor:** Within 24 hours if unresolved
- **Sponsor to Executive:** Same day for material launch risks
- **Decision documentation:** Within 24 hours of resolution

---

## Communication Plan

### Weekly Operating Review
- **When:** Tuesday 10:00 ET, 45 minutes
- **Who:** All role owners (required), stakeholders (optional)
- **Agenda:** Status, KPI review, blockers, decisions, escalations, actions
- **Output:** Meeting notes, updated risk register, action items

### Ad-Hoc Communication
- **Slack Channel:** #hvac-website-program (primary)
- **Email:** For formal approvals and external stakeholders
- **Video Calls:** For complex decisions requiring discussion

### Reporting
- **Weekly:** KPI dashboard, delivery status, risk summary
- **Monthly:** Business KPI trends, ROI analysis, quality metrics
- **Quarterly:** Program health check, strategic review

---

## Risk Management Approach

### Risk Categories
- **Scope Risk:** Drift, unclear requirements, stakeholder misalignment
- **Data Risk:** Instrumentation delays, baseline accuracy, reporting gaps
- **UX Risk:** Conversion underperformance, usability issues, friction points
- **Accessibility Risk:** Compliance failures, keyboard/screen reader issues
- **Frontend Quality Risk:** Code drift, maintainability, technical debt
- **Technical Risk:** Performance, errors, uptime, security vulnerabilities
- **Dependency Risk:** Third-party delays, integration issues

### Risk Response
- **Avoid:** Change approach to eliminate risk
- **Mitigate:** Reduce likelihood or impact through controls
- **Accept:** Document and monitor (for low impact risks)
- **Escalate:** Transfer decision to appropriate authority level

---

## Change Management

### Scope Change Process
1. Requester submits change request with business justification
2. Program Lead assesses impact to timeline, budget, quality
3. Program Sponsor approves or rejects
4. If approved, update charter, KPIs, risk register, timeline
5. Communicate change to all stakeholders
6. Document in Decision Log

### KPI Change Process
1. Owner identifies need for KPI change with data-driven rationale
2. Analytics Lead validates feasibility and instrumentation
3. Program Sponsor approves or rejects
4. If approved, update KPI Baseline Sheet with version control
5. Recalibrate targets and reporting
6. Document in Decision Log

---

## Quality Standards

### Code Quality
- No console.log in production code
- No TODO comments that block merge
- Consistent naming conventions
- DRY principle (no duplicate code)
- Proper error handling
- Test coverage for critical paths

### Accessibility Quality
- WCAG 2.1 AA compliance (mandatory)
- Keyboard navigation for all interactive elements
- Screen reader support with semantic HTML and ARIA
- Focus management (visible focus, focus trap, focus restore)
- Touch targets ≥44x44px on mobile

### Performance Quality
- LCP p75 ≤2.5s (good threshold)
- CLS p75 ≤0.10 (good threshold)
- INP p75 ≤200ms (good threshold)
- JS error budget ≤3 per 1000 sessions

### Documentation Quality
- All decisions logged with rationale and impact
- All risks documented with mitigation strategies
- All KPIs defined with formula, baseline, targets, owner, source
- All architecture decisions recorded in ADR format

---

## Definition of Done

### Program-Level Done
- All success criteria met
- All mandatory gates passed
- All high-impact risks resolved or accepted
- All documentation complete and cross-linked
- Team can release safely without manual heroics

### Feature-Level Done
- Code complete and peer reviewed
- Tests written and passing
- Documentation updated
- Accessibility validated
- Performance validated
- Deployed to staging and validated
- Product owner accepts

---

## Program Artifacts

### Governance Artifacts
- [Program Charter](PROGRAM-CHARTER.md) (this document)
- [KPI Baseline Sheet](KPI-BASELINE-SHEET.md)
- [Weekly Review Template](WEEKLY-REVIEW-TEMPLATE.md)
- [Decision Log](DECISION-LOG.md)
- [Risk Register](RISK-REGISTER.md)
- [Go/No-Go Criteria](GO-NO-GO-CRITERIA.md)

### Architecture Artifacts
- [Architecture Decision Records](../../.github/adr/) (to be created)
- [Environment Setup Documentation](ENVIRONMENT-SETUP.md) (to be created)
- [CI/CD Workflow Documentation](CICD-WORKFLOW.md) (to be created)
- [Security Baseline Checklist](SECURITY-BASELINE.md) (to be created)

### UX and IA Artifacts
- [IA Sitemap](../../ux/IA-SITEMAP-v1.md)
- [Journey Maps](../../ux/JOURNEY-MAPS-v1.md)
- [Conversion UX Blueprint](../../ux/CONVERSION-UX-BLUEPRINT-v1.md)
- [Wireframe Specifications](../../ux/WIREFRAME-SPECS-v1.md)

### Design System Artifacts
- [Design Tokens](../../design-system/TOKENS.md)
- [Component Specifications](../../design-system/COMPONENT-SPECS.md)
- [Accessibility Contrast Matrix](../../design-system/ACCESSIBILITY-CONTRAST-MATRIX.md)
- [Responsive Grid Rules](../../design-system/RESPONSIVE-GRID-RULES.md)
- [Design QA Checklist](../../design-system/DESIGN-QA-CHECKLIST.md)

### Frontend Artifacts
- [Implementation Guide](../../frontend/IMPLEMENTATION-GUIDE.md)
- [Component Reference](../../frontend/components/README.md)
- [Templates](../../frontend/templates/)
- [Shared Systems](../../frontend/assets/)

### QA and Validation Artifacts
- [Before/After Evidence](../../qa/BEFORE-AFTER-EVIDENCE.md)
- [Functional Checks](../../qa/FUNCTIONAL-CHECKS.md)
- [Accessibility & Responsive QA](../../qa/ACCESSIBILITY-RESPONSIVE-QA.md)
- [Traceability Matrix](../../qa/ISSUE-2-3-TRACEABILITY-MATRIX.md)

---

## Approval and Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Program Sponsor | [TBD] | | |
| Program Lead | [TBD] | | |
| Frontend Lead | [TBD] | | |
| QA Owner | [TBD] | | |

---

**Document Control**
- **Version:** 2.0
- **Created:** 2026-05-05
- **Last Updated:** 2026-05-06
- **Next Review:** Weekly during operating review
- **Owner:** Program Lead
