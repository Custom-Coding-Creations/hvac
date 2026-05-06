# Incident Response Runbook

**Version:** 1.0  
**Owner:** Program Lead + Platform Owner  
**Last Updated:** 2026-05-06  
**Audience:** On-Call Engineers, Engineering Team, Program Lead  

---

## Purpose

This runbook defines how we respond to production incidents with speed, clarity, and minimal customer impact.

**Key Principles:**
1. **Speed:** Faster response = less impact
2. **Clarity:** Everyone knows their role during incident
3. **Communication:** Stakeholders informed every step
4. **Blamelessness:** Focus on systems, not blame on individuals
5. **Learning:** Every incident improves our processes

---

## Incident Classification

### P1: Critical (Website Down or Broken)

**Definition:** Website completely inaccessible OR core conversion path completely broken

**Examples:**
- HTTP 500 errors on all pages
- Homepage doesn't load (404, 5xx timeout)
- Form submission completely broken (all forms fail)
- Analytics not recording conversions (revenue tracking lost)

**Response Time:** Immediate (<2 minutes)  
**Action:** **Automatic rollback or immediate hotfix**

### P2: High (Partial Degradation)

**Definition:** Significant feature broken but workaround exists OR widespread errors (>50% of users affected)

**Examples:**
- Specific CTA button not working (but other CTAs work)
- Mobile layout broken (desktop works)
- Error spike but <50% of users affected
- Performance degradation (>50% slower than baseline)

**Response Time:** Fast (<15 minutes)  
**Action:** Investigate, decide rollback vs. hotfix, execute fix

### P3: Medium (Minor Issue)

**Definition:** Limited impact OR affecting <10% of users

**Examples:**
- Typo on page (not broken, just wrong text)
- Non-critical tracking event not firing
- CSS animation glitchy but page still functional
- Single user reported issue

**Response Time:** Normal (<1 hour)  
**Action:** Log, investigate during next deployment window, fix in next release

### P4: Low (No Current Impact)

**Definition:** Future risk OR resolved on its own

**Examples:**
- Code security vulnerability (not exploited yet)
- Performance issue that doesn't affect users (e.g., internal logging slow)
- Test error that resolved itself

**Response Time:** Investigate during business hours  
**Action:** Log, schedule investigation, fix in normal development cycle

---

## Incident Response Flow

```
ALERT RECEIVED
    ↓
┌─────────────────────────────────────────┐
│ 1. INCIDENT COMMANDER ASSIGNED (1 min) │
│ • Identify: who is on-call?             │
│ • Notify: incident commander takes lead │
│ • Assess: is this real incident or FP? │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 2. SEVERITY ASSESSMENT (3 min)          │
│ • Classify: P1/P2/P3/P4                 │
│ • Identify: affected feature            │
│ • Estimate: impact scope                │
│ • Notify: stakeholders with severity    │
└─────────────────────────────────────────┘
    ↓
   P1?  ──→ [CRITICAL PATH]  ──→ Auto-rollback or immediate hotfix
    │                               (see P1 Response)
    ↓
   P2?  ──→ [INVESTIGATION]   ──→ Investigate, decide action
    │                               (see P2 Response)
    ↓
   P3?  ──→ [MONITORING]      ──→ Monitor, schedule fix
    │                               (see P3 Response)
    ↓
   P4?  ──→ [BACKLOG]         ──→ Log and track in backlog
                                    (no immediate action)
    ↓
┌─────────────────────────────────────────┐
│ 3. INCIDENT RESOLVED                    │
│ • Verify: issue fixed                   │
│ • Monitor: watch metrics for 30 min     │
│ • Document: incident summary            │
│ • Notify: stakeholders "resolved"       │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 4. POST-MORTEM (within 24 hours)       │
│ • Review: what happened                 │
│ • Understand: why it happened           │
│ • Prevent: how to prevent recurrence    │
│ • Action: assign improvements           │
└─────────────────────────────────────────┘
```

