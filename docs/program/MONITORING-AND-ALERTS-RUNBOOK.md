# Monitoring and Alerts Runbook

**Version:** 1.0  
**Owner:** Platform Owner + On-Call Engineer  
**Last Updated:** 2026-05-06  
**Audience:** On-Call Engineers, DevOps, Frontend Lead  

---

## Overview

This runbook explains:
- What we monitor and why
- What each alert means
- How to respond to each alert type
- Escalation procedures

**Goal:** Enable on-call engineer to respond quickly and confidently to any production issue.

**Key SLA:**
- Alert delivery: <1 minute
- Acknowledgment: <15 minutes
- Investigation: <30 minutes
- Resolution or escalation: <1 hour

---

## Monitoring Stack Overview

We use **two complementary tools:**

1. **UptimeRobot** — Monitors that website responds to HTTP requests
2. **Sentry** — Monitors that JavaScript runs without errors

### Why Two Tools?

- **UptimeRobot** answers: "Is the website accessible?"
- **Sentry** answers: "Is the website functioning correctly?"

Both alerts matter. A page can load (UptimeRobot happy) but have broken features (Sentry errors).

---

## UptimeRobot: Uptime Monitoring

### What UptimeRobot Monitors

```
Every 5 minutes:
1. Can we reach https://hvac-app.vercel.app/?
2. Does it respond with HTTP 200?
3. Does it respond in <2 seconds?
```

### UptimeRobot Dashboard Location

- **URL:** https://uptimerobot.com/dashboard
- **Login:** Platform Owner credentials (see [Operational Ownership](OPERATIONAL-OWNERSHIP.md))
- **View:** "HVAC Production" monitor

### Alert: "HVAC Production Website Down"

**When You See This Alert:**

Slack message in `#production-alerts`:
```
🚨 Down Detected
HVAC Production Website [hvac-app.vercel.app] seems to be down.
HTTP error
Time: 2026-05-06 14:32:10 UTC
```

**What It Means:**
- HTTP request to production website failed or timed out
- Website is either unreachable or returning 5xx error
- Likely: Vercel infrastructure issue, deployment failure, or network problem

**Step 1: Confirm the Issue (2 minutes)**

1. Open production URL in browser: https://hvac-app.vercel.app/
   - [ ] Does page load? → Alert was false positive (network blip)
   - [ ] Do you get a 5xx error? → Real issue, proceed to Step 2
   - [ ] Does page time out? → Real issue, proceed to Step 2
2. Try incognito/private browser window (bypass cache)
3. Try from different location (phone hotspot, etc.)

**Step 2: Check Recent Deployments (3 minutes)**

1. Go to GitHub: https://github.com/Custom-Coding-Creations/hvac/actions
2. Look at "Deploy to Staging and Production" workflow runs
3. Find most recent production deployment (look for "Production" environment)
   - [ ] Did it complete successfully? (green checkmark)
   - [ ] Did health checks pass? (show as step in workflow)
4. If deployment failed: likely deployment broke the site
   - → Proceed to Step 3 (Investigate Deployment)
5. If deployment succeeded: likely production infrastructure issue
   - → Proceed to Step 4 (Check Vercel)

**Step 3: Investigate Recent Deployment (5 minutes)**

1. Click the workflow run that deployed to production
2. Expand "Run production health checks" step
3. Read the output:
   - [ ] "✅ All health checks passed" → Deployment OK, issue elsewhere
   - [ ] "❌ Health checks failed" → Deployment broke site, **AUTO-ROLLBACK should have triggered**
4. If auto-rollback triggered:
   - Check workflow for "rollback-on-failure" job
   - Should show status: "waiting" or "completed"
   - If completed successfully: production should be back online within 1-2 min
   - Try production URL again: does it load?

**Step 4: Check Vercel Dashboard (3 minutes)**

1. Go to Vercel: https://vercel.com/dashboard
2. Login with Platform Owner account
3. Find HVAC Production project
4. Check "Deployments" tab:
   - [ ] Most recent deployment status: "Ready" (✅) or "Failed" (❌)
   - [ ] If "Failed": hover over deployment to see error message
   - [ ] If "Ready": try clicking to view deployment details
5. Check "Monitoring" tab:
   - [ ] Status indicator: shows current deployment status
   - [ ] Any recent downtime events?

**Step 5: Escalate or Resolve (Decision point)**

**If You Found the Issue:**
- Issue is with recent deployment → **Trigger rollback** (see [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md))
- Issue is with Vercel infrastructure → **Notify Platform Owner**, escalate to Vercel support

**If Issue Resolved on Its Own:**
- Deployment health checks passed, site now online → Document what happened, no further action

