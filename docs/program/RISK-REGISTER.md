# Risk Register

**Version:** 2.0  
**Owner:** Program Lead  
**Last Updated:** 2026-05-06  
**Review Cadence:** Weekly during operating review  

---

## Purpose

This risk register identifies, tracks, and manages all program risks. Each risk includes trigger conditions, likelihood, impact, mitigation strategies, and ownership to enable proactive risk management.

---

## Risk Assessment Matrix

### Likelihood Scale
- **High (H):** >50% probability of occurring
- **Medium (M):** 25-50% probability of occurring
- **Low (L):** <25% probability of occurring

### Impact Scale
- **High (H):** Would cause >1 week timeline slip, >10% budget increase, or critical quality/scope failure
- **Medium (M):** Would cause 3-7 day timeline slip, 5-10% budget increase, or moderate quality/scope impact
- **Low (L):** Would cause <3 day timeline slip, <5% budget increase, or minor quality/scope impact

### Risk Score Matrix

|          | **Low Impact** | **Medium Impact** | **High Impact** |
|----------|----------------|-------------------|-----------------|
| **High Likelihood** | 🟡 Medium Risk | 🔴 High Risk | 🔴 Critical Risk |
| **Medium Likelihood** | 🟢 Low Risk | 🟡 Medium Risk | 🔴 High Risk |
| **Low Likelihood** | 🟢 Low Risk | 🟢 Low Risk | 🟡 Medium Risk |

### Risk Response Strategies
- **Avoid:** Change approach to eliminate the risk
- **Mitigate:** Reduce likelihood or impact through preventive actions
- **Accept:** Acknowledge and monitor (for low-score risks)
- **Escalate:** Transfer decision to higher authority

---

## Active Risks

### R-001: Scope Drift Due to Unclear Requirements

**Category:** Scope  
**Risk Score:** 🟡 Medium Risk (Medium Likelihood × High Impact)  
**Status:** 🟡 Open - Mitigating  

**Description:**  
Issue numbering and scope drift could cause misaligned deliverables between governance artifacts and implementation work.

**Trigger Condition:**  
Governance and implementation artifacts diverge from acceptance criteria by >20% of deliverables.

**Likelihood:** Medium (M)  
**Impact:** High (H)  
- Timeline: Could cause 1-2 week rework
- Quality: Misaligned artifacts reduce traceability
- Scope: Unclear what is in/out of scope

**Root Causes:**  
- Multiple issue threads with overlapping concerns
- Acceptance criteria spread across multiple documents
- No single source of truth for scope definition

**Mitigation Strategy:**  
1. Maintain single governance index (this risk register + program charter)
2. Weekly scope confirmation in operating review
3. All scope changes require Decision Log entry with approval
4. Regular cross-reference audit between artifacts and acceptance criteria

**Contingency Plan (if triggered):**  
1. Freeze new work immediately
2. Conduct scope reconciliation workshop (4 hours)
3. Update all artifacts to align with approved scope
4. Communicate changes to all stakeholders
5. Reset timeline expectations based on confirmed scope

**Owner:** Program Lead  
**Mitigation Owner:** Program Lead  
**Last Review:** 2026-05-06  
**Next Review:** Weekly  

**Related Decisions:** D-001, D-007  
**Related Artifacts:** Program Charter, Acceptance Criteria document  

---

### R-002: KPI Baseline Inaccuracy Due to Estimation

**Category:** Data / Measurement  
**Risk Score:** 🟡 Medium Risk (High Likelihood × Medium Impact)  
**Status:** 🟡 Open - Mitigating  

**Description:**  
KPI baselines are estimate-based from audit data and may shift significantly after real instrumentation is active.

**Trigger Condition:**  
First 2 weeks of real event data differ from estimates by more than 20% for any critical KPI.

**Likelihood:** High (H)  
**Impact:** Medium (M)  
- Timeline: May require 3-5 days to recalibrate targets
- Quality: Does not affect deliverable quality
- KPIs: Affects target credibility and progress tracking

**Root Causes:**  
- Limited historical analytics data available
- Baseline derived from audit estimates, not instrumented tracking
- Assumptions about user behavior may not match reality

