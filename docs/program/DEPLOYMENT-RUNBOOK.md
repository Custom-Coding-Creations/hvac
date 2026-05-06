# Deployment Runbook

**Version:** 1.0  
**Owner:** Platform Owner + Frontend Lead  
**Last Updated:** 2026-05-06  
**Audience:** Developers, DevOps, On-Call Engineer  

---

## Overview

This runbook provides step-by-step procedures for deploying code to staging and production environments. It covers:
- Pre-deployment checklist
- Deployment execution
- Rollback procedures (full details in [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md))

**Key SLA:** Deployment to staging: <5 min. Deployment to production (after approval): <10 min.

---

## Pre-Deployment Checklist (Before Merging to Main)

### 1. Code Changes Validation
- [ ] **No hardcoded secrets:** Run `grep -r "api.key\|password\|token" frontend/` (should return nothing)
- [ ] **No console.log in production code:** Verify `assets/js/system.js` has no debug output
- [ ] **All templates valid:** Run `npm run validate:templates` (should pass)
- [ ] **No breaking changes to environment variables:** Compare current `.env` vars with code expectations

### 2. CI Pipeline Passes
- [ ] **GitHub Actions CI passes:** All checks green on pull request
  - ✅ Lint checks passed
  - ✅ TypeCheck passed
  - ✅ Build passed
  - ✅ Tests passed
  - ✅ Structure validation passed
  - ✅ HTML templates valid
  - ✅ CSS valid
  - ✅ No hardcoded secrets detected
- [ ] **No merge conflicts:** Code cleanly merges into main

### 3. Testing in Staging
- [ ] **Manual QA in staging:** Test critical conversion paths
  - [ ] Homepage loads and displays correctly
  - [ ] Service pages load and display correctly
  - [ ] Location pages load and display correctly
  - [ ] Emergency landing page loads
  - [ ] All CTA buttons functional (not just styling)
  - [ ] Forms submit successfully (to staging CRM endpoint)
  - [ ] Analytics events firing (check GA4 in staging property)
- [ ] **Accessibility spot-check:** Tab navigation works, screen reader readable (optional deep audit per [QA procedures](../../qa/ACCESSIBILITY-RESPONSIVE-QA.md))
- [ ] **Mobile responsiveness:** Test on phone/tablet breakpoints (360px, 768px, 1024px)

### 4. Stakeholder Sign-Off (for Production Deployments Only)
- [ ] **Frontend Lead approval:** Code quality, design implementation reviewed
- [ ] **Program Sponsor notification:** Informed of deployment timing
- [ ] **QA Owner confirmation:** Testing complete, known issues documented
- [ ] **No unresolved High/Critical risks:** Check [Risk Register](RISK-REGISTER.md)

---

## Deployment Procedure: Automated (Main Branch)

### How Deployments Trigger Automatically

```
Developer merges PR to main
    ↓
GitHub Actions `deploy.yml` workflow triggers automatically
    ↓
[STAGE 1] Deploy to Staging (immediate)
    - Install dependencies
    - Run full CI validation suite
    - Push to Vercel Staging environment
    - Run smoke tests
    ↓
[PAUSE] Manual Approval Gate (waits for human)
    - Platform Owner or Frontend Lead reviews staging
    - If issues: abort, notify developer
    - If OK: click "Approve" in GitHub
    ↓
[STAGE 2] Deploy to Production (after approval)
    - Install dependencies
    - Run CI validation suite
    - Push to Vercel Production environment
    - Run production health checks
    ↓
[RESULT]
    - If health checks pass: ✅ SUCCESS, deployment logged
    - If health checks fail: ❌ FAILURE, auto-rollback triggered
```

### What You See in GitHub UI

1. **Workflow tab:** Shows deploy.yml running (staging step active)
2. **Within 2-3 minutes:** Staging deployment completes, workflow pauses
3. **Approval step appears:** "Wait for approval" step shows manual gate
4. **Click "Review deployments":** Select staging to review changes
5. **Click "Approve and deploy":** Triggers production deployment
6. **Production deployment begins:** Workflow resumes
7. **Within 5 minutes total:** Production deployment completes or auto-rolls-back

---

## Deployment Procedure: Manual (Emergency Hotfix)

### When to Use Manual Deployment

