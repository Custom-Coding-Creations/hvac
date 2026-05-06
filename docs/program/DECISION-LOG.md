# Decision Log

**Version:** 2.0  
**Owner:** Program Lead  
**Last Updated:** 2026-05-06  
**Review Cadence:** Weekly during operating review  

---

## Purpose

This decision log captures all significant program decisions with rationale, impact assessment, and approval status. All decisions affecting scope, architecture, KPIs, timeline, or budget must be logged here with appropriate approvals.

---

## Decision Template

| Field | Description |
|-------|-------------|
| **Decision ID** | Unique identifier (D-###) |
| **Date** | Date decision was made |
| **Category** | Scope/Technical/UX/Quality/Process/Budget/Timeline |
| **Owner** | Person who made or approved the decision |
| **Decision** | What was decided (concise statement) |
| **Rationale** | Why this decision was made (business/technical justification) |
| **Alternatives Considered** | Other options that were evaluated |
| **Impact** | Effect on timeline, budget, quality, scope, or other dimensions |
| **Approver(s)** | Who approved the decision |
| **Status** | Proposed/Approved/Superseded/Rejected |
| **Superseded By** | If superseded, reference to new decision ID |

---

## Active Decisions

### D-001: Potter-Perrone as Phase-1 Baseline Entity

**Date:** 2026-05-05  
**Category:** Scope  
**Owner:** Program Lead  
**Status:** ✅ Approved  

**Decision:**  
Use Potter-Perrone HVAC as the phase-1 entity baseline for all program work, KPI tracking, and implementation.

**Rationale:**  
- Existing audited data and ROI assumptions are complete enough for immediate KPI baseline
- Avoids delay waiting for multi-entity normalization
- Provides clear single-entity focus for initial rollout
- Can expand to additional entities after proven success

**Alternatives Considered:**  
1. Multi-entity approach from start (rejected - too complex, delays baseline)
2. Synthetic composite entity (rejected - lacks real data)

**Impact:**  
- **Timeline:** Enables immediate start, saves 1-2 weeks
- **Budget:** No impact
- **Quality:** Positive - focused effort on single entity
- **Scope:** Clarifies scope boundaries

**Approver(s):** Program Sponsor  
**Related Artifacts:** KPI Baseline Sheet, Program Charter  

---

### D-002: Static Frontend Baseline Implementation

**Date:** 2026-05-05  
**Category:** Technical  
**Owner:** Frontend Lead  
**Status:** ✅ Approved  

**Decision:**  
Implement a reusable static frontend baseline (HTML/CSS/JS) for core templates and interactions, independent of runtime platform choice.

**Rationale:**  
- Repository has no runtime stack committed yet
- Static baseline enables traceable implementation and QA
- Provides production-structured frontend artifacts while architecture stream finalizes runtime choice
- Can be integrated into WordPress/Bricks or any other platform later
- Reduces coupling between frontend and backend decisions

**Alternatives Considered:**  
1. Wait for platform decision (rejected - causes delay)
2. Build directly in WordPress (rejected - premature platform commitment)
3. Use framework like React/Vue (rejected - over-engineered for content site)

**Impact:**  
- **Timeline:** Enables parallel work streams, saves 1 week
- **Budget:** No impact
- **Quality:** Positive - clean separation of concerns, easier testing
- **Scope:** No change to deliverables

**Approver(s):** Program Sponsor, Frontend Lead  
**Related Artifacts:** Frontend templates, system.css, system.js  

---

### D-003: Two Conversion Paths Per Template Requirement

**Date:** 2026-05-05  
**Category:** UX / Quality  
**Owner:** Program Sponsor  
**Status:** ✅ Approved  

**Decision:**  
Require at least two distinct conversion paths per core template before launch readiness can pass.

**Rationale:**  
- Aligns to conversion objective and Issue 2 acceptance language
- Prevents single-path template release that suppresses conversion coverage
- Reduces single-point-of-failure risk for lead capture
- Supports diverse user intents (call now vs. schedule later vs. learn more)

**Alternatives Considered:**  
1. Single primary CTA per template (rejected - limits conversion options)
2. Three paths required (rejected - may over-complicate simpler templates)

**Impact:**  
- **Timeline:** Minimal - templates already designed with multiple paths
- **Budget:** No impact
- **Quality:** Positive - forces conversion path diversity
- **Scope:** Codifies existing intent, no scope change

**Approver(s):** Program Sponsor, UX Owner  
**Related Artifacts:** Conversion UX Blueprint, Go/No-Go Criteria Gate B  

---

### D-004: WCAG 2.1 AA Accessibility Compliance Mandatory

**Date:** 2026-05-05  
**Category:** Quality  
**Owner:** QA Owner  
**Status:** ✅ Approved  

**Decision:**  
Enforce WCAG 2.1 Level AA compliance checks on contrast, focus, labels, keyboard navigation, and error states. Accessibility failures block launch.

**Rationale:**  
- Accessibility failures are conversion failures (users can't complete actions)
- Accessibility failures are trust failures (unprofessional, excludes users)
- Legal risk mitigation (ADA compliance)
- Industry best practice and competitive differentiator

**Alternatives Considered:**  
1. WCAG 2.1 A only (rejected - insufficient for competitive site)
2. AAA compliance (rejected - overly restrictive, not required)
3. Automated tools only (rejected - miss many critical issues)

**Impact:**  
- **Timeline:** Minimal - accessibility built into design system from start
- **Budget:** No impact
- **Quality:** Positive - ensures usable, professional site
- **Scope:** Codifies existing quality standard, no scope change

**Approver(s):** Program Sponsor, QA Owner  
**Related Artifacts:** Accessibility Contrast Matrix, Design QA Checklist, Go/No-Go Criteria Gate C  

---

### D-005: CI/CD Baseline with GitHub Actions

**Date:** 2026-05-06  
**Category:** Technical / Process  
**Owner:** Frontend Lead  
**Status:** ✅ Approved  

**Decision:**  
Implement CI/CD baseline using GitHub Actions for lint, build, test, and security checks on all PRs. Passing checks required for merge.

**Rationale:**  
- Automates quality gates to reduce manual review burden
- Prevents regressions and common errors from reaching main branch
- Provides fast feedback to developers
- Integrates seamlessly with GitHub workflow
- Low cost (free for public repos, included in GitHub plan)

**Alternatives Considered:**  
1. No CI (rejected - too risky, manual checks are error-prone)
2. Jenkins/CircleCI (rejected - added complexity, hosting cost)
3. GitLab CI (rejected - would require repo migration)

**Impact:**  
- **Timeline:** 1 day setup, saves time on every PR review
- **Budget:** No cost (GitHub Actions included)
- **Quality:** Positive - automated quality enforcement
- **Scope:** Infrastructure work, not feature work

**Approver(s):** Program Lead, Frontend Lead  
**Related Artifacts:** .github/workflows/ci.yml  

---

### D-006: Weekly KPI Reporting for Conversion and Technical KPIs

**Date:** 2026-05-06  
**Category:** Process  
**Owner:** Analytics Lead  
**Status:** ✅ Approved  

**Decision:**  
Conversion KPIs and Technical KPIs will be reported weekly in the operating review. Business KPIs will be reported monthly.

**Rationale:**  
- Weekly cadence enables rapid iteration on conversion and performance issues
- Monthly cadence appropriate for slower-moving business metrics
- Balances data freshness with reporting overhead
- Aligns with weekly operating review meeting structure

**Alternatives Considered:**  
1. All KPIs weekly (rejected - excessive overhead for business KPIs)
2. All KPIs monthly (rejected - too slow for tactical adjustments)
3. Daily reporting (rejected - noisy, too frequent)

**Impact:**  
- **Timeline:** No impact
- **Budget:** No impact
- **Quality:** Positive - enables faster feedback loops
- **Scope:** Reporting cadence clarification

**Approver(s):** Program Lead, Analytics Lead  
**Related Artifacts:** KPI Baseline Sheet, Weekly Review Template  

---

### D-007: Program Documentation Structure in docs/program/

**Date:** 2026-05-06  
**Category:** Process  
**Owner:** Program Lead  
**Status:** ✅ Approved  

**Decision:**  
Consolidate all program governance artifacts under `docs/program/` directory with consistent naming and cross-linking. Create root README.md for navigation.

**Rationale:**  
- Improves discoverability for team members and future agents
- Creates single source of truth for program governance
- Aligns with standard documentation practices
- Separates program governance from business development docs (docs/)

**Alternatives Considered:**  
1. Keep in existing governance/ directory (rejected - not discoverable, no README links)
2. Flat structure in root (rejected - clutters root directory)
3. Inside .github/ (rejected - not meant for program docs)

**Impact:**  
- **Timeline:** No impact (documentation work)
- **Budget:** No impact
- **Quality:** Positive - better organization and accessibility
- **Scope:** Documentation structure improvement

**Approver(s):** Program Lead  
**Related Artifacts:** All docs/program/ files, root README.md  

---

### D-008: Branch Protection Policy on Main

**Date:** 2026-05-06  
**Category:** Technical  
**Owner:** Frontend Lead  
**Status:** ✅ Approved  

**Decision:**  
Enable GitHub branch protection on main branch requiring CI checks and one code review approval before merge.

**Rationale:**  
- Prevents accidental broken deployments to production
- Ensures all code has been linted, tested, and peer-reviewed
- Enforces shared responsibility for code quality
- Aligns with industry best practices
- Blocks force-push to prevent destructive operations

**Alternatives Considered:**  
1. No branch protection (rejected - risky, allows direct commits to main)
2. Require multiple approvals (rejected - too slow for small team)
3. Require status checks only, no review (rejected - peer review important)

**Impact:**  
- **Timeline:** Minimal - slightly slower merge process but better quality
- **Budget:** No impact
- **Quality:** Positive - prevents bad deployments, enforces code review
- **Scope:** No change to deliverables

**Approver(s):** Frontend Lead, Platform Owner  
**Related Artifacts:** GitHub settings, ci.yml workflow, deploy.yml  

---

### D-009: Secrets Management via GitHub Secrets + Vercel Env Vars

**Date:** 2026-05-06  
**Category:** Technical/Security  
**Owner:** Platform Owner  
**Status:** ✅ Approved  

**Decision:**  
Store deployment credentials (Vercel tokens) in GitHub Secrets and runtime secrets (API keys, DSNs) in Vercel environment variables. Never hardcode secrets or commit .env files.

**Rationale:**  
- GitHub Secrets are encrypted and audit-logged
- Vercel env vars automatically injected at runtime without exposure
- Separates deployment credentials (for CI/CD) from runtime secrets (for application)
- Vercel-native integration simplifies workflow
- No risk of secrets exposed in logs or version control

**Alternatives Considered:**  
1. Hardcode secrets (rejected - security risk, audit failure)
2. Use external vault service (rejected - overcomplicated for small team)
3. Store all secrets in Vercel env vars (rejected - can't inject Vercel tokens at runtime)
4. Use .env file (rejected - could be committed accidentally)

**Impact:**  
- **Timeline:** No impact (implemented in CI/CD workflow)
- **Budget:** No impact (GitHub/Vercel free tier includes secrets)
- **Quality:** Positive - secure credential management
- **Scope:** Security requirement clarification

**Approver(s):** Platform Owner, Program Lead  
**Related Artifacts:** ADR-0004 Secrets Management, .github/workflows/deploy.yml  

---

### D-010: Rollback Strategy - Vercel History + Manual Override

**Date:** 2026-05-06  
**Category:** Technical  
**Owner:** Platform Owner  
**Status:** ✅ Approved  

**Decision:**  
Use Vercel's automatic deployment history for fast rollback, with manual override workflow for explicit previous-commit rollback. Auto-trigger rollback on health check failure. Target: <5 minute rollback time.

**Rationale:**  
- Vercel maintains 5+ previous deployments automatically
- Manual rollback workflow enables explicit commit selection if needed
- Health checks can auto-trigger rollback for critical issues (no human delay)
- <5 minute time target aligns with production SLA expectations
- Tested and verified via monthly drills (disaster recovery practice)

**Alternatives Considered:**  
1. Blue-green deployments (rejected - overcomplicated for static site, higher cost)
2. Canary deployments (rejected - unnecessary for static HTML/CSS/JS)
3. Manual-only rollback (rejected - too slow for P1 incidents)
4. No rollback procedure (rejected - risky, no disaster recovery)

**Impact:**  
- **Timeline:** +2 weeks for implementation (workflow + drills) - included in Phase 2
- **Budget:** No impact (Vercel + GitHub native)
- **Quality:** Positive - reduces incident severity, enables fast recovery
- **Scope:** Operational readiness requirement

**Approver(s):** Platform Owner, Frontend Lead  
**Related Artifacts:** ADR-0005 Rollback Strategy, .github/workflows/rollback.yml, INCIDENT-RESPONSE-RUNBOOK.md  

---

### D-011: On-Call Rotation and Escalation Procedures

**Date:** 2026-05-06  
**Category:** Process  
**Owner:** Program Lead  
**Status:** ✅ Approved  

**Decision:**  
Implement weekly on-call rotation with four-level escalation (on-call engineer → Platform Owner → Frontend Lead → Program Lead/Sponsor). SLA targets by severity: P1 <1 hour, P2 <4 hours, P3 <1 day, P4 standard backlog.

**Rationale:**  
- Weekly rotation prevents burnout while ensuring coverage
- Four-level escalation handles incidents proportionally to severity
- Clear SLA targets enable measurable performance
- On-call rotation is standard practice for production systems
- Incident classification (P1-P4) provides decision framework

**Alternatives Considered:**  
1. Single on-call person (rejected - burnout risk, no backup)
2. No escalation (rejected - no clear authority for rollback decisions)
3. Unlimited escalation levels (rejected - too slow for incident response)
4. No SLA targets (rejected - no accountability)

**Impact:**  
- **Timeline:** No impact (scheduling and procedures documented)
- **Budget:** No impact (internal team)
- **Quality:** Positive - faster incident response, clear responsibility
- **Scope:** Operational procedures

**Approver(s):** Program Lead, Platform Owner  
**Related Artifacts:** OPERATIONAL-OWNERSHIP.md, INCIDENT-RESPONSE-RUNBOOK.md, on-call rotation schedule  

---

## Superseded Decisions

### D-XXX: [Example Superseded Decision]

**Date:** YYYY-MM-DD  
**Category:** [Category]  
**Owner:** [Owner]  
**Status:** ❌ Superseded by D-YYY  

**Decision:** [What was decided]  
**Rationale:** [Why it was decided]  
**Why Superseded:** [Why this decision was replaced]  
**Superseded By:** [D-YYY: New Decision Title]  

---

## Rejected Decisions

### D-XXX: [Example Rejected Decision]

**Date:** YYYY-MM-DD  
**Category:** [Category]  
**Owner:** [Owner]  
**Status:** ⛔ Rejected  

**Proposed Decision:** [What was proposed]  
**Rationale:** [Why it was proposed]  
**Rejection Reason:** [Why it was rejected]  
**Approver(s):** [Who rejected it]  

---

## Decision-Making Process

### When to Log a Decision
Log a decision if it meets ANY of these criteria:
- Affects program scope, timeline, or budget
- Changes KPI definitions or targets
- Establishes or modifies technical architecture
- Creates or changes a quality standard
- Affects multiple team members or workstreams
- May need to be referenced or explained in the future
- Involves a trade-off between competing priorities

### Decision Approval Matrix

| Decision Category | Required Approver(s) | Escalation Level |
|------------------|---------------------|------------------|
| **Scope Change** | Program Sponsor | L3 |
| **KPI Definition** | Program Sponsor + Analytics Lead | L3 |
| **Technical Architecture** | Frontend Lead + Program Lead | L2 |
| **Design System** | Design Owner + Frontend Lead | L2 |
| **Launch/No-Launch** | Program Sponsor + Frontend Lead (joint) | L3 |
| **Budget Change** | Finance Owner + Program Sponsor | L3 |
| **Timeline Slip >1 week** | Program Sponsor | L3 |
| **Quality Standard** | QA Owner + Program Lead | L2 |
| **Process Change** | Program Lead | L2 |

### Decision Workflow
```
1. Identify decision need
   ↓
2. Document options and impacts
   ↓
3. Consult stakeholders
   ↓
4. Present in weekly operating review (if applicable)
   ↓
5. Get required approvals
   ↓
6. Log decision with rationale and impact
   ↓
7. Communicate to affected team members
   ↓
8. Update related artifacts (charter, KPIs, risks, etc.)
```

### Decision Documentation Standards
- **Be specific:** State exactly what was decided, not just the general topic
- **Explain why:** Rationale should be clear enough that someone unfamiliar with context understands
- **Show alternatives:** Document what other options were considered and why they were rejected
- **Quantify impact:** Use specific numbers for timeline, budget, quality effects when possible
- **Link artifacts:** Reference related documents, tickets, or evidence

---

## Decision Categories

### Scope Decisions
Changes to what is included or excluded from the program deliverables.

**Examples:**
- Adding or removing features
- Changing acceptance criteria
- Expanding or reducing template set
- Including or excluding entities

### Technical Decisions
Architecture, technology choices, implementation approaches.

**Examples:**
- Platform selection (WordPress, custom, etc.)
- Framework choices
- Hosting and infrastructure
- Integration approaches
- Performance optimization strategies

### UX Decisions
User experience design, conversion strategy, interaction patterns.

**Examples:**
- Conversion path requirements
- Form field choices
- Navigation structure
- Mobile vs. desktop priorities

### Quality Decisions
Standards, thresholds, compliance requirements, testing approaches.

**Examples:**
- Accessibility compliance level
- Performance targets
- Test coverage requirements
- Code quality standards

### Process Decisions
Governance, workflows, meeting cadence, communication.

**Examples:**
- Reporting frequency
- Approval workflows
- Meeting structure
- Documentation standards

### Budget Decisions
Financial commitments, cost trade-offs, ROI thresholds.

**Examples:**
- Tool/service purchases
- Resource allocation
- Payback period requirements

### Timeline Decisions
Schedule changes, milestone adjustments, prioritization.

**Examples:**
- Phase timing
- Milestone dates
- Priority sequencing
- Deadline extensions

---

## Related Documents
- [Program Charter](PROGRAM-CHARTER.md)
- [KPI Baseline Sheet](KPI-BASELINE-SHEET.md)
- [Weekly Review Template](WEEKLY-REVIEW-TEMPLATE.md)
- [Risk Register](RISK-REGISTER.md)
- [Go/No-Go Criteria](GO-NO-GO-CRITERIA.md)

---

## Document Control

**Version History:**
- v1.0 (2026-05-05): Initial decision log with D-001 through D-004
- v2.0 (2026-05-06): Enhanced with decision process, categories, and D-005 through D-007

**Owner:** Program Lead  
**Review Cadence:** Weekly during operating review  
**Next Review:** Next weekly operating review  