**Mitigation Strategy:**  
1. Mark all estimated baselines explicitly in KPI Baseline Sheet
2. Prioritize analytics instrumentation setup in first 2 weeks
3. Plan for baseline update after instrumentation freeze (Decision D-002 in KPI sheet)
4. Set conservative 30-day targets that allow for baseline adjustment

**Contingency Plan (if triggered):**  
1. Analytics Lead documents variance and root cause
2. Recalibrate baseline with actual data within 48 hours
3. Proportionally adjust 30-day and 90-day targets
4. Document change in Decision Log
5. Communicate updated baselines to all stakeholders
6. No timeline or scope impact - measurement adjustment only

**Owner:** Analytics Lead  
**Mitigation Owner:** Analytics Lead  
**Last Review:** 2026-05-06  
**Next Review:** Weekly until instrumentation complete, then monthly  

**Related Decisions:** D-006  
**Related Artifacts:** KPI Baseline Sheet  

---

### R-003: Conversion Flow Underperformance

**Category:** UX / Conversion  
**Risk Score:** 🔴 High Risk (Medium Likelihood × High Impact)  
**Status:** 🟡 Open - Mitigating  

**Description:**  
Conversion flows underperform due to insufficient intent segmentation or poor form UX.

**Trigger Condition:**  
Form completion rate below 35% after launch week OR click-to-call CTR below 2.5% after launch week.

**Likelihood:** Medium (M)  
**Impact:** High (H)  
- Business: Directly affects lead volume and revenue targets
- Timeline: Could require 1-2 weeks of UX iteration
- Quality: Indicates UX design failure

**Root Causes:**  
- User intent may not align with designed conversion paths
- Form fields may be too numerous or confusing
- Mobile UX may have friction points
- CTA visibility or messaging may be unclear

**Mitigation Strategy:**  
1. Maintain short and long form options segmented by intent
2. Monitor drop-off steps at form field level
3. A/B test CTA messaging and placement in first 2 weeks
4. Conduct user testing before launch (5 users minimum)
5. Implement form field analytics (focus, change, blur events)

**Contingency Plan (if triggered):**  
1. UX Owner conducts immediate form audit (within 24 hours)
2. Identify top 3 drop-off points from analytics
3. Prioritize fixes based on impact (form field removal, CTA repositioning, etc.)
4. Deploy fixes within 3 business days
5. Monitor for 1 week to validate improvement
6. Iterate if needed

**Owner:** UX Owner  
**Mitigation Owner:** UX Owner + Frontend Lead  
**Last Review:** 2026-05-06  
**Next Review:** Weekly  

**Related Decisions:** D-003  
**Related Artifacts:** Conversion UX Blueprint, Journey Maps, Form validation in system.js  

---

### R-004: Accessibility Compliance Failures

**Category:** Accessibility / Quality  
**Risk Score:** 🔴 High Risk (Medium Likelihood × High Impact)  
**Status:** 🟡 Open - Mitigating  

**Description:**  
Keyboard and screen-reader issues block usable conversion paths, causing accessibility failures.

**Trigger Condition:**  
Any critical user journey cannot be completed without a pointer device (mouse/trackpad).

**Likelihood:** Medium (M)  
**Impact:** High (H)  
- Quality: Fails WCAG 2.1 AA compliance (blocks launch per D-004)
- Legal: ADA compliance risk
- Business: Excludes users, reduces conversion, damages trust

**Root Causes:**  
- Custom interactive components may lack keyboard support
- Focus management may be incomplete (especially in modals, accordions)
- ARIA labels may be missing or incorrect
- Form error states may not be announced to screen readers

**Mitigation Strategy:**  
1. Mandatory accessibility checklist sign-off before any component ships
2. Pre-launch keyboard walkthrough of all critical journeys (QA Owner)
3. Screen reader testing (NVDA/JAWS on Windows, VoiceOver on macOS/iOS)
4. Automated accessibility scans with axe DevTools on every PR
5. Focus trap and focus restore implemented in all modals/overlays

**Contingency Plan (if triggered):**  
1. QA Owner identifies failing journey and specific barrier (within 4 hours)
2. Frontend Lead prioritizes fix as P0 (blocks launch)
3. Fix implemented and tested within 1 business day
4. Re-test full accessibility checklist
5. Document fix in Decision Log if pattern change required

