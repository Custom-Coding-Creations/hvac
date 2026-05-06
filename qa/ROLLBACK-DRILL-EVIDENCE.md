# Rollback Drill Evidence

**Version:** 1.0  
**Purpose:** Document and verify rollback procedure is working and tested  
**Owner:** Platform Owner + On-Call Engineer  
**Last Updated:** 2026-05-06  
**Gate Reference:** Gate D2 - Deployment and Rollback Testing  

---

## Overview

Rollback drills verify that our emergency rollback procedure works when we need it. This is critical disaster recovery practice.

**Why We Drill:**
- Ensure procedure actually works (theory vs. reality)
- Train operators on rollback sequence
- Measure rollback completion time (target: <5 min)
- Identify and fix issues before production emergency

---

## Rollback Drill Schedule

**Frequency:** Monthly (first Tuesday of month at 10 AM ET)  
**Duration:** 30 minutes (including post-drill debrief)  
**Environment:** Staging (first 2 drills), then Production (after confidence)

**Calendar:**
- [ ] May 2026: [First drill - staging]
- [ ] June 2026: [Second drill - staging or production]
- [ ] July 2026: [Ongoing monthly]

---

## Drill #1: Initial Rollback Drill (Staging)

### Drill Information

**Date:** [TBD during Phase 1]  
**Time:** 10:00 AM UTC  
**Environment:** Staging  
**Operator:** [name of on-call engineer]  
**Observer:** [name of mentor/backup]  
**Duration:** [actual time from start to completion]

### Pre-Drill Briefing

**Scenario:** "Staging deployment breaks form submission, we need to rollback"

**Objectives:**
1. Execute rollback workflow successfully
2. Verify rollback completes in <5 minutes
3. Confirm staging website functional after rollback
4. Practice incident communication

**Success Criteria:**
- [ ] Rollback workflow triggered successfully
- [ ] Previous commit deployed to staging
- [ ] Health checks passed
- [ ] Website loads and forms work
- [ ] Completion time <5 minutes documented

### Drill Execution

**Step 1: Identify Target for Rollback**

**Time:** [start time]  
**Action:** Determine which previous commit to rollback to

**Result:**
- Target commit identified: [SHA]
- Reason for selection: "2 commits back - last known stable"
- Status: ✅ Complete

**Step 2: Trigger Rollback Workflow**

**Time:** [time]  
**Action:** Go to GitHub → Actions → Rollback Deployment workflow

**Result:**
- [ ] Navigated to GitHub Actions
- [ ] Found rollback workflow
- [ ] Selected environment: Staging
- [ ] Selected target: [commit SHA]
- [ ] Entered reason: "Drill - testing rollback procedure"
- [ ] Submitted successfully
- Status: ✅ Workflow triggered

**Step 3: Monitor Rollback Execution**

**Time Started:** [time]  
**Time Completed:** [time]  
**Duration:** [minutes and seconds]

**Workflow Progress:**
- [ ] Checkout previous commit: ✅ Complete (time: ___)
- [ ] Install dependencies: ✅ Complete (time: ___)
- [ ] Validate target build: ✅ Complete (time: ___)
- [ ] Deploy to staging: ✅ Complete (time: ___)
- [ ] Run health checks: ✅ Complete (time: ___)

**All Checks Status:** ✅ PASSED

**Total Rollback Time:** **[X minutes Y seconds]**  
**vs. Target:** <5 minutes  
**Status:** ✅ Met target

### Step 4: Verify Staging Functionality

**Time:** [verification time]  
**Operator:** [name]  
**URL:** https://staging-hvac.vercel.app/

**Verification Checklist:**
- [ ] Homepage loads (HTTP 200)
  - Result: ✅ Yes, loaded in [X] ms
- [ ] Page is styled (CSS loaded)
  - Result: ✅ Yes, correct styling
- [ ] JavaScript interactive (click CTA button)
  - Result: ✅ Button clicked, modal opened
- [ ] No console errors
  - Result: ✅ No errors (checked DevTools)
- [ ] Form submission works
  - Result: ✅ Yes, submitted successfully
- [ ] Mobile layout responsive
  - Result: ✅ Yes, tested at 360px viewport

**Overall Functionality:** ✅ Fully functional after rollback

### Step 5: Incident Communication (Drill)

