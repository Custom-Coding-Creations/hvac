# Operational Runbooks Hub

**Version:** 1.0  
**Owner:** Program Lead  
**Last Updated:** 2026-05-06  
**Audience:** All team members, especially on-call engineers  

---

## Purpose

This page is the central hub for all operational runbooks. Each runbook covers a specific operational process or incident response procedure.

---

## Quick Navigation

### For On-Call Engineers

**🚨 "Help! There's an alert!"**  
→ Start here: [Monitoring and Alerts Runbook](MONITORING-AND-ALERTS-RUNBOOK.md)

**📦 "I need to deploy code to production"**  
→ Start here: [Deployment Runbook](DEPLOYMENT-RUNBOOK.md)

**🔄 "I need to rollback because production is broken"**  
→ Start here: [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md)

**📋 "Who do I call if I'm stuck?"**  
→ See: [Operational Ownership](OPERATIONAL-OWNERSHIP.md)

### For Developers

**🚀 "How do I get code to production?"**  
→ [Deployment Runbook](DEPLOYMENT-RUNBOOK.md#deployment-procedure-automated)

**✅ "What should I test before I merge?"**  
→ [Deployment Runbook](DEPLOYMENT-RUNBOOK.md#pre-deployment-checklist)

**🐛 "My code broke production, what do I do?"**  
→ [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md)

### For Program Lead / Managers

**🎯 "What's our incident response policy?"**  
→ [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md#incident-classification)

**📊 "How do we track operational metrics?"**  
→ [KPI-BASELINE-SHEET](KPI-BASELINE-SHEET.md) + [Monitoring and Alerts Runbook](MONITORING-AND-ALERTS-RUNBOOK.md)

**👥 "Who is responsible for what?"**  
→ [Operational Ownership](OPERATIONAL-OWNERSHIP.md)

---

## All Runbooks

### 1. [Monitoring and Alerts Runbook](MONITORING-AND-ALERTS-RUNBOOK.md)

**Purpose:** Explain how to interpret alerts and respond to monitoring notifications

**Who Should Read:**
- On-call engineers (required)
- Frontend Lead (reference)
- Platform Owner (reference)

**When to Use:**
- UptimeRobot alert received
- Sentry error spike alert received
- Regular monitoring during shift

**Key Sections:**
- UptimeRobot monitoring and alerts
- Sentry error tracking and alerts
- Common error patterns and responses
- Alert response workflow
- Escalation matrix

**SLA:** Acknowledge alerts within 5 minutes

---

### 2. [Deployment Runbook](DEPLOYMENT-RUNBOOK.md)

**Purpose:** Guide for deploying code to staging and production

**Who Should Read:**
- Developers preparing to merge (required)
- Frontend Lead (required)
- On-call engineers (reference)

**When to Use:**
- Before merging code to main
- Before production deployment approval
- Hotfix deployment needed
- Manual deployment to staging

**Key Sections:**
- Pre-deployment checklist
- Automated deployment workflow
- Manual deployment procedure
- Deployment monitoring
- Post-deployment verification
- Rollback quick start

**SLA:** Staging deployment <5 min, Production <10 min (after approval)

---

### 3. [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md)

**Purpose:** Response procedures for production incidents

**Who Should Read:**
- On-call engineers (required)
- Program Lead (reference)
- All developers (read once for awareness)

**When to Use:**
- Production issue detected
- Need to decide: rollback or hotfix?
- Need to trigger rollback
- Conducting post-mortem

**Key Sections:**
- Incident classification (P1-P4)
- Incident response flow
- Critical incident (P1) response
- High priority incident (P2) response
- Post-incident procedures and post-mortem
- Incident communication templates
- Escalation path

**SLA:** P1 critical incidents resolved within 1 hour

---

### 4. [Operational Ownership and Escalation](OPERATIONAL-OWNERSHIP.md)

**Purpose:** Clarify who owns each system and who to contact

**Who Should Read:**
- Everyone (especially on-call engineers)
- New team members (onboarding)
- Managers (understanding responsibilities)

**When to Use:**
- Unclear who to contact
- Need to escalate
- Verifying access or permissions
- On-call rotation changes
- New system added

**Key Sections:**
- System ownership matrix (Vercel, Sentry, UptimeRobot, GitHub, GA4)
- On-call rotation and handoff
- Escalation procedure (4 levels)
- Contact directory
- Decision authority by domain
- On-call checklists
- Access and credential management

**SLA:** Level 1 (on-call) responds within 15 min, escalates if needed

---

## Architecture Decision Records (ADRs)

**Reference documentation for why we chose certain technologies:**

| ADR | Topic | Decision | Rationale |
|---|---|---|---|
| [ADR-0001](ADR-0001-platform-decision-deferred.md) | Platform Approach | Portable static HTML/CSS/JS baseline | Flexibility, no vendor lock-in, works with any hosting |
| [ADR-0002](ADR-0002-hosting-platform-selection.md) | Hosting Platform | Vercel | Zero-ops, free tier, excellent GitHub integration |
| [ADR-0003](ADR-0003-monitoring-and-alerting-stack.md) | Monitoring Stack | UptimeRobot + Sentry | Industry standard, free tier, minimal config |
| [ADR-0004](ADR-0004-secrets-management.md) | Secrets Management | GitHub Secrets + Vercel Env Vars | Native, secure, no additional infrastructure |
| [ADR-0005](ADR-0005-rollback-strategy.md) | Rollback Strategy | Vercel history + manual override | Fast, safe, testable |

---

## Related Documentation

### Program Governance
- [Program Charter](PROGRAM-CHARTER.md) — Overall program scope, objectives, roles
- [KPI Baseline Sheet](KPI-BASELINE-SHEET.md) — Success metrics and targets
- [Risk Register](RISK-REGISTER.md) — Known risks and mitigation strategies
- [Go/No-Go Criteria](GO-NO-GO-CRITERIA.md) — Launch readiness gates
- [Decision Log](DECISION-LOG.md) — Approved decisions and rationale

### Infrastructure & Deployment
- [Architecture Diagram](ARCHITECTURE-DIAGRAM.md) — System architecture overview
- [Environment Setup](ENVIRONMENT-SETUP.md) — Dev/staging/prod topology
- [CI/CD Workflow](CICD-WORKFLOW.md) — High-level CI/CD strategy
- [Security Baseline](SECURITY-BASELINE.md) — Security controls checklist

### Quality & Validation
- [Accessibility QA](../../qa/ACCESSIBILITY-RESPONSIVE-QA.md) — Accessibility testing procedures
- [Functional Checks](../../qa/FUNCTIONAL-CHECKS.md) — Feature testing checklist
- [Before/After Evidence](../../qa/BEFORE-AFTER-EVIDENCE.md) — Deliverable validation

---

## Troubleshooting Decision Tree

```
PROBLEM: "I don't know what to do"

1. Is it an ALERT (Slack message)?
   ├─ YES → Go to Monitoring and Alerts Runbook
   └─ NO → Go to Step 2

2. Is it a DEPLOYMENT issue (code won't deploy)?
   ├─ YES → Go to Deployment Runbook
   └─ NO → Go to Step 3

3. Is the WEBSITE DOWN (users can't access)?
   ├─ YES → Go to Incident Response Runbook (P1 Critical)
   └─ NO → Go to Step 4

4. Do I need to CONTACT someone?
   ├─ YES → Go to Operational Ownership (Escalation Procedure)
   └─ NO → Check if it's documented in runbooks

5. Is it an incident that needs a POST-MORTEM?
   ├─ YES → Go to Incident Response Runbook (Post-Mortem section)
   └─ NO → You're probably done!

STILL STUCK? → Go to Operational Ownership and escalate to Platform Owner
```

---

## Standard Operating Procedures (SOPs)

### Daily/Weekly Checks

**Every morning (or start of shift):**
- Review [On-Call Shift Start Checklist](OPERATIONAL-OWNERSHIP.md#start-of-shift-checklist)
- Verify all systems healthy (Sentry, UptimeRobot, Vercel)

**Every hour (during on-call shift):**
- Review [Hourly Health Check](OPERATIONAL-OWNERSHIP.md#hourly-check-during-shift)

**Every week:**
- Review [Weekly Operating Review Template](WEEKLY-REVIEW-TEMPLATE.md)
- Check KPI dashboard (targets vs. actuals)
- Review incident summary (0 or list any)

**Every quarter:**
- Review and rotate secrets (see [ADR-0004: Secrets Management](ADR-0004-secrets-management.md))
- Review [Risk Register](RISK-REGISTER.md) and update risk scores
- Review operational runbooks for accuracy
- Conduct runbook improvements/updates

---

## Incident Response Checklists (Printable)

### P1 Critical Incident Quick Start

```
🚨 CRITICAL INCIDENT - QUICK START

⏱ TIMER START: [time]

1. ✅ ACKNOWLEDGE
   - Mark in Slack: "On it"
   - Note current time

2. 🔍 CONFIRM
   - Website really down? https://hvac-app.vercel.app/
   - Sentry shows errors? Check dashboard
   - GitHub shows recent deploy? Check Actions

3. 🎯 DECIDE
   - Recent deploy broke it? → ROLLBACK
   - External service issue? → Escalate
   - Unknown? → Rollback (safer than investigating)

4. ⚡ TRIGGER ROLLBACK
   - GitHub → Actions → Rollback Deployment
   - Environment: Production
   - Reason: "Health checks failed"
   - Submit

5. ✅ VERIFY
   - Website loads? https://hvac-app.vercel.app/
   - Workflow shows SUCCESS?
   - Check Sentry: error rate down?

6. 📢 NOTIFY
   - Slack #deployments: "[time] Production recovered"
   - Message Program Lead: "Issue resolved"

TOTAL TIME: Should be <10 minutes

STUCK LONGER THAN 10 MIN? → ESCALATE to Platform Owner
```

### P2 High Priority Checklist

```
🚨 HIGH PRIORITY INCIDENT

⏱ TIMER START: [time]

1. ✅ ASSESS
   - How many users affected?
   - Can they still convert (some workaround)?
   - Is core feature broken?

2. 🔍 INVESTIGATE (max 15 minutes)
   - Check Sentry for error details
   - Check GitHub for recent deploys
   - Check external service status

3. 🎯 DECIDE
   - Rollback? (if cause unclear or complex)
   - Hotfix? (if cause clear and fix simple)
   - Escalate? (if unsure)

4. ⚡ EXECUTE
   - Follow Deployment or Incident Response runbook
   - Document what you're doing

5. ✅ VERIFY
   - Issue resolved?
   - Error rate dropping?
   - Users can convert again?

6. 📝 DOCUMENT
   - Post incident summary
   - Create GitHub issue if not auto-created
   - Schedule post-mortem

ESCALATE IF: Still investigating after 15 minutes
```

---

## Metrics and KPIs

### Operational Metrics to Track

| Metric | Target | Measurement |
|---|---|---|
| **MTTD** (Mean Time To Detect) | <5 min | Time from issue occurrence to alert received |
| **MTTA** (Mean Time To Acknowledge) | <15 min | Time from alert to on-call responds |
| **MTTR** (Mean Time To Resolve) | P1: <1h, P2: <4h | Time from issue to fix deployed |
| **Uptime** | >99% | Percentage of time website accessible (monthly) |
| **Rollback Success Rate** | 100% | Percentage of rollbacks that resolve issue |
| **Post-Mortem Completion** | 100% | Percentage of P1/P2 incidents with post-mortem |

See [KPI Baseline Sheet](KPI-BASELINE-SHEET.md) for full metric details.

---

## Training and Onboarding

### New Team Member Onboarding

**Week 1:**
1. [ ] Read [Program Charter](PROGRAM-CHARTER.md)
2. [ ] Read [Operational Ownership](OPERATIONAL-OWNERSHIP.md)
3. [ ] Set up system access (Vercel, Sentry, GitHub, etc.)
4. [ ] Pair with on-call engineer for one shift

**Week 2:**
5. [ ] Read all runbooks (Deployment, Monitoring, Incident Response)
6. [ ] Do "walk-through" deployment (with mentor)
7. [ ] Review recent incidents and post-mortems

**Week 3:**
8. [ ] Join on-call rotation (as backup initially)
9. [ ] Participate in first monthly runbook drill

### New On-Call Engineer Certification

**Requirements:**
1. [ ] Completed all runbook training (sign-off by Platform Owner)
2. [ ] Performed at least 1 full deployment with mentor
3. [ ] Participated in rollback drill (successful completion)
4. [ ] Demonstrated understanding of incident classification
5. [ ] Shadowed one full on-call shift
6. [ ] Passed on-call scenario test (mock incident response)

**Certification Sign-Off:** Platform Owner + Program Lead

---

## Resources and External Links

### Documentation
- [GitHub Repository](https://github.com/Custom-Coding-Creations/hvac)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Sentry Dashboard](https://sentry.io/)
- [UptimeRobot Dashboard](https://uptimerobot.com/dashboard)
- [GA4 Analytics](https://analytics.google.com/)

### External References
- [Vercel Deployment Documentation](https://vercel.com/docs)
- [GitHub Actions Workflows](https://docs.github.com/en/actions)
- [Sentry Error Tracking](https://docs.sentry.io/)
- [Incident Response Best Practices](https://www.pagerduty.com/resources/guides/)

---

## Feedback and Improvements

**Runbook Issues?** Create a GitHub issue with label `runbook-feedback`

**Runbook Too Long/Complex?** Summarize and create a quick reference card

**Missing Procedure?** Request addition during [Weekly Operating Review](WEEKLY-REVIEW-TEMPLATE.md)

**Found an Error?** Create GitHub issue immediately (critical) or note for next review

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-05-06 | Platform Architect | Initial version: 4 runbooks created |
| [TBD] | [TBD] | [TBD] | [TBD] |

**Last Updated:** 2026-05-06  
**Next Review:** 2026-06-06 (first monthly review after launch)  
**Review Frequency:** Monthly (or when incident patterns emerge)

---

## Quick Links for Copy-Paste

### For Slack Status
```
🚨 On-call for Issue #4 operations - responding to alerts
```

### For Email Signature
```
On-call: [your name]
Shift: [dates]
Response SLA: <15 min acknowledgment
Escalation: @platform-owner
```

### For Bookmarks
- Monitoring: https://uptimerobot.com/dashboard
- Errors: https://sentry.io/
- Hosting: https://vercel.com/dashboard
- Code: https://github.com/Custom-Coding-Creations/hvac
- Analytics: https://analytics.google.com/
- Runbooks: [Link to this page]

---

## Support and Questions

**"Which runbook should I read?"**  
→ Start with the [Quick Navigation](#quick-navigation) section above

**"I can't find the answer in the runbooks"**  
→ Go to [Operational Ownership](OPERATIONAL-OWNERSHIP.md) and escalate

**"The runbook is confusing or incomplete"**  
→ Create issue with `runbook-feedback` label

**"I want to improve a runbook"**  
→ Create pull request with your improvements