**Owner:** QA Owner  
**Mitigation Owner:** QA Owner + Frontend Lead  
**Last Review:** 2026-05-06  
**Next Review:** Weekly during development, monthly post-launch  

**Related Decisions:** D-004  
**Related Artifacts:** Accessibility Contrast Matrix, Design QA Checklist, Go/No-Go Gate C  

---

### R-005: Frontend Quality Drift (CSS/JS Inconsistency)

**Category:** Frontend Quality / Technical Debt  
**Risk Score:** 🟡 Medium Risk (Medium Likelihood × Medium Impact)  
**Status:** 🟡 Open - Mitigating  

**Description:**  
Ad-hoc CSS and JavaScript changes reduce consistency and maintainability over time.

**Trigger Condition:**  
New components ship without token references or checklist sign-off in 2+ consecutive PRs.

**Likelihood:** Medium (M)  
**Impact:** Medium (M)  
- Quality: Reduces design consistency and accessibility
- Timeline: Technical debt slows future changes (3-5 days accumulated delay)
- Maintenance: Harder to update shared styles or behaviors

**Root Causes:**  
- Pressure to ship quickly may skip design system references
- New developers may not be familiar with token system
- No automated enforcement of token usage
- Lack of PR review checklist for design system compliance

**Mitigation Strategy:**  
1. Tokenized CSS variables and QA checklist gate (already implemented)
2. PR review checklist includes "Uses design tokens" checkbox
3. Frontend Lead reviews all component PRs for token compliance
4. Monthly design system audit (automated grep for hardcoded values)
5. Documentation links in system.css comments

**Contingency Plan (if triggered):**  
1. Frontend Lead flags violation in PR review (immediate)
2. Contributor refactors to use tokens before merge (within 1 day)
3. If merged accidentally, create follow-up ticket (P2 priority)
4. Include in next sprint if not critical path
5. Update PR checklist to prevent recurrence

**Owner:** Frontend Lead  
**Mitigation Owner:** Frontend Lead  
**Last Review:** 2026-05-06  
**Next Review:** Monthly  

**Related Decisions:** D-002  
**Related Artifacts:** design-system/TOKENS.md, frontend/assets/css/system.css  

---

### R-006: JavaScript Error Budget Exceeded

**Category:** Technical / Performance  
**Risk Score:** 🔴 High Risk (Medium Likelihood × High Impact)  
**Status:** 🟡 Open - Mitigating  

**Description:**  
JavaScript error budget exceeded under real traffic conditions, causing user experience degradation.

**Trigger Condition:**  
Uncaught JS errors exceed 8 per 1000 sessions for two consecutive days.

**Likelihood:** Medium (M)  
**Impact:** High (H)  
- UX: Broken interactions reduce conversion
- Quality: Indicates code quality issues
- Business: Directly impacts conversion KPIs

**Root Causes:**  
- Edge cases not covered in testing (browsers, devices, network conditions)
- Third-party script errors (analytics, chat, etc.)
- Race conditions or timing issues under load
- Insufficient error handling in async operations

**Mitigation Strategy:**  
1. Add client-side error tracking (Sentry or GA4 exceptions)
2. Prioritize top error classes in weekly review
3. Comprehensive try-catch blocks around async operations
4. Graceful degradation for non-critical features
5. Third-party script error isolation (load async, fail gracefully)
6. Browser testing matrix (Chrome, Firefox, Safari, Edge; latest 2 versions)

**Contingency Plan (if triggered):**  
1. Frontend Lead reviews error reports within 4 hours
2. Triage errors by frequency and impact (conversion-blocking = P0)
3. Fix P0 errors within 1 business day
4. Fix other errors within 1 week based on priority
5. Deploy fixes and monitor for 48 hours
6. If error rate remains high, escalate to Program Lead

**Owner:** Frontend Lead  
**Mitigation Owner:** Frontend Lead  
**Last Review:** 2026-05-06  
**Next Review:** Weekly  

**Related Decisions:** None (KPI defined in baseline)  
**Related Artifacts:** KPI Baseline Sheet (JS Error Budget), system.js  

---

### R-007: Missing UX/Design Artifacts Reduce Traceability