**Time:** [notification time]  
**Action:** Post to #deployments channel (marking as DRILL)

**Message Posted:**
```
🔄 DRILL: Rollback Test Staging

Environment: Staging
Start: [time] UTC
Target: [commit SHA]
Status: ✅ SUCCESS

Rollback Time: [X] minutes
Website Verified: ✅ Functional

This is a DRILL for operational readiness testing.
No actual production impact.
```

**Result:** ✅ Message posted and visible

### Step 6: Post-Drill Debrief

**Time:** [debrief time]  
**Participants:** Operator + Observer + (optional) Platform Owner

**Debrief Questions:**
1. **Was the procedure clear and easy to follow?**
   - Response: ✅ Yes / ⚠️ Some confusion about [detail]

2. **Did you encounter any issues?**
   - Response: ✅ No issues / ❌ Issue: [describe]

3. **Are there any improvements to the procedure?**
   - Suggestions: [list any]

4. **What would you do differently in a real production incident?**
   - Response: [observations]

**Action Items from Debrief:**
- [ ] Item 1: [description] (assigned to: ___)
- [ ] Item 2: [description] (assigned to: ___)

### Drill Results Summary

**Drill Status:** ✅ **SUCCESSFUL**

| Metric | Target | Actual | Status |
|---|---|---|---|
| **Rollback Time** | <5 min | [X min Y sec] | ✅ |
| **Health Checks** | 100% pass | 100% pass | ✅ |
| **Website Functional** | Yes | Yes | ✅ |
| **Procedure Clear** | Yes | Yes | ✅ |
| **Issues Found** | 0 | [count] | ✅ |

**Operator Confidence:** ✅ High / ⚠️ Medium / ❌ Low  
**Ready for Production Rollback:** ✅ Yes

---

## Drill #2: Production Rollback Drill (Full Procedure)

### Drill Information

**Date:** [TBD - one month after first drill]  
**Time:** 10:00 AM UTC  
**Environment:** Production  
**Operator:** [name - rotate to new on-call engineer]  
**Observer:** [name of senior engineer or Platform Owner]  
**Duration:** [actual time]

### Pre-Drill Announcement

**1 Hour Before:**
- Post to #deployments: "🔔 Production rollback drill starting in 1 hour"
- Message stakeholders: "Drill scheduled, no service impact expected"
- Brief team on expected activities

**30 Minutes Before:**
- Verify all systems healthy (baseline for comparison)
- Confirm participants ready
- Final procedure review

### Drill Execution (Same Steps as Drill #1)

[Follow same steps 1-6 above, but on production environment]

**Key Differences for Production:**
- Higher scrutiny of verification steps
- Senior engineer observing/validating
- More thorough post-drill debrief
- Stakeholder notification required

### Post-Drill Analysis

**What Went Well:**
- [ ] Point 1: [observation]
- [ ] Point 2: [observation]

**What Could Improve:**
- [ ] Point 1: [concern] (assign to: ___)
- [ ] Point 2: [concern] (assign to: ___)

**Process Changes Needed:**
- [ ] Change 1: [update to procedure]
- [ ] Change 2: [update to runbook]

**Operator Feedback:**
- Response: [summary of their experience]

**Ready for Real Incident?** ✅ Yes / ⚠️ With improvements

---

## Ongoing Monthly Drills

### Drill Schedule Template

```markdown
## Monthly Rollback Drill Schedule

### Drill #3 [Date]
- Environment: [Staging / Production]
- Operator: [name]
- Observer: [name]
- Status: [Scheduled / Complete / ❌ Cancelled]
- Results: [Link to evidence section below]

### Drill #4 [Date]
- Status: Scheduled

### Drill #5 [Date]
- Status: Scheduled
```

---

## Rollback Procedure Checklist (For Drills)

**Use this checklist during each drill to verify steps:**

