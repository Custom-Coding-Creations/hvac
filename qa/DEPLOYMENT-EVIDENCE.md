# Deployment Evidence Documentation

**Version:** 1.0  
**Purpose:** Record and verify all production deployments for traceability and rollback recovery  
**Owner:** Platform Owner + Frontend Lead  
**Last Updated:** 2026-05-06  

---

## Overview

This document serves as a deployment log and evidence record. Every production deployment must be logged here with verification evidence.

**Uses:**
- Rollback target identification (which commit was last good?)
- Incident investigation (when did this version go live?)
- Audit trail (who deployed what and when?)
- SLA verification (how long did deployment take?)

---

## Deployment Log

### Deployment #1: [FIRST DEPLOYMENT - Template]

**Timestamp:** 2026-05-XX 14:32:00 UTC  
**Commit SHA:** abc123def456...  
**Commit Message:** "Release: Initial production deployment"  
**Deployed By:** [name of engineer]  
**Approval Gate:** Frontend Lead ([name]) approved at 14:30 UTC  

**Staging Verification:**
- [ ] Staging deployment successful
- [ ] Smoke tests passed (pages load, CTAs work)
- [ ] Manual QA sign-off in staging
- [ ] No known issues blocking production

**Production Verification:**
- [ ] Production deployment completed (14:32 UTC)
- [ ] Health checks passed (✅ 3 checks successful)
- [ ] Website loads: https://hvac-app.vercel.app/ ✅
- [ ] CSS/JS loaded (page styled and interactive) ✅
- [ ] Test critical CTA button (works) ✅
- [ ] No console errors ✅
- [ ] Sentry error rate normal ✅
- [ ] GA4 real-time shows page views ✅
- [ ] UptimeRobot shows "UP" ✅

**Post-Deployment Monitoring (30 min):**
- [ ] Error rate: 0 errors (baseline)
- [ ] Conversion rate: [baseline] (normal)
- [ ] Uptime: 100% (no downtime)
- [ ] Customer support: 0 reported issues

**Deployment Duration:** 5 minutes (staging) + 2 minutes (production) = 7 minutes total  
**Issue Found:** No issues  
**Rollback Needed:** No  

**Sign-Off:**
- Frontend Lead: ✅ [name]
- Platform Owner: ✅ [name]
- Deployed Successfully: ✅

---

## Deployment Summary Statistics

### Monthly Deployment Metrics

| Metric | Target | Actual | Status |
|---|---|---|---|
| **Total Deployments** | N/A | [count] | ✅ |
| **Successful Deployments** | 100% | [%] | ✅ |
| **Rollbacks Needed** | <5% | [%] | ✅ or ⚠️ |
| **Avg Deploy Duration** | <10 min | [min] | ✅ |
| **Avg MTTD** (detection) | <5 min | [min] | ✅ |
| **Avg MTTA** (acknowledge) | <15 min | [min] | ✅ |
| **Avg MTTR** (resolve) | <1 hour | [min] | ✅ |
| **Critical Incidents** | 0 | [count] | ✅ or 🚨 |
| **Customer Impact Incidents** | 0 | [count] | ✅ or 🚨 |

---

## Rollback Evidence Log

### Rollback #1: [Template]

**Trigger:** Production health checks failed, deployment broke form submission  
**Triggered At:** 2026-05-XX 15:45:00 UTC  
**Issue Detected:** Health checks show 5xx errors  

**Rollback Execution:**
- [ ] Rollback workflow triggered (GitHub Actions)
- [ ] Target commit: previous successful ([SHA])
- [ ] Rollback started: 15:45 UTC
- [ ] Rollback completed: 15:47 UTC (2 minutes)
- [ ] Health checks re-ran: ✅ PASSED

**Production Recovery:**
- [ ] Website loads: https://hvac-app.vercel.app/ ✅
- [ ] Critical features working (forms submit) ✅
- [ ] Error rate dropping in Sentry ✅
- [ ] UptimeRobot shows "UP" ✅

**Duration Metrics:**
- Issue detection: [timestamp]
- Rollback completion: [timestamp]
- **Rollback duration: ~2 minutes**
- **Total downtime: ~3-5 minutes** (detection lag + rollback)

**Rollback Operator:** [name]  
**Incident Issue:** [GitHub issue link]  
**Post-Mortem Scheduled:** [date/time]

---

## Staging Deployment Evidence

**Purpose:** Verify all deployments work in staging before production gate

### Staging Deployment Verification

**Date:** [deployment date]  
**Commit:** [SHA]  
**Staging URL:** https://staging-hvac.vercel.app

**Pre-Staging Checks:**
- [ ] CI pipeline passed (all checks green)
- [ ] Code reviewed and approved
- [ ] No known blockers

**Staging Deployment:**
- [ ] Deployment initiated: [timestamp]
- [ ] Deployment completed: [timestamp]
- [ ] **Deployment time: [X] minutes**

**Post-Staging Verification:**
- [ ] Website loads (no 404 or 500 errors) ✅
- [ ] CSS/JS loaded (page styled correctly) ✅
- [ ] No console errors ✅