---

## P1 Critical Incident Response

### Incident Commander Role

**Who:** Whoever is on-call engineer at time of incident

**Responsibilities:**
1. Take command (you are now in charge until escalated)
2. Communicate status (keep stakeholders informed)
3. Make decisions (rollback or hotfix?)
4. Execute response (or delegate to team)
5. Verify resolution (confirm issue is fixed)

**Authority:** Full authority to make deployment decisions (rollback, hotfix, pause traffic)

**Escalation:** If uncertain, escalate to Platform Owner immediately

### P1 Response: Automatic Rollback Path

**Trigger:** Website down (HTTP 500/404 timeouts), healthchecks fail post-deploy

**Step 1: Confirm Rollback Decision (2 minutes)**
```
Automatic trigger:
- Health checks failed after deploy
- Production website not responding
- Sentry shows error spike >100 errors/min
```

**Decision Point:**
- "Is this a deployment issue?" → YES → **PROCEED TO ROLLBACK**
- "Is this an external service issue?" → NO → **SKIP ROLLBACK, ESCALATE**

**Step 2: Trigger Rollback Workflow (1 minute)**
```
1. Go to GitHub: https://github.com/Custom-Coding-Creations/hvac/actions
2. Click "Rollback Deployment" workflow
3. Select environment: Production
4. Select target SHA: (previous successful - default)
5. Select reason: "Production health checks failed - automatic rollback"
6. Click "Run workflow"
```

**Step 3: Monitor Rollback Execution (5 minutes)**
```
Watch workflow log for:
✅ Checkout previous commit
✅ Install dependencies
✅ Validate target build
✅ Deploy to production
✅ Health checks passed

If any step fails → ESCALATE TO PLATFORM OWNER IMMEDIATELY
```

**Step 4: Verify Production is Back Online (3 minutes)**
```
1. Open https://hvac-app.vercel.app/ in browser
2. Page loads, no errors?
3. Critical CTAs work (click button, form opens)?
4. Check Sentry dashboard: error rate dropping?
5. Check GA4 real-time: conversion events flowing?
```

**Step 5: Notify Stakeholders (immediately)**
```
Post to #deployments:
"🚨 INCIDENT: Production down at 14:32 UTC
✅ Automatic rollback completed at 14:36 UTC
🔍 Root cause: [deployment broke feature]
📝 Incident: [GitHub issue link]
⏰ Post-mortem: scheduled for [time]"
```

**Step 6: Document Incident (15 minutes after recovery)**
```
Auto-created incident issue should have:
- Timestamp of failure
- Timestamp of rollback completion
- Previous commit SHA (what we rolled back to)
- Current commit SHA (what caused issue)
- Rollback operator name

Add to incident:
- Root cause analysis (TBD in post-mortem)
- Customer impact assessment (did customers see it?)
- Timeline: detection time, investigation time, rollback time
```

---

### P1 Response: Hotfix Path (If Rollback Not Appropriate)

**When to Use Hotfix Instead of Rollback:**
- Issue is NOT in code (e.g., external API key expired)
- Rolling back would take longer than fixing
- Fix is trivial and low-risk (typo, config value)
- Rollback would cause other problems

**Step 1: Assess if Hotfix Feasible (3 minutes)**
```
Questions:
1. Do I know the root cause? (NO → rollback instead)
2. Is the fix simple (<5 line change)? (NO → rollback instead)
3. Can I test fix locally in <5 min? (NO → rollback instead)
4. Am I confident fix won't cause new issues? (NO → rollback instead)

If YES to all: proceed to hotfix
If NO to any: abort hotfix, proceed to rollback
```

**Step 2: Develop Hotfix Locally (5-10 minutes)**
```
1. Identify root cause (check error in Sentry)
2. Fix locally (edit file, test in browser)
3. Verify fix works (no new errors introduced)
```