**If You Can't Determine the Issue:**
- Escalate to Platform Owner immediately (see [Operational Ownership](OPERATIONAL-OWNERSHIP.md))
- Provide evidence: UptimeRobot alert time, production URL test results, GitHub workflow status

### Alert: "HVAC Production Website Is Back Up"

**When You See This Alert:**

Slack message in `#production-alerts`:
```
✅ Up Detected
HVAC Production Website [hvac-app.vercel.app] is back up.
Time: 2026-05-06 14:34:22 UTC
Duration down: 2 minutes
```

**What It Means:**
- Website was down (per previous alert)
- Now responding to HTTP requests again
- Either issue self-resolved or was already fixed (rollback completed)

**Action:**
1. Verify production working: Open https://hvac-app.vercel.app/ → should load
2. Check Sentry for error spike (see Sentry section below)
3. If everything looks good: post to #deployments: "Production restored at [time]"
4. If still seeing errors: continue investigating (don't mark as resolved yet)

---

## Sentry: Error Tracking

### What Sentry Monitors

Sentry captures JavaScript errors from production website:
- Page JS errors (uncaught exceptions)
- Failed API calls
- Timeout errors
- Custom error events

Sentry sends alert if error spike detected or new error type appears.

### Sentry Dashboard Location

- **URL:** https://sentry.io/organizations/hvac/issues/
- **Login:** Platform Owner credentials (see [Operational Ownership](OPERATIONAL-OWNERSHIP.md))
- **Filter:** "is:unresolved environment:production"

### Alert Type 1: Error Spike (>10 errors/min for 5 min)

**When You See This Alert:**

Slack message in `#production-alerts`:
```
🚨 Alert
[HVAC Production] Error spike detected
Threshold: >10 errors/min for 5+ consecutive minutes
Current rate: 47 errors/min
Error: TypeError: Cannot read property 'addEventListener' of null
See: [link to Sentry]
```

**What It Means:**
- Production website is experiencing many errors per minute
- Likely: recent deployment broke a feature, or external API dependency failed

**Step 1: Open Sentry (1 minute)**

1. Click the link in Slack alert (or go to Sentry.io)
2. Look at error dashboard:
   - [ ] Error type shown (e.g., "TypeError: Cannot read property...")
   - [ ] Error rate graph: shows spike timeline
   - [ ] Affected pages/features: where are errors happening?
3. Click error name to expand: see stack trace and affected code

**Step 2: Identify Affected Feature (2 minutes)**

1. From Sentry stack trace, identify which feature is broken
   - Examples: Form submission? Navigation? CTA buttons?
2. Check error message:
   - "Cannot read property 'addEventListener' of null" → DOM element missing
   - "network error" → API call failed
   - "timeout" → Operation took too long
3. Click "Breadcrumbs" tab in Sentry: see what user did before error

**Step 3: Check Recent Changes (2 minutes)**

1. Go to GitHub: https://github.com/Custom-Coding-Creations/hvac/actions
2. Look at most recent production deployments (last 24 hours)
3. Does error spike timeline match deployment time?
   - [ ] Errors started immediately after deploy? → Likely deployment caused it
   - [ ] Errors started much earlier? → Likely external issue (API dependency)

**Step 4: Decide: Rollback vs. Investigate (Decision point)**

**ROLLBACK CRITERIA (trigger rollback immediately):**
- ✅ Error spike started right after deployment
- ✅ Errors >50/min (very high rate)
- ✅ Core conversion path broken (forms not submitting, CTAs not working)
- ✅ Affecting >50% of users

**INVESTIGATE CRITERIA (don't rollback, investigate instead):**
- ⏳ Errors <10/min (low rate, manageable)
- ⏳ Errors in non-critical feature (e.g., tracking pixel failure)
- ⏳ Error appears unrelated to recent deployment
- ⏳ Workaround exists for users

**If Rollback Decision:**
→ See [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md) for rollback procedure

**If Investigate Decision:**
1. Analyze error details in Sentry (stack trace, affected code)
2. Reproduce error locally (try to trigger on your machine)
3. Develop fix (change code)
4. Push fix to main (triggers staging deployment)
5. Test fix in staging
6. Deploy to production (manual hotfix or wait for approval gate)
7. Verify error rate drops in Sentry (give 5-10 min for users to refresh)

### Alert Type 2: New Error Type (Production)

**When You See This Alert:**

Slack message in `#production-alerts`:
```
📢 New Error
[HVAC Production] New error type detected
Error: ReferenceError: 'analytics' is not defined
First occurrence: 2026-05-06 14:45:00 UTC
Affected users: 3
```

**What It Means:**
- JavaScript encountered a new error type (hasn't been seen before in production)
- Might be innocuous (3rd party script issue) or critical (app code issue)
- Requires investigation to determine severity

**Step 1: Assess Severity (2 minutes)**

1. Open Sentry link from Slack message
2. Check error details:
   - [ ] Error severity: "Error" or "Fatal"?
   - [ ] Affected users: >10 means widespread, <5 means isolated
   - [ ] Stack trace: where does error occur? (in app code or 3rd party?)
3. Ask yourself:
   - "Does this break the core conversion path?"
     - No → Low priority, can monitor
     - Yes → High priority, investigate immediately

**Step 2: Determine Action (2 minutes)**

**If Low Priority (not affecting conversions):**
1. Monitor Sentry dashboard for next 15 min
2. If error rate stays low: ignore it (might be bot/crawler)
3. If error rate increases: escalate to Platform Owner

**If High Priority (affecting conversions):**
1. Check GitHub for recent deployments (did this start after a deploy?)
2. If yes: consider rollback (see Incident Response Runbook)
3. If no: reach out to Platform Owner (might be external API issue)

---

## Common Error Patterns and Responses

### Error: "Cannot read property 'addEventListener' of null"

**Meaning:** JavaScript tried to attach event listener to DOM element that doesn't exist

**Common Cause:** CSS class name changed in HTML, JS still looking for old class

**Response:**
1. Check recent commits to templates
2. Look for changes to class names or element IDs
3. Update JS to match new HTML structure
4. Deploy fix

### Error: "Network Error" or "Failed to fetch"

**Meaning:** JavaScript couldn't reach external API (CRM, analytics, etc.)

**Common Cause:** External service down, network blocked, or authentication failed

**Response:**
1. Check if external service is down (visit their status page)
2. Check Vercel deployment logs for env variables (is API key set correctly?)
3. If you can't reach service: can't fix (escalate to service provider)
4. If service is down: post incident note and monitor until recovery

### Error: "Timeout" or "Request took too long"

**Meaning:** API call or operation took longer than expected (usually >30 sec)

**Common Cause:** Slow network, external service slow, too large response

**Response:**
1. Check if issue is temporary (spike in one minute) or sustained (ongoing)
2. If temporary: likely network blip, no action needed
3. If sustained: might need to increase timeout or reduce request size

### Error: "Memory limit exceeded" or "Out of memory"

**Meaning:** Browser ran out of memory (very rare)

**Common Cause:** Memory leak in JavaScript, infinite loop

**Response:**
1. Check recent JavaScript changes (do they create loops or large arrays?)
2. Debug locally: open DevTools, go to Memory tab, look for leaks
3. Implement fix to prevent memory leak

---

## Alert Response Workflow

```
Alert Received (Slack notification)
↓
1. Assess (Is it real? How severe?)
   ├─ False positive (test alert, network blip) → Acknowledge, close
   ├─ Low severity (isolated error) → Monitor, document
   └─ High severity (widespread outage) → Proceed to Step 2
↓
2. Investigate (What happened?)
   ├─ Check recent deployments
   ├─ Check Sentry/UptimeRobot dashboard
   ├─ Check external service status
   └─ Identify root cause
↓
3. Decide (Rollback or fix forward?)
   ├─ Rollback → Follow rollback procedure
   ├─ Fix forward → Develop hotfix, test, deploy
   └─ External issue → Escalate to service provider
↓
4. Execute (Implement the fix)
   ├─ Rollback: trigger rollback.yml workflow
   ├─ Hotfix: commit, push, deploy
   └─ External: document ETA, monitor for recovery
↓
5. Verify (Did it work?)
   ├─ Check production URL loads
   ├─ Check Sentry error rate drops
   ├─ Check UptimeRobot shows "UP"
   └─ Check GA4 conversion events resuming
↓
6. Document (What happened?)
   ├─ Create incident issue (auto-created if rollback)
   ├─ Write incident summary
   ├─ Schedule post-mortem
   └─ Notify team
```

---

## Escalation Matrix

| Situation | Response Time | Action | Escalate To |
|---|---|---|---|
| **False positive** (test alert, no real issue) | 5 min acknowledge | Investigate, confirm, close | None |
| **Low severity** (1-2 errors, non-critical feature) | 30 min investigate | Monitor, log, decide if fix needed | Platform Owner if >1 hour unresolved |
| **Medium severity** (10-50 errors, some users affected) | 15 min investigate | Investigate root cause, decide rollback vs. fix | Platform Owner if rollback needed |
| **High severity** (>50 errors, widespread outage, conversion drop) | <5 min investigate | Immediate rollback OR hotfix | Platform Owner immediate notification |
| **Critical** (website down, 404 responses, total outage) | <2 min investigate | **IMMEDIATE ROLLBACK** | Platform Owner + Program Lead immediate |

---

## On-Call Escalation Contacts

See [Operational Ownership](OPERATIONAL-OWNERSHIP.md) for current on-call contacts.

---

## Monitoring Dashboards to Check Regularly

### During On-Call Shift (Start of Shift)

1. **UptimeRobot Dashboard:** https://uptimerobot.com/dashboard
   - [ ] All monitors showing "UP" (green)
   - [ ] Check 24-hour history for any downtime

2. **Sentry Dashboard:** https://sentry.io/organizations/hvac/issues/
   - [ ] Filter: "is:unresolved environment:production"
   - [ ] Any open issues or recent errors?
   - [ ] Error rate trending up or down?

3. **Vercel Dashboard:** https://vercel.com/dashboard
   - [ ] Latest deployment: "Ready" status
   - [ ] Last deployment time: when was most recent change?
   - [ ] Any monitoring/health alerts shown?

4. **GA4 Dashboard:** https://analytics.google.com/
   - [ ] Baseline conversion rate: what's normal?
   - [ ] Real-time users: is traffic normal?
   - [ ] Any events not firing (would show as sudden drop)?

### During On-Call Shift (Hourly Check)

- [ ] Spot-check production website loads: https://hvac-app.vercel.app/
- [ ] Check for new Sentry issues (any errors since last check?)
- [ ] Check UptimeRobot: any failed checks?
- [ ] Scan #production-alerts channel for missed alerts

---

## False Positive Handling

### Type 1: Network Blip

**When:** UptimeRobot alert "website down" but when you check it's working

**Why:** UptimeRobot pings from multiple data centers; occasionally one fails

**Action:**
1. Confirm: open production URL, it loads → confirm not real outage
2. Check UptimeRobot: look at "Logs" tab, did follow-up ping succeed?
3. If yes: just a network blip, no action needed
4. Document: "False positive - network blip at 2026-05-06 14:32 UTC"

### Type 2: Test Alert

**When:** Error spike alert appears but it's from your own testing

**Why:** You triggered error intentionally to test Sentry

**Action:**
1. Confirm: check Sentry breadcrumbs, can you identify the test?
2. Mark as resolved in Sentry: click "Resolve" button
3. Add note: "Test error - intentionally triggered by [name]"

### Type 3: Upstream Service Issue

**When:** Sentry shows errors about external API (CRM, analytics) failing

**Why:** External service is down or having issues

**Action:**
1. Check external service status page (Shopify, HubSpot, etc.)
2. If service is down: post incident note "CRM API down, waiting for recovery"
3. Monitor external service for recovery
4. No urgent fix needed (will resolve when service recovers)

---

## Related Documentation

- [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md) — What to do when you find a real issue
- [Deployment Runbook](DEPLOYMENT-RUNBOOK.md) — How to deploy and what to verify
- [ADR-0003: Monitoring and Alerting Stack](ADR-0003-monitoring-and-alerting-stack.md) — Why we chose UptimeRobot + Sentry
- [Operational Ownership](OPERATIONAL-OWNERSHIP.md) — Who to contact if you're stuck

---

## Quick Reference Card (Print and Post at Desk)

```
🚨 PRODUCTION ALERT RECEIVED

1. READ THE ALERT (identify which tool: UptimeRobot or Sentry?)
2. CONFIRM (is it real? Try opening https://hvac-app.vercel.app/)
3. INVESTIGATE (check dashboards, GitHub recent deployments)
4. DECIDE (is this a rollback, hotfix, or monitor situation?)
5. EXECUTE (trigger rollback.yml or develop hotfix)
6. VERIFY (check website working, error rate dropping)
7. DOCUMENT (create incident issue, post to #deployments)
8. ESCALATE (if stuck, contact Platform Owner)

DASHBOARDS:
- UptimeRobot: https://uptimerobot.com/dashboard
- Sentry: https://sentry.io/organizations/hvac/issues/
- Vercel: https://vercel.com/dashboard
- GA4: https://analytics.google.com/

CONTACTS:
- Platform Owner: [phone] [email]
- Frontend Lead: [phone] [email]
- Program Lead: [phone] [email]
```

---

## Feedback and Improvements

Found an issue with this runbook? Have a suggestion? Create an issue with the label `runbook-feedback`.

Last reviewed: 2026-05-06  
Next review: 2026-06-06 (monthly)