- **Production hotfix needed urgently** (can't wait for main branch gate)
- **Staging issue found** (redeploy staging without pushing to main)

### Manual Deployment Steps

1. **Prepare the fix**
   - Fix applied to local branch
   - All CI checks pass locally: `npm run validate`
   - Manual testing in local browser (or staging environment)

2. **Trigger manual deployment**
   - Go to GitHub repository → Actions tab
   - Select `Deploy to Staging and Production` workflow
   - Click "Run workflow" button
   - Select branch: (default is main, change if needed)
   - Select environment: `staging` (default) or `production`
   - Click "Run workflow"

3. **Monitor deployment**
   - Watch workflow logs in real-time
   - Check status of each step
   - Verify smoke tests pass

4. **Verify deployed changes**
   - Open staging or production URL
   - Test manually: does the fix work?
   - Check Sentry: any errors introduced?

5. **Notify team**
   - Post to #deployments channel: "Manual hotfix deployed to [environment]"
   - Link to GitHub Actions run
   - Describe what was fixed

---

## Deployment Monitoring During Rollout

### What to Monitor During Staging Deployment (0-3 min)

- [ ] GitHub Actions workflow shows "Deploy to Staging" step active (running, not failed)
- [ ] No red X marks (failures) appear in workflow

### What to Monitor During Production Deployment (3-8 min after approval)

**Go-live timing:**
- Deploy starts → app goes live at new commit → old code no longer active
- **Window:** 30 seconds to 1 minute for propagation through Vercel CDN

**What to check:**
- [ ] GitHub Actions "Deploy to Production" step shows running
- [ ] Within 3 minutes: health checks running
- [ ] Health checks return ✅ PASSED (or ❌ FAILED if auto-rollback triggered)

### Health Check Details

**What's Being Checked:**
```
1. HTTP 200 on production URL: https://hvac-app.vercel.app/
2. Page structure valid: <html>, <title>, <main> tags present
3. No 5xx server errors in response headers
4. Response time < 2 seconds
```

**If Health Checks Fail:**
- ✅ Automatic rollback triggers (previous version deployed)
- ✅ Incident issue created automatically
- ✅ Slack alert: "#production-alerts" channel
- ✅ Email alert to on-call engineer
- → See [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md)

---

## Post-Deployment Verification

### Immediate (Within 5 minutes of deployment)

1. **Staging Deployment Check**
   - [ ] Open https://staging-hvac.vercel.app/ in browser
   - [ ] Page loads, no 404 or 500 errors
   - [ ] CSS loads (page styled correctly, not plain HTML)
   - [ ] JavaScript loads (interactive elements respond to clicks)
   - [ ] No console errors visible (open DevTools: F12, check Console tab)

2. **Production Deployment Check** (after production push)
   - [ ] Open https://hvac-app.vercel.app/ in browser
   - [ ] Page loads, no 404 or 500 errors
   - [ ] CSS loads (page styled correctly)
   - [ ] JavaScript loads (interactive elements work)
   - [ ] No console errors

3. **Conversion Path Check** (manual test of critical flows)
   - [ ] Homepage → Click main CTA button → Form modal opens
   - [ ] Fill form → Submit → Form submission succeeds (check network tab)
   - [ ] Mobile view → Click mobile CTA button → Works correctly

4. **Analytics Verification** (check GA4)
   - [ ] Go to GA4 dashboard → Real-time report
   - [ ] See page views coming in (confirms instrumentation working)
   - [ ] See form submissions tracked (confirms conversion events firing)

### Short-term (5-30 minutes after production deployment)

1. **Error Tracking Check** (Sentry dashboard)
   - [ ] Open [Sentry project](https://sentry.io/organizations/hvac/)
   - [ ] Error count not spiking
   - [ ] No new error types appearing
   - [ ] If errors present: are they pre-existing or new?

2. **Uptime Check** (UptimeRobot dashboard)
   - [ ] UptimeRobot shows last check: "UP"
   - [ ] Response time: <500 ms
   - [ ] No recent alert history

3. **Conversion Metrics Check** (GA4 dashboard)
   - [ ] Conversion rate comparable to baseline (not dropped >50%)
   - [ ] Form submission events tracking
   - [ ] No unusual bounce rate spike

### Extended Monitoring (30 min - 1 hour after deployment)

- [ ] Sentry error dashboard: no spike or new errors
- [ ] UptimeRobot: consistent uptime checks passing
- [ ] GA4: conversion metrics trending normally
- [ ] No customer support tickets about broken website
- [ ] No Slack alerts about failures

---

## Deployment Rollback Procedure

**⚠️ CRITICAL: See [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md) for full rollback procedures**

**Quick Start (if issues found):**

1. **Assess severity**
   - Is website down? (HTTP 500) → **IMMEDIATE ROLLBACK**
   - Are forms broken? → **IMMEDIATE ROLLBACK**
   - Is page load time >5 sec? → **INVESTIGATE** (might be edge cache)
   - Are there errors but site still usable? → **MONITOR** (don't rollback)

2. **Trigger rollback** (if needed)
   - Go to GitHub → Actions → Select "Rollback Deployment" workflow
   - Click "Run workflow"
   - Select environment: Production
   - Select target SHA: Previous (default)
   - Select reason: (choose from list)
   - Click "Run workflow"

3. **Verify rollback success**
   - Workflow should complete in <5 minutes
   - Health checks should pass (green checkmarks)
   - Incident issue created automatically
   - Production URL should be back to working state

---

## Troubleshooting Common Deployment Issues

### Issue: Deployment Takes Longer Than Expected

**Symptoms:**
- Workflow stuck on "Installing dependencies" or "Running tests"
- No errors shown, just waiting

**Resolution:**
1. Check GitHub Actions runner status (might be queued behind other jobs)
2. Wait 5 additional minutes (sometimes network is slow)
3. If still stuck: cancel workflow, check GitHub status page for incidents
4. Retry deployment after 5 minutes

### Issue: Deployment Fails With "ENOENT: No Such File"

**Symptoms:**
- Workflow shows red X on "npm run validate" step
- Error message: "ENOENT: no such file or directory: ..."

**Resolution:**
1. Check file exists locally: `ls frontend/assets/js/system.js`
2. Verify no files were accidentally deleted
3. If file missing: restore from main branch, commit, push again
4. Retry deployment

### Issue: Health Checks Fail, Production Down After Deploy

**Symptoms:**
- Workflow runs successfully but health checks fail
- Automatic rollback triggers
- Production URL returns 500 or times out

**Resolution:**
1. ❌ **DO NOT** try to fix or re-deploy during incident
2. ✅ **DO** let auto-rollback complete (should be back to previous version within 1-2 min)
3. ✅ Follow [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md)
4. Post-incident: debug locally why code broke in production (often environment variable issue)

### Issue: Previous Deployment Logs Not Found

**Symptoms:**
- Can't find the deployment that worked previously
- Want to rollback but don't know which commit to target

**Resolution:**
1. Check Vercel dashboard → Deployments tab: shows deployment history
2. Look for last "READY" (✅) deployment before the failed one
3. Note the commit SHA from that deployment
4. Use that SHA when triggering manual rollback: `rollback.yml` with `target_sha=<commit>`

---

## Deployment Approval Authority

| Decision | Authority | SLA |
|---|---|---|
| **Approve staging → production** | Frontend Lead or Platform Owner | 15 min (fast-track), 1 hour (normal) |
| **Approve hotfix deploy** | Platform Owner (or Frontend Lead if PO unavailable) | 5 min (critical), 15 min (urgent) |
| **Approve rollback** | On-call engineer (solo authority for auto-rollback), Platform Owner (for manual hotfix rollback) | Immediate (auto), 5 min (manual) |
| **Escalate deployment issues** | Platform Owner → Program Lead | 15 min |

---

## Checklists for Copy-Paste

### Pre-Deployment Checklist (Copy to Deployment Issue)

```markdown
## Pre-Deployment Checklist

### Code Quality
- [ ] No hardcoded secrets in code
- [ ] No console.log() in production files
- [ ] All CI checks passing (GitHub Actions)
- [ ] Code reviewed and approved

### Testing
- [ ] Staging smoke tests passed
- [ ] Manual QA in staging completed
- [ ] No known regressions

### Approval
- [ ] Frontend Lead reviewed changes
- [ ] QA Owner confirmed testing complete
- [ ] Program Sponsor notified
- [ ] No High/Critical risks unresolved

Ready for production deployment: [Yes / No]
```

### Post-Deployment Verification Checklist

```markdown
## Post-Deployment Verification

Deployed at: [timestamp]
Deployed by: [name]
Commit SHA: [sha]

### Immediate Checks (5 min)
- [ ] Website loads (https://hvac-app.vercel.app/)
- [ ] CSS/JS loaded (page styled and interactive)
- [ ] No console errors
- [ ] Test critical CTA button (does it work?)

### Extended Checks (30 min)
- [ ] UptimeRobot shows "UP"
- [ ] Sentry shows no error spike
- [ ] GA4 shows normal conversion rate
- [ ] No customer support issues reported

Verification complete: ✅
```

---

## Related Documentation

- [CI/CD Workflow](CICD-WORKFLOW.md) — High-level CI/CD strategy
- [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md) — What to do when deployments fail
- [Monitoring and Alerts Runbook](MONITORING-AND-ALERTS-RUNBOOK.md) — How to interpret alerts
- [ADR-0002: Hosting Platform Selection](ADR-0002-hosting-platform-selection.md)
- [ADR-0005: Rollback Strategy](ADR-0005-rollback-strategy.md)

---

## Feedback and Improvements

Found an issue with this runbook? Have a suggestion? Create an issue with the label `runbook-feedback`.

Last reviewed: 2026-05-06  
Next review: 2026-06-06 (monthly)
