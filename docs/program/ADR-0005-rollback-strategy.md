# ADR-0005: Rollback Strategy and Failure Recovery

**Date:** 2026-05-06  
**Status:** ✅ Accepted  
**Deciders:** Platform Owner, Frontend Lead, QA Owner  
**Stakeholders:** On-Call Engineer, Program Lead

---

## Context

Production issues can occur despite rigorous testing. We need a documented, rehearsed rollback strategy to minimize:
- **Downtime:** Time from issue detection to recovery
- **Customer impact:** Failed conversions, lost leads
- **User confusion:** Users seeing broken website, no explanation

Requirements:
- **Fast rollback:** <5 minutes from decision to deployed
- **Automatic triggers:** Some issues should auto-rollback without waiting for human decision
- **Manual override:** Human judgment for complex decisions
- **Verifiable:** Health checks must confirm rollback success
- **Documented:** Clear decision tree and playbook
- **Tested:** Regular drill to ensure procedure works

Evaluated strategies: Blue-green deployments, canary releases, feature flags, simple rollback.

---

## Decision

**Use Vercel's built-in rollback capability with automated health checks and manual override.**

1. **Deployment History:** Vercel maintains 5+ previous successful deployments
2. **Automatic Rollback Triggers:**
   - Health check failure (5xx errors, timeouts)
   - Sentry error spike >50 errors/min
3. **Manual Rollback:** GitHub Actions workflow (`rollback.yml`) for operator-initiated rollback
4. **Decision Gate:** Clear decision tree to determine "rollback vs. fix forward"

---

## Rationale

### Why This Strategy?

1. **Vercel's built-in capabilities:** Deployment history available in UI; no custom infrastructure.
2. **Fast execution:** Rollback redeploys previous commit; <5 min to production.
3. **Safe:** Previous version is known-good; less risky than deploying untested fix.
4. **Transparent:** Clear audit trail: what version, when, why, who approved.
5. **Team-friendly:** Operators can trigger via GitHub UI; no special access needed.
6. **Testable:** Can drill rollback procedure regularly (safer than drilling with production traffic).

### Trade-offs Accepted

- **Limited to previous commits:** Can only rollback to previous version (not arbitrary point in history). Mitigation: acceptable for small team with frequent commits.
- **No feature flags:** Can't toggle features without deploy. Mitigation: acceptable for this project size; can add feature flags later if needed.
- **No canary deployment:** Can't deploy to subset of users first. Mitigation: acceptable for small site; staging environment is canary equivalent.
- **No blue-green:** Can't have two parallel environments. Mitigation: acceptable; Vercel's fast rollback compensates.

---

## Alternatives Considered

### 1. Feature Flags (Dark Launches)
- **Pros:** Can deploy code without activating; rollback = flip flag (instant).
- **Cons:** Adds complexity; requires feature flag infrastructure (LaunchDarkly, etc.); not necessary for this project.
- **Status:** Considered for future; rejected as over-engineering for current scale.

### 2. Blue-Green Deployments
- **Pros:** Run two parallel identical environments; switch traffic instantly.
- **Cons:** Doubles infrastructure cost; overkill for static site; Vercel doesn't natively support.
- **Status:** Rejected; Vercel rollback faster and cheaper.

### 3. Canary Releases (Progressive Rollout)
- **Pros:** Deploy to 5% of users first; monitor for issues before rolling to 100%.
- **Cons:** Requires traffic splitting infrastructure; extra complexity; not necessary for this site.
- **Status:** Rejected; staging environment serves as canary equivalent.