**Manual QA Testing:**
- [ ] Homepage CTA buttons work ✅
- [ ] Form submission works ✅
- [ ] Mobile layout displays correctly ✅
- [ ] Accessibility check (keyboard nav, screen reader) ✅

**Staged for Production Gate:** ✅ Ready

---

## Deployment Approval Record

### Production Deployment Approval

**Deployment:** [commit SHA]  
**Time:** 2026-05-XX 14:00 UTC  

**Approver:** [name]  
**Role:** Frontend Lead  
**Approval Method:** Clicked "Approve and deploy" in GitHub UI  
**Approval Time:** 2026-05-XX 14:00:00 UTC  

**Pre-Approval Verification:**
- [ ] Staging deployment successful
- [ ] Manual QA sign-off in staging
- [ ] No High/Critical risks unresolved
- [ ] No deployment conflicts
- [ ] Ready for production gate

**Approval Justification:**  
"Staging validation complete, ready for production. All QA checks passed."

---

## Evidence Retention and Archival

### Retention Policy

- **Active Deployments (Current Month):** Keep in this document with full details
- **Past Deployments (1-3 Months):** Archive to `deployment-logs/` directory with summary
- **Old Deployments (>3 Months):** Keep summary only, detailed logs deleted

### Archival Procedure

**Monthly (on first of month):**
1. Create directory: `deployment-logs/2026-05-archive/`
2. Export this month's deployments as JSON/CSV
3. Create summary report (total deployments, average metrics)
4. Keep summary in main document, move detailed logs to archive

**Vercel Deployment History:**
- Vercel keeps deployment history indefinitely (visible in Vercel dashboard)
- GitHub Actions logs kept for 90 days (visible in GitHub)
- This document is the human-readable record for easy reference

---

## Troubleshooting: Finding Deployment Records

### "I need to know which commit is currently live"

1. Go to Vercel dashboard: https://vercel.com/dashboard
2. Select HVAC Production project
3. Look at "Deployments" tab
4. First deployment in list: "Ready" status = currently live commit

### "I need to find a specific deployment date"

1. Use GitHub search: https://github.com/Custom-Coding-Creations/hvac/actions
2. Filter by workflow: "Deploy to Staging and Production"
3. Sort by date
4. Find the deployment run for that date

### "I need to rollback to a specific commit"

1. Find the deployment evidence record above (what date/commit?)
2. Note the commit SHA
3. Go to GitHub → Actions → Rollback Deployment workflow
4. Enter target SHA
5. Trigger rollback

---

## Evidence Checklists (For Copy-Paste)

### Pre-Production Deployment Checklist

```markdown
## Pre-Production Deployment Verification

Deployment Date: [date]
Commit SHA: [sha]
Deployer: [name]

### Staging Verification
- [ ] Staging deployment successful (check workflow)
- [ ] Staging smoke tests passed
- [ ] Manual QA completed (forms, CTAs, mobile)
- [ ] No console errors in staging

### Production Approval
- [ ] Frontend Lead approval received (time: __)
- [ ] No High/Critical risks unresolved
- [ ] Approval reason: [brief justification]

### Ready for Production
- [ ] All checks above completed ✅
- [ ] Time to deploy to production: [timestamp]
```

### Post-Production Deployment Checklist

```markdown
## Post-Production Deployment Verification

Deployment Date: [date]
Commit SHA: [sha]
Deployer: [name]

### Immediate Checks (5 min)
- [ ] Website loads: https://hvac-app.vercel.app/ ✅
- [ ] CSS/JS loaded (styled + interactive) ✅
- [ ] No console errors ✅
- [ ] Critical CTA button works ✅

### Extended Checks (30 min)
- [ ] Sentry: error rate normal (no spike) ✅
- [ ] GA4: real-time shows conversions ✅
- [ ] UptimeRobot: all monitors "UP" ✅
- [ ] Support team: no reported issues ✅

### Verified and Logged
- [ ] Evidence recorded in deployment log
- [ ] All checks passed ✅
- [ ] Deployment successful
```

---

## Deployment Metrics Dashboard (Manual Update)

**Instructions:** Update monthly with actual metrics from deployment logs above

### Q1 2026 Deployment Report

| Month | Deployments | Success Rate | Rollbacks | Avg Duration | Critical Incidents |
|---|---|---|---|---|---|
| **May 2026** | [count] | [%] | [count] | [time] | [count] |
| **June 2026** | [count] | [%] | [count] | [time] | [count] |
| **July 2026** | [count] | [%] | [count] | [time] | [count] |

---

## Related Documentation

- [Deployment Runbook](DEPLOYMENT-RUNBOOK.md) — How to execute deployments
- [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md) — Rollback procedures
- [CI/CD Workflow](CICD-WORKFLOW.md) — Pipeline overview
- [Go/No-Go Criteria](GO-NO-GO-CRITERIA.md) — Deployment gates

---

## Document Control

**Version:** 1.0  
**Created:** 2026-05-06  
**Last Updated:** 2026-05-06  
**Next Review:** 2026-06-06 (after first production deployment)

**Questions?** Create GitHub issue with label `deployment-evidence-feedback`