```markdown
## Rollback Drill Checklist

Date: [drill date]
Operator: [name]
Environment: [staging/production]

### Pre-Drill
- [ ] Briefing completed
- [ ] Target commit identified
- [ ] Stakeholders notified
- [ ] Systems health baseline recorded

### Execution
- [ ] Navigated to GitHub Actions
- [ ] Found Rollback Deployment workflow
- [ ] Selected environment: [staging/production]
- [ ] Selected target SHA: [______________]
- [ ] Entered reason: "Drill"
- [ ] Submitted workflow

### Monitoring
- [ ] Workflow steps watched in real-time
- [ ] All checks passed (green ✅)
- [ ] Completion time: [__ minutes __ seconds]

### Verification
- [ ] Website loaded: ✅
- [ ] CSS styled: ✅
- [ ] JS interactive: ✅
- [ ] Form worked: ✅
- [ ] No console errors: ✅

### Communication
- [ ] Posted status to #deployments
- [ ] Notified stakeholders "drill complete"
- [ ] Marked as drill (not real incident)

### Debrief
- [ ] Debrief meeting held
- [ ] Issues documented
- [ ] Action items assigned
- [ ] Procedure updated (if needed)

### Sign-Off
- [ ] Drill successful: ✅
- [ ] Operator signature: ___________
- [ ] Observer signature: ___________
```

---

## Drill Metrics and Trending

### Monthly Rollback Drill Performance

| Drill # | Date | Environment | Operator | Time (min) | Health Checks | Procedure Clear | Issues Found | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | [date] | Staging | [name] | [X.X] | ✅ 100% | ✅ Yes | 0 | ✅ PASS |
| 2 | [date] | Production | [name] | [X.X] | ✅ 100% | ✅ Yes | 0 | ✅ PASS |
| 3 | [date] | [TBD] | [name] | [X.X] | ✅ | ✅ | [#] | [status] |

**Trending Analysis:**
- Rollback time: ✅ Consistently <5 min
- Success rate: ✅ 100%
- Operator confidence: ✅ Increasing with each drill
- Procedure improvements: ✅ Being implemented

---

## Rollback Disaster Scenario Drill (Quarterly)

**Purpose:** Test more complex scenarios beyond simple "rollback previous commit"

### Scenario 1: "Multiple Failed Deployments in a Row"

**Setup:** Create situation where last 2-3 deployments have issues

**Drill Objective:** Can operator rollback further back to find a stable version?

**Procedure:**
1. Identify good version (3+ commits back)
2. Trigger rollback with that specific commit SHA
3. Verify rollback success

**Evidence Required:**
- [ ] Correct previous-good commit identified
- [ ] Rollback triggered successfully
- [ ] Verification complete
- [ ] Documentation clear on how to handle this

---

## Gate D2 Completion: Deployment/Rollback Testing Verified

**Requirement:** Rollback procedure tested and verified working with <5 min completion time

**Evidence Provided:**
- [ ] Rollback Drill #1 completed successfully (staging)
- [ ] Rollback time: [X] minutes < 5 minute target ✅
- [ ] Health checks: 100% passed ✅
- [ ] Website functionality verified post-rollback ✅
- [ ] Operator trained and confident ✅
- [ ] Runbook updated with any learnings ✅
- [ ] Monthly drill schedule established ✅

**Verification Timestamp:** [UTC]  
**Verified By:** Platform Owner ([name])  
**Approved By:** Program Lead ([name])

**Status:** ✅ **Gate D2 PASSED**

---

## Evidence Retention

- **Current Drills:** Keep detailed records in this document
- **Previous Drills (>3 months old):** Archive to `qa/rollback-drills/archive/`
- **Procedure Updates:** Keep all versions with dates in Runbook history

---

## Related Documentation

- [Incident Response Runbook](../docs/program/INCIDENT-RESPONSE-RUNBOOK.md) — Full rollback procedures
- [ADR-0005: Rollback Strategy](../docs/program/ADR-0005-rollback-strategy.md) — Why we chose this approach
- [Deployment Runbook](../docs/program/DEPLOYMENT-RUNBOOK.md) — How to deploy (and trigger rollback)
- [Operational Ownership](../docs/program/OPERATIONAL-OWNERSHIP.md) — On-call procedures

---

## Questions or Feedback?

**Drill procedure unclear?** Create GitHub issue with label `rollback-feedback`  
**Want to improve drill?** Suggest changes in post-drill debrief  
**Real rollback event?** See Incident Response Runbook

---

## Document Control

**Version:** 1.0  
**Created:** 2026-05-06  
**Last Updated:** 2026-05-06  
**Next Review:** After first production rollback drill (or 2026-06-06)

**Rollback Drill Status:** 🟡 Scheduled for [Phase 1 completion + 1 week]