### 4. Simple Rollback (Current Plan)
- **Pros:** Simple, fast, tested.
- **Cons:** All or nothing; must rollback entire version (can't patch specific issues).
- **Status:** Chosen; appropriate for team size and project complexity.

---

## Rollback Procedure

### Automatic Rollback Triggers

**Trigger 1: Health Check Failure (post-deploy)**
```
Deploy to production
↓
Run health checks (HTTP 200, page structure valid)
↓
If health check fails:
  → Automatic rollback to previous version
  → Health checks re-run on rolled-back version
  → If success: email alert + incident issue created
```

**Trigger 2: Sentry Error Spike**
```
Error spike detected: >50 errors/min for 5 min consecutive
↓
Sentry alert to on-call engineer (Slack + email)
↓
On-call reviews Sentry dashboard:
  - Error rate > 50/min persistent? → proceed to rollback
  - Error spike temporary (<5 min)? → monitor instead
↓
If proceed to rollback:
  → Trigger rollback.yml workflow manually
```

**Trigger 3: Conversion Metric Drop**
```
GA conversion rate drops >50% from baseline
↓
UptimeRobot alert + Sentry possible error spike
↓
On-call investigates:
  - All pages loading? → check GA instrumentation
  - Pages not loading? → check health checks
  - Forms not submitting? → check CRM API integration
↓
Decision: rollback vs. hotfix
```

### Manual Rollback Decision Tree

```
Production issue detected
↓
Severity Assessment:
├─ CRITICAL (all users affected, no conversion possible)
│  └─ IMMEDIATE ROLLBACK
├─ HIGH (feature broken, but workaround available)
│  ├─ Is fix ready? (tested, reviewed, <30 min)
│  │  ├─ Yes → Deploy fix (faster than rollback + revert)
│  │  └─ No → ROLLBACK
│  └─ Is issue isolated to new code?
│     ├─ Yes → ROLLBACK
│     └─ No → Investigate + Fix
└─ MEDIUM (partial impact, users can still convert)
   └─ Monitor and fix (no rollback needed)
```

### Rollback Execution (Manual)

**Step 1: Decision & Authorization**
- On-call engineer identifies rollback trigger
- On-call notifies Program Lead or Frontend Lead (approval)
- Approver confirms: "Yes, rollback approved"

**Step 2: Trigger Rollback**
- On-call goes to GitHub Actions → Rollback workflow
- Click "Run workflow"
- Select environment: Production
- Select target SHA: Previous successful (default), or specify
- Enter reason: (from predefined list or custom)
- Submit

**Step 3: Verify Rollback**
- Workflow deploys previous version
- Health checks run (verify pages load, no errors)
- Workflow log shows: "✅ PASSED" or "❌ FAILED"

**Step 4: Validate in Production**
- Open production URL in browser
- Test critical conversion paths manually
- Check Sentry: error rate drops?
- Check GA: conversion events resume?

**Step 5: Incident Documentation**
- Workflow automatically creates incident issue
- On-call writes incident summary:
  - What failed
  - When detected
  - Rollback decision time
  - Rollback completion time
  - Root cause (TBD in post-mortem)

**Step 6: Post-Mortem (Within 24 hours)**
- Schedule post-mortem with:
  - On-call engineer (incident responder)
  - Frontend Lead (engineering)
  - Platform Owner (infrastructure)
  - QA Owner (testing/validation)
- Document:
  - Root cause
  - How it passed QA/staging
  - Detection time (how long was issue live?)
  - Corrective actions (process/code changes to prevent recurrence)
  - Action items and owners

---

## Rollback Limits and Constraints

### What We Can Rollback

- ✅ Code changes (HTML/CSS/JS)
- ✅ Configuration changes (environment variables)
- ✅ Design changes (CSS)
- ✅ Template updates

### What We Can't Rollback (Must Fix Forward)

- ❌ Database schema changes (can't downgrade database)
- ❌ Data deletions (can't resurrect deleted data)
- ❌ API contract changes (if backend changed incompatibly)

**Mitigation:** All database and API changes must be backward-compatible to support gradual rollout.

---

## Testing and Drills

### Rollback Drill Schedule

**Monthly drill:** First Tuesday of month at 10 AM ET

**Drill Procedure:**
1. Pick a random commit from history (not latest)
2. Trigger rollback.yml manually with that commit
3. Verify rollback completes in <5 minutes
4. Verify health checks pass on rolled-back version
5. Verify incident issue created
6. Document drill results in `qa/ROLLBACK-DRILL-EVIDENCE.md`

**Drill Checklist:**
- [ ] Rollback triggered successfully
- [ ] Previous version deployed
- [ ] Health checks passed
- [ ] Production URL loads correctly
- [ ] Pages render without errors
- [ ] Rollback completion time: ___ minutes
- [ ] Incident issue created: [link]
- [ ] Operator name: ___
- [ ] Date/Time: ___

### Drill Failure Response

If drill fails (health checks don't pass, previous version won't deploy):
1. Immediately escalate to Platform Owner
2. Document failure in incident issue
3. Root cause analysis (why didn't rollback work?)
4. Fix root cause within 48 hours
5. Re-run drill after fix to verify
6. Update this runbook if procedure needs adjustment

---

## Deployment Approval Gates

### Gate D2: Rollback Testing

**Required Evidence:**
- [ ] At least one successful staging rollback drill completed
- [ ] Rollback measured to complete in <5 minutes
- [ ] Runbook documented with decision tree
- [ ] On-call engineer trained and certified
- [ ] Drill results documented with timestamps and operator

**Status for Issue #4:** Evidence will be generated during Phase 3 implementation

---

## Rollback Ownership and Escalation

| Situation | Trigger | Decision Maker | Executor | Notification |
|---|---|---|---|---|
| Health check fail (post-deploy) | Automatic | N/A | GitHub Actions | Slack alert to #production-alerts |
| Sentry spike >50/min | Manual trigger | On-call | On-call (via rollback.yml) | Slack alert + email to on-call |
| Conversion drop >50% | Manual investigation | Program Lead | On-call (after approval) | Program Lead → Stakeholders |
| Security issue detected | Manual | Platform Owner | Platform Owner | Program Lead → Legal (if needed) |
| On-call unavailable | Manual | Program Lead | Backup on-call | Escalation list |

---

## Verification

- ✅ Rollback workflow (`rollback.yml`) tested and verified working
- ✅ Health checks implemented in deploy workflow
- ✅ Sentry error spike thresholds configured (>50/min = auto-trigger)
- ✅ Monthly rollback drill scheduled and documented
- ✅ First rollback drill completed with <5 min completion time
- ✅ Incident response template created and shared with team
- ✅ On-call escalation path documented and communicated

---

## Review and Approval

**Proposed:** 2026-05-06  
**Approved:** [Platform Owner + Frontend Lead signature]  
**Drill Schedule Start:** 2026-06-03 (first Tuesday of June)

---

## Related Decisions

- **ADR-0002:** Hosting Platform Selection (Vercel)
- **ADR-0003:** Monitoring and Alerting Stack (Sentry spike triggers)
- **D-010:** Rollback Decision Authority and Approval Gates
- **D-011:** On-Call and Incident Response SLAs

---

## References

- [Vercel Deployments Documentation](https://vercel.com/docs/deployments/rollback)
- [Deployment Runbook](../DEPLOYMENT-RUNBOOK.md)
- [Incident Response Runbook](../INCIDENT-RESPONSE-RUNBOOK.md)
- [Rollback Workflow](../../.github/workflows/rollback.yml)