**Step 3: Push Hotfix to Main (2 minutes)**
```
1. Commit fix with message: "HOTFIX: [specific issue description]"
2. Push to main branch
3. Deploy workflow automatically triggers
```

**Step 4: Verify Production (5 minutes)**
```
1. Watch deploy workflow for completion
2. Verify production loading correctly
3. Run manual test of broken feature
4. Check Sentry: error rate dropping?
5. Check GA4: conversion events back to normal?
```

**Step 5: Notify Stakeholders (immediately)**
```
Post to #deployments:
"✅ INCIDENT RESOLVED
Issue: [description]
Fix: [brief description of what changed]
Deployed at: [time]
Impact: ~[duration] minutes of degradation"
```

---

## P2 High Priority Incident Response

### Decision Tree: Rollback vs. Hotfix

```
P2 Incident detected
    ↓
Is core conversion path broken?
├─ Yes → ROLLBACK (safer than debugging)
├─ No: Investigate root cause
    ├─ Cause is in recent code change?
    │  ├─ Yes, simple fix (<5 min)? → HOTFIX
    │  ├─ Yes, complex fix (>5 min)? → ROLLBACK
    │  └─ No, root cause unclear? → INVESTIGATE → then decide
    └─ Cause is external (API down)?
       └─ Wait for service recovery (no rollback helps)
```

### Investigation Steps for P2 (15 minutes max)

**Step 1: Gather Facts (5 min)**
- When did issue start? (check timestamps)
- What exactly is broken? (screenshot/test manually)
- How many users affected? (Sentry shows user count)
- Is issue consistent or intermittent? (check error timeline)

**Step 2: Identify Root Cause (7 min)**
- Check recent deployments (when was most recent deploy?)
- Check error details (Sentry stack trace, error message)
- Check external services (are APIs responding?)
- Check environment (are configuration values correct?)