**Category:** Dependency / Documentation  
**Risk Score:** 🟡 Medium Risk (Medium Likelihood × High Impact)  
**Status:** 🟢 Mitigated  

**Description:**  
Missing Issue 2 (UX/IA) and Issue 3 (Design System) artifacts reduce traceability confidence and implementation clarity.

**Trigger Condition:**  
Template implementation cannot map to artifact references OR >30% of design decisions lack documented rationale.

**Likelihood:** Medium (M) → Low (L) after mitigation  
**Impact:** High (H)  
- Quality: Reduces design consistency and traceability
- Timeline: Could cause 1-2 weeks of rework if requirements unclear
- Compliance: Affects ability to validate against acceptance criteria

**Root Causes:**  
- UX and design work may have been done separately from implementation
- Artifacts may exist but not be linked or discoverable
- Handoff between design and development may be incomplete

**Mitigation Strategy:**  
✅ **COMPLETED:**
1. Bootstrap minimum IA/design artifacts in-repo before continuing implementation
2. Create cross-reference traceability matrix
3. Link all artifacts in governance docs and README

**Evidence of Mitigation:**
- ✅ ux/ directory contains IA-SITEMAP-v1.md, JOURNEY-MAPS-v1.md, CONVERSION-UX-BLUEPRINT-v1.md, WIREFRAME-SPECS-v1.md
- ✅ design-system/ directory contains TOKENS.md, COMPONENT-SPECS.md, ACCESSIBILITY-CONTRAST-MATRIX.md, etc.
- ✅ qa/ISSUE-2-3-TRACEABILITY-MATRIX.md maps templates to artifacts
- ✅ All artifacts cross-linked in docs/README.md

**Current Status:** 🟢 **Mitigated** - artifacts in place, traceability established

**Owner:** Program Lead  
**Mitigation Owner:** Program Lead (completed)  
**Last Review:** 2026-05-06  
**Next Review:** Monthly (monitoring only)  

**Related Decisions:** D-001, D-002  
**Related Artifacts:** All ux/, design-system/, and qa/ artifacts  

---

### R-008: Platform Architecture Decision Delay

**Category:** Technical / Dependency  
**Risk Score:** 🟡 Medium Risk (Medium Likelihood × Medium Impact)  
**Status:** 🟡 Open - Mitigating  

**Description:**  
Delay in finalizing platform architecture (WordPress + Bricks vs. alternatives) could impact deployment timeline.

**Trigger Condition:**  
Platform decision not made within 2 weeks of frontend baseline completion.

**Likelihood:** Medium (M)  
**Impact:** Medium (M)  
- Timeline: Could delay production deployment by 1-2 weeks
- Budget: May affect hosting and tooling costs
- Scope: Does not affect frontend deliverables (decoupled by D-002)

**Root Causes:**  
- Multiple platform options to evaluate (WordPress/Bricks, custom, headless CMS, etc.)
- Need to balance ease of use, performance, cost, and flexibility
- Stakeholder input required for CMS content editing requirements

**Mitigation Strategy:**  
1. Static frontend baseline decoupled from platform (D-002) - already mitigating
2. Schedule platform decision workshop within 2 weeks
3. Document decision criteria (performance, cost, ease of use, integration needs)
4. Evaluate top 3 options against criteria
5. Make decision and log in Decision Log as ADR (Architecture Decision Record)

**Contingency Plan (if triggered):**  
1. Default to WordPress + Bricks (recommended option from charter)
2. Frontend baseline integrates as-is (HTML/CSS/JS portable)
3. Accept 1-week timeline slip for CMS integration if needed
4. Document decision rationale in Decision Log

**Owner:** Frontend Lead  
**Mitigation Owner:** Program Lead + Frontend Lead  
**Last Review:** 2026-05-06  
**Next Review:** Weekly  

**Related Decisions:** D-002  
**Related Artifacts:** Program Charter (platform mention), to-be-created ADR  

---

### R-009: Deployment and Rollback Procedure Untested

**Category:** Technical / Operations  
**Risk Score:** 🔴 High Risk (High Likelihood × High Impact)  
**Status:** 🔴 Open - Not Mitigated  

**Description:**  
End-to-end deployment from main to staging and production not reproducibly working. Rollback procedure not tested.