**Step 3: Decide Action (3 min)**
- [ ] Rollback (if cause unclear or complex fix needed)
- [ ] Hotfix (if cause clear and fix simple)
- [ ] Wait (if external service issue, no fix available)
- [ ] Escalate (if you're unsure)

### Executing P2 Response

If **Rollback Decided:**
→ Follow "P1 Automatic Rollback Path" (Steps 2-5 above)

If **Hotfix Decided:**
→ Follow "P1 Hotfix Path" (Steps 2-4 above)

If **Wait Decided:**
→ Monitor external service, post status updates, no further action

If **Escalate Needed:**
→ Contact Platform Owner (see [Operational Ownership](OPERATIONAL-OWNERSHIP.md))

---

## P3 Medium Priority Incident Response

### Response Process

1. **Acknowledge incident** (create Slack thread to track)
2. **Gather information** (what's broken, when, who's affected)
3. **Log in issue tracker** (create GitHub issue with label `priority-medium`)
4. **Monitor for escalation** (does issue get worse → escalate to P2)
5. **Schedule fix** (in next 1-2 deployments)

### Response SLA

- Acknowledge: <1 hour
- Investigate: within business hours
- Fix deployed: within 1-2 business days

### No Immediate Action Required

- ❌ Don't rollback for P3 (not worth the risk)
- ❌ Don't hotfix immediately (unless trivial)
- ✅ Do monitor for escalation (if becomes P2 → respond faster)
- ✅ Do log for tracking (create GitHub issue)

---

## P4 Low Priority Incident Response

- Log in GitHub issue tracker
- Tag as `priority-low`
- Schedule review in next engineering sprint
- No immediate action

---

## Incident Communication Template

### Initial Notification (Post Immediately When P1/P2 Confirmed)

```
🚨 INCIDENT: [Feature/Service] Down/Degraded

Severity: P[1-4]
Start Time: [UTC timestamp]
Status: 🔴 Investigating

Affected:
- [What is broken]
- [How many users affected - estimate]

Current Action:
- [What we're doing right now]
- [Expected ETA for fix]

Updates: [Link to tracking issue or channel]
```

### Status Update (Every 15 minutes during P1/P2)

```
⏱️ INCIDENT UPDATE

Elapsed: [time since start]
Status: 🟡 Investigating / 🟢 Resolved / 🔴 In Progress
Latest: [what we discovered]
Next: [what we're doing next]
ETA: [estimated fix time]
```

### Closure Notification (When Resolved)

```
✅ INCIDENT RESOLVED

Severity: P[1-4]
Duration: [minutes from start to fix]
Root Cause: [what happened]
Fix: [what we changed]
Affected Users: [estimate]
Status: 🟢 Online and Monitoring

Post-mortem: [scheduled for date/time]
```

---

## Post-Incident Procedures

### Within 1 Hour of Resolution

1. [ ] Verify issue is truly fixed (not just temporarily resolved)
2. [ ] Monitor metrics for 30 minutes (error rate, conversion rate, uptime)
3. [ ] Document incident:
   - What failed
   - When detected
   - How long before fixed
   - Who was involved
   - Root cause (initial hypothesis)

### Within 24 Hours of Resolution (Post-Mortem)

**Participants:**
- On-call engineer (incident responder)
- Frontend Lead (engineering)
- Platform Owner (infrastructure)
- QA Owner (testing)
- Program Lead (business impact)

**Agenda:**
1. **Timeline Review** (10 min)
   - What time did issue occur?
   - When was it detected?
   - How long was it live?
   - When was it fixed?

2. **Root Cause Analysis** (15 min)
   - What was the actual root cause?
   - How did it get to production?
   - Why wasn't it caught in testing?

3. **Impact Assessment** (5 min)
   - How many users were affected?
   - Did we lose any revenue/leads?
   - What's the customer-facing impact?

4. **Prevention Discussion** (15 min)
   - What should we have done differently?
   - What process failed?
   - What testing gap existed?
   - What monitoring gap existed?

5. **Action Items** (10 min)
   - What will we change?
   - Who is responsible?
   - By when will it be done?
   - How will we verify it's fixed?

**Post-Mortem Document:**
```markdown
# Incident Post-Mortem: [Incident Name]

Date: [date]
Duration: [X minutes]
Severity: P[1-4]

## Timeline
- 14:32 UTC - Issue occurred (form submission started failing)
- 14:34 UTC - Alert fired in Sentry
- 14:35 UTC - On-call engineer acknowledged
- 14:39 UTC - Root cause identified (API key invalid)
- 14:41 UTC - Hotfix deployed (environment variable corrected)
- 14:42 UTC - Issue resolved

## Root Cause
Sentry DSN (API key) expired and was not rotated. Code tried to send errors to Sentry but auth failed, cascading into form submission failures.

## Why It Happened
- Secrets rotation not automated
- No alert for approaching expiration
- Quarterly rotation was missed

## What We'll Do
1. Automate secrets rotation reminder (create calendar event)
2. Add 30-day warning for API key expiration (check manually if not automated)
3. Add log message when Sentry auth fails (so we catch earlier)
4. Update [Secrets Management ADR](ADR-0004-secrets-management.md) with rotation schedule
5. Add to [On-Call Checklist](OPERATIONAL-OWNERSHIP.md): "Check secrets expiration dates"

## Action Items
- [ ] @Platform Owner: Set up quarterly secrets rotation calendar
- [ ] @Frontend Lead: Add expiration warning to code
- [ ] @Program Lead: Update checklist documentation
- [ ] @QA Owner: Add "Check API key validity" to staging validation checklist
```

**Post-Mortem Review Meeting Schedule:** Within 24 hours of incident resolution

**Blameless Culture Reminder:**
- Focus on systems, not people
- No one is in trouble
- Goal is learning and improvement
- Everyone contributes perspectives

---

## Incident Roles and Responsibilities

| Role | During Incident | After Incident |
|---|---|---|
| **Incident Commander** (on-call) | Make decisions, coordinate response, communicate status | Gather facts for post-mortem, participate in review |
| **Frontend Lead** | Support investigation, help develop hotfix, approve deployment | Root cause analysis, identify code gaps |
| **Platform Owner** | Support investigation, manage escalation, handle rollback | Infrastructure analysis, identify ops gaps |
| **Program Lead** | Stakeholder communication, assess business impact, escalation authority | Communicate resolution to stakeholders |
| **QA Owner** | Not directly involved (no time for testing during incident), but review for process gaps | Identify testing gaps that missed issue |

---

## Escalation Path

**Level 1 (On-Call Engineer):**
- Investigation (15 min max)
- Rollback decision
- Hotfix execution

**Level 2 (Platform Owner) - Escalate If:**
- Unclear if issue is code or infrastructure
- Rollback isn't helping
- External service issue
- Uncertain about decisions

**Level 3 (Program Lead) - Escalate If:**
- Issue not resolved within 1 hour
- Major customer impact
- Business/revenue implications
- Media/PR impact

---

## Incident Severity Decision Guide

### Questions to Ask to Determine Severity

**Q1: How many users affected?**
- All or most users → P1
- >50% of users → P1 or P2
- 10-50% of users → P2
- <10% of users → P3 or P4

**Q2: Can users complete conversion?**
- No (forms completely broken) → P1
- Partially (some forms work) → P2
- Yes but degraded (slow) → P2 or P3
- No impact on conversion → P3 or P4

**Q3: Is website accessible?**
- Not accessible (404/500 everywhere) → P1
- Partially accessible (some pages load) → P2
- Fully accessible but broken feature → P2 or P3
- Accessible and functional but with cosmetic issue → P3 or P4

**Q4: How obvious is the issue?**
- Obvious on first page load → P1
- Obvious after clicking button → P2
- Only visible in analytics or logs → P3 or P4

---

## Related Documentation

- [Deployment Runbook](DEPLOYMENT-RUNBOOK.md) — How to deploy (and hotfix)
- [Monitoring and Alerts Runbook](MONITORING-AND-ALERTS-RUNBOOK.md) — What alerts mean
- [Rollback Procedure](ADR-0005-rollback-strategy.md) — Detailed rollback info
- [Operational Ownership](OPERATIONAL-OWNERSHIP.md) — Who to contact

---

## Quick Reference: What to Do When P1 Alert Fires

```
🚨 CRITICAL INCIDENT STARTED

1. ⏱️ ACKNOWLEDGE (within 2 min)
   - Mark yourself as responding in Slack
   - Note current time

2. 🔍 ASSESS (within 3 min)
   - Is website really down? Check: https://hvac-app.vercel.app/
   - Check Sentry: error rate?
   - Check GitHub: recent deploy?

3. 🎯 DECIDE (within 5 min)
   - Recent deploy caused it? → ROLLBACK
   - External service issue? → Escalate to Platform Owner
   - Unknown? → Investigate up to 10 min, then rollback if unclear

4. ⚡ EXECUTE (rollback workflow)
   - GitHub → Actions → Rollback Deployment
   - Trigger: Production environment
   - Reason: "Health checks failed"
   - Submit

5. ✅ VERIFY (5 min)
   - Website loads? Check: https://hvac-app.vercel.app/
   - Error rate down in Sentry?
   - Workflow shows "SUCCESS"?

6. 📢 NOTIFY (immediately)
   - Post to #deployments channel
   - Create incident issue (auto-created if rollback workflow)
   - Message Program Lead directly

7. 📝 DOCUMENT
   - Add incident summary to auto-created issue
   - Schedule post-mortem for tomorrow

STUCK? → ESCALATE immediately to Platform Owner
        Phone: [number]
        Slack: @platform-owner
        Email: [email]
```

---

## Feedback and Improvements

Found an issue with this runbook? Have a suggestion? Create an issue with the label `runbook-feedback`.

Last reviewed: 2026-05-06  
Next review: 2026-06-06 (after first live incident or monthly)