**Trigger Condition:**  
Unable to deploy to staging OR production within 2 attempts OR rollback procedure fails when tested.

**Likelihood:** High (H)  
**Impact:** High (H)  
- Timeline: Blocks production launch (could delay by 1-2 weeks)
- Quality: Untested deployment increases failure risk
- Scope: Directly affects Issue 4 acceptance criteria

**Root Causes:**  
- CI/CD workflow exists for validation but not deployment automation
- Staging and production environments not provisioned or documented
- Deployment process not documented or automated
- Rollback procedure not defined or tested

**Mitigation Strategy (Required Actions):**  
1. **Provision environments:** Set up dev, staging, and production environments with access controls
2. **Document deployment:** Create step-by-step deployment runbook
3. **Automate deployment:** Extend GitHub Actions workflow to deploy to staging on main merge
4. **Test deployment:** Execute full deployment to staging and verify
5. **Define rollback:** Document rollback procedure (revert commit + redeploy OR maintain previous version)
6. **Test rollback:** Execute rollback procedure at least once to verify it works

**Contingency Plan (if triggered):**  
1. Escalate to Program Sponsor immediately (L3 escalation)
2. Allocate dedicated time for Platform Owner to resolve (P0 priority)
3. Consider manual deployment process if automation blocked
4. Accept 1-week timeline slip if environment provisioning delayed
5. Do NOT launch to production without successful staging deployment + rollback test

**Owner:** Platform Owner  
**Mitigation Owner:** Platform Owner  
**Last Review:** 2026-05-06  
**Next Review:** Daily until resolved  

**Related Decisions:** D-005 (CI/CD)  
**Related Artifacts:** Issue 4 acceptance criteria, .github/workflows/ci.yml (to be extended)  

**⚠️ CRITICAL:** This risk directly blocks Issue 4 acceptance criteria. Must be resolved before launch.

---

### R-010: Monitoring and Alerting Not Configured

**Category:** Technical / Operations  
**Risk Score:** 🔴 High Risk (High Likelihood × High Impact)  
**Status:** 🔴 Open - Not Mitigated  

**Description:**  
Uptime monitoring and error alerting not configured, preventing issue detection and response.

**Trigger Condition:**  
No monitoring service configured OR no alert notifications delivered when test incident created.

**Likelihood:** High (H)  
**Impact:** High (H)  
- Quality: Cannot detect or respond to outages or errors
- Business: Downtime or errors may go unnoticed, harming conversion and trust
- Scope: Directly affects Issue 4 acceptance criteria

**Root Causes:**  
- Monitoring service not selected or configured
- Alert channels (email, Slack) not set up
- Alert thresholds not defined
- No on-call or incident response process

**Mitigation Strategy (Required Actions):**  
1. **Select monitoring service:** UptimeRobot, Pingdom, or similar (free tier acceptable for start)
2. **Configure uptime checks:** 1-minute interval checks on homepage + key pages
3. **Configure error tracking:** Sentry or GA4 exception tracking for JS errors
4. **Set up alerts:** Email and Slack notifications for downtime, performance degradation, error spikes
5. **Define alert thresholds:** Downtime (any), response time >5s, JS error rate >10/1000 sessions
6. **Test alerts:** Trigger test incident to verify notification delivery
7. **Document incident response:** Who gets alerted, SLA for response, escalation path

**Contingency Plan (if triggered):**  
1. Escalate to Platform Owner immediately (P0 priority)
2. Set up basic monitoring within 1 business day (can use free tools)
3. Test alerts before production launch (mandatory)
4. Accept manual checks temporarily if automated monitoring delayed
5. Do NOT launch to production without monitoring + alerting verified

**Owner:** Platform Owner  
**Mitigation Owner:** Platform Owner + Frontend Lead  
**Last Review:** 2026-05-06  
**Next Review:** Daily until resolved  

**Related Decisions:** None yet (to be logged when monitoring selected)  
**Related Artifacts:** Issue 4 acceptance criteria, KPI Baseline Sheet (Uptime SLA, JS Error Budget)  

**⚠️ CRITICAL:** This risk directly blocks Issue 4 acceptance criteria. Must be resolved before launch.

---

## Risk Summary Dashboard

### Risk Count by Status
- 🔴 **Critical/High Risk:** 5 (R-003, R-004, R-006, R-009, R-010)
- 🟡 **Medium Risk:** 4 (R-001, R-002, R-005, R-008)
- 🟢 **Low Risk / Mitigated:** 1 (R-007)

### Risk Count by Category
- **Technical / Operations:** 4 (R-005, R-006, R-009, R-010)
- **UX / Conversion:** 1 (R-003)
- **Accessibility / Quality:** 1 (R-004)
- **Scope / Process:** 1 (R-001)
- **Data / Measurement:** 1 (R-002)
- **Dependency / Documentation:** 1 (R-007, mitigated)
- **Platform Architecture:** 1 (R-008)

### Top Risks Requiring Immediate Action
1. **R-009: Deployment/Rollback Untested** - Blocks Issue 4 acceptance, Platform Owner must resolve
2. **R-010: Monitoring Not Configured** - Blocks Issue 4 acceptance, Platform Owner must resolve
3. **R-004: Accessibility Failures** - Blocks launch per D-004, QA Owner actively mitigating
4. **R-003: Conversion Underperformance** - Business impact, UX Owner actively mitigating
5. **R-006: JS Error Budget** - Conversion impact, Frontend Lead actively mitigating

---

## Risk Review Process

### Weekly Risk Review (in Operating Review)
1. Review all active risks for status updates
2. Identify any new risks discovered during the week
3. Update likelihood/impact if conditions changed
4. Verify mitigation actions are on track
5. Escalate any high-risk items not progressing

### New Risk Identification
Anyone on the team can identify a new risk. To add a risk:
1. Document using risk template below
2. Bring to next operating review for discussion
3. Program Lead assigns risk ID and owner
4. Add to risk register with status "Open - Pending Review"
5. Develop mitigation strategy within 1 week

### Risk Closure Criteria
A risk can be closed if:
- **Mitigated:** Mitigation actions successful, risk reduced to low score, monitoring only
- **Avoided:** Root cause eliminated, risk no longer possible
- **Accepted:** Conscious decision to accept low-score risk without further mitigation
- **Occurred:** Risk became an issue, managed through issue tracking instead

---

## Risk Template (for new risks)

### R-XXX: [Risk Title]

**Category:** [Scope/Technical/UX/Quality/Data/Process/Budget/Timeline]  
**Risk Score:** [Color] [Risk Level] ([Likelihood] × [Impact])  
**Status:** [Open/Mitigating/Mitigated/Closed]  

**Description:**  
[What could go wrong? Be specific.]

**Trigger Condition:**  
[What observable event signals this risk has occurred or is occurring?]

**Likelihood:** [High/Medium/Low]  
**Impact:** [High/Medium/Low]  
[Explain impact on timeline, budget, quality, scope]

**Root Causes:**  
[Why might this risk occur? What are the underlying factors?]

**Mitigation Strategy:**  
[What actions will reduce likelihood or impact? Be specific and actionable.]

**Contingency Plan (if triggered):**  
[What will we do if the risk occurs? Step-by-step response.]

**Owner:** [Role responsible for overall risk]  
**Mitigation Owner:** [Role responsible for executing mitigation]  
**Last Review:** [YYYY-MM-DD]  
**Next Review:** [Frequency - Weekly/Monthly/Quarterly]  

**Related Decisions:** [Link to Decision Log entries]  
**Related Artifacts:** [Link to relevant documents]  

---

## Related Documents
- [Program Charter](PROGRAM-CHARTER.md)
- [KPI Baseline Sheet](KPI-BASELINE-SHEET.md)
- [Weekly Review Template](WEEKLY-REVIEW-TEMPLATE.md)
- [Decision Log](DECISION-LOG.md)
- [Go/No-Go Criteria](GO-NO-GO-CRITERIA.md)

---

## Document Control

**Version History:**
- v1.0 (2026-05-05): Initial risk register with R-001 through R-007
- v2.0 (2026-05-06): Enhanced with risk matrix, process, R-008 through R-010, and Issue 4-specific risks

**Owner:** Program Lead  
**Review Cadence:** Weekly during operating review  
**Next Review:** Next weekly operating review  
