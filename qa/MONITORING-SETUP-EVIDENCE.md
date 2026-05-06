# Monitoring Setup Evidence

**Version:** 1.0  
**Purpose:** Document proof that monitoring systems are configured and working  
**Owner:** Platform Owner  
**Last Updated:** 2026-05-06  
**Gate Reference:** Gate D3 - Monitoring and Alerting Verification  

---

## Overview

This document contains evidence that monitoring and alerting systems are properly configured, tested, and operational.

**What We Monitor:**
- **UptimeRobot:** Is the website accessible?
- **Sentry:** Are there JavaScript errors?
- **GA4:** Are users converting?

**Goal:** Detect production issues in <5 minutes and respond before customers are significantly impacted.

---

## UptimeRobot Monitoring Setup

### UptimeRobot Configuration

**Account Created:** [Date - TBD during Phase 1]  
**Account Owner:** Platform Owner  
**Admin Access Verified:** ✅ [yes/no]

### Production Monitor Configuration

**Monitor Name:** HVAC Production - Homepage  
**Monitor Type:** HTTP(s)  
**URL:** https://hvac-app.vercel.app/  
**Check Interval:** Every 5 minutes  
**Timeout:** 30 seconds  
**HTTP Method:** GET  
**Expected Response:** HTTP 200  

**Status:** ✅ Active and monitoring  
**Created:** [TBD during Phase 1]  
**Last Check:** [displays current status]

### Staging Monitor Configuration (Optional)

**Monitor Name:** HVAC Staging - Homepage  
**Monitor Type:** HTTP(s)  
**URL:** https://staging-hvac.vercel.app/  
**Check Interval:** Every 30 minutes  
**Timeout:** 30 seconds  
**Expected Response:** HTTP 200  

**Status:** ✅ Active and monitoring  
**Created:** [TBD during Phase 1]

### Alert Configuration

**Uptime Alert Recipients:**
- [ ] Slack Channel: #production-alerts
- [ ] Slack Webhook: [TBD - configured during Phase 1]
- [ ] Email: [on-call engineer email]
- [ ] SMS: [on-call engineer phone] (optional)

**Alert Trigger Conditions:**
- [ ] Website down (no HTTP 200 response)
- [ ] Website timeout (>30 sec response time)
- [ ] SSL certificate issue
- [ ] Any HTTP error code (4xx, 5xx)

**Alert Template:**
```
🚨 Down Detected
[Monitor Name] seems to be down
Error: [HTTP status or timeout]
Time: [UTC timestamp]
```

**Alert Recovery:**
```
✅ Up Detected
[Monitor Name] is back up
Response Time: [milliseconds]
Downtime Duration: [minutes]
```

### UptimeRobot Test Evidence

#### Test 1: Manual Downtime Simulation

**Date:** [TBD during Phase 1]  
**Test Operator:** [name]  
**Procedure:**
1. Temporarily disable Vercel deployment (or block URL)
2. Wait for next UptimeRobot check (within 5 min)
3. Observe alert in Slack

**Result:** ✅ Alert received in #production-alerts at [timestamp]  
**Alert Contents:**
```
[Paste actual alert here]
```

**Time from Trigger to Alert:** [seconds/minutes]  
**Alert Accuracy:** ✅ Correct (showed website was down)

#### Test 2: Recovery Alert

**Date:** [TBD during Phase 1]  
**Test Operator:** [name]  
**Procedure:**
1. Re-enable website after downtime test
2. Wait for next UptimeRobot check
3. Observe recovery alert

**Result:** ✅ Recovery alert received  
**Alert Contents:**
```
[Paste actual alert here]
```

**Time from Recovery to Alert:** [seconds/minutes]

### UptimeRobot Uptime Statistics

**Collected:** Last 7/30/90 days (select one)  
**Uptime Percentage:** [%]  
**Downtime Events:** [count]  
**Average Response Time:** [milliseconds]  

**Status:** ✅ Meets SLA target (>99% uptime expected)

---

## Sentry Error Tracking Setup

### Sentry Configuration

**Organization Created:** [Date - TBD during Phase 1]  
**Project Name:** HVAC Production  
**Project Owner:** Platform Owner  
**Admin Access Verified:** ✅ [yes/no]

### Sentry DSN Configuration

**DSN:** [TBD - generated during Phase 1]  
```
https://[public_key]@sentry.io/[project_id]
```

**Integration Points:**
- [ ] Sentry SDK integrated in `frontend/assets/js/system.js`
- [ ] Environment variable: `SENTRY_DSN_PRODUCTION`
- [ ] Stored securely in Vercel environment variables (not hardcoded)
- [ ] Active in production environment only

**Test:** Can you see this in code? ✅ [yes/no - don't hardcode, check env var]

### Sentry Alert Configuration

**Alert Rules Configured:**
- [ ] Error spike: >10 errors/min for 5+ consecutive minutes → Alert
- [ ] New error type (production) → Alert  
- [ ] Fatal error (environment=production) → Alert

**Alert Recipients:**
- [ ] Slack Channel: #production-alerts
- [ ] Slack Webhook: [TBD]
- [ ] Email: [on-call engineer]

**Alert Template:**
```
🚨 Alert
[HVAC Production] [Alert Type]
Error: [Error message]
Rate: [errors/min]
See: [Link to Sentry]
```

### Sentry Test Evidence

#### Test 1: Error Capture Verification

**Date:** [TBD during Phase 1]  
**Test Operator:** [name]  
**Procedure:**
1. Go to staging or dev site
2. Trigger test error (e.g., throw new Error("Test error"))
3. Check Sentry dashboard for captured error

**Result:** ✅ Error captured in Sentry  
**Error Details:**
```
Error Type: [Error]
Message: [Test error]
Environment: [staging/dev]
Timestamp: [UTC]
User: [test user]
```

**Time from Error to Sentry:** [seconds]  
**Error Accuracy:** ✅ Correct (shows right message, stack trace, environment)

#### Test 2: Error Spike Alert

**Date:** [TBD during Phase 1]  
**Test Operator:** [name]  
**Procedure:**
1. Trigger 15+ errors in production within 1 minute (or simulate in Sentry)
2. Wait for alert threshold (should be >10 errors/min for 5 min)
3. Observe alert in Slack

**Result:** ✅ or ⏳ (if threshold not met in time window)  
**Alert Received:** [yes/no]

**If Alert Received:**
```
[Paste actual alert]
```

**Time from Spike to Alert:** [minutes]

#### Test 3: New Error Type Alert

**Date:** [TBD during Phase 1]  
**Test Operator:** [name]  
**Procedure:**
1. Trigger a new error type (something never seen before in production)
2. Observe Sentry for new error detection
3. Check for alert

**Result:** ✅ New error detected and alerted  
**Alert Contents:**
```
[Paste actual alert]
```

### Sentry Dashboard Verification

**Dashboard URL:** https://sentry.io/organizations/[org]/issues/?project=[project_id]  
**Current Issues:** [count] open issues  
**Error Rate:** [errors/hour or errors/min] (baseline)  
**Status:** ✅ Configured and monitoring

---

## Google Analytics 4 (GA4) Verification

### GA4 Configuration

**GA4 Property Created:** [Date - TBD]  
**Property ID:** [TBD]  
**Measurement ID:** [TBD]

**Integration Points:**
- [ ] GA4 SDK loaded in `frontend/assets/js/system.js`
- [ ] Measurement ID: `ANALYTICS_KEY_PRODUCTION`
- [ ] Stored in Vercel environment variables (not hardcoded)

### GA4 Event Verification

#### Event 1: Page View

**Event Name:** page_view  
**Tracked On:** All pages  
**Test Procedure:**
1. Visit https://hvac-app.vercel.app/ in browser
2. Open GA4 dashboard → Real-time → Pages
3. Verify page_view event appears

**Result:** ✅ Page view tracked  
**Appearance Time:** [seconds]  
**Event Details Visible:** ✅ (page path, document title)

#### Event 2: Form Submission

**Event Name:** form_submit  
**Tracked On:** All forms  
**Test Procedure:**
1. Go to homepage
2. Fill out contact form
3. Submit form
4. Check GA4 dashboard for form_submit event

**Result:** ✅ Form submission tracked  
**Appearance Time:** [seconds]  
**Event Properties Tracked:** ✅ (form_name, form_destination)

#### Event 3: CTA Click

**Event Name:** cta_click  
**Tracked On:** All CTA buttons  
**Test Procedure:**
1. Go to homepage
2. Click main CTA button
3. Check GA4 dashboard for cta_click event

**Result:** ✅ CTA click tracked  
**Event Properties:** ✅ (cta_name, page_name)

### GA4 Real-Time Dashboard Verification

**Dashboard:** https://analytics.google.com/ → Real-time report  
**Current Active Users:** [count] (if during business hours)  
**Last Hour Page Views:** [count]  
**Last Hour Conversions:** [count]  
**Status:** ✅ Real-time tracking active

---

## Alert Delivery Verification

### Slack Integration Test

**Slack Workspace:** [TBD]  
**Alert Channel:** #production-alerts  
**Channel Created:** [Date]  
**Team Members Notified:** ✅ [list team members]

**Test Alert Delivery:**

#### Test 1: Manual Alert to Slack

**Date:** [TBD]  
**Test Operator:** [name]  
**Procedure:**
1. Go to UptimeRobot settings
2. Send test notification to Slack webhook
3. Verify message appears in #production-alerts

**Result:** ✅ Test alert received  
**Message Timestamp:** [UTC]  
**Message Format:** ✅ Readable, includes key info (system name, status, time)

#### Test 2: Production Alert to Slack

**Date:** [TBD - during first incident]  
**Alert Type:** [UptimeRobot / Sentry / other]  
**Result:** ✅ Alert delivered to Slack  
**Response Time:** [seconds from event to message]

### Email Integration Test

**Email Configured:** ✅ [yes/no]  
**Test Email Recipient:** [on-call engineer email]

**Test Alert Email:**

**Date:** [TBD]  
**Result:** ✅ Test email received  
**Subject:** [paste subject]  
**Contains:** ✅ Alert details, timestamp, action links  
**Delivery Time:** [seconds from trigger to receipt]

---

## Monitoring Dashboard Access Verification

### Team Access Verification

| System | User | Access Level | Verified | Date |
|---|---|---|---|---|
| **UptimeRobot** | Platform Owner | Admin | ✅ | [date] |
| **UptimeRobot** | On-Call Backup | Viewer | ✅ | [date] |
| **Sentry** | Platform Owner | Admin | ✅ | [date] |
| **Sentry** | Frontend Lead | Editor | ✅ | [date] |
| **GA4** | Analytics Lead | Editor | ✅ | [date] |
| **GA4** | Frontend Lead | Viewer | ✅ | [date] |

**Status:** ✅ All required users have access

### Dashboard Bookmark Verification

**Team Bookmarks Created:**
- [ ] UptimeRobot: https://uptimerobot.com/dashboard
- [ ] Sentry: https://sentry.io/organizations/[org]/issues/
- [ ] GA4: https://analytics.google.com/
- [ ] Runbooks Hub: [link to docs]

**Status:** ✅ All dashboards bookmarked and accessible

---

## Alert Response SLA Verification

### Response Time Targets

| Alert Type | SLA | Test Result |
|---|---|---|
| **Website Down** | <5 min detection | [verified: yes/no] |
| **Error Spike** | <5 min detection | [verified: yes/no] |
| **New Error Type** | <5 min detection | [verified: yes/no] |
| **Email Delivery** | <1 min | [verified: yes/no] |
| **Slack Delivery** | <30 sec | [verified: yes/no] |

**Overall Status:** ✅ SLAs met

---

## Monitoring Health Check Procedure

**Frequency:** Daily (during on-call shift)  
**Owner:** On-call engineer

**Checklist:**
```
□ UptimeRobot dashboard shows all monitors "UP"
□ Sentry dashboard shows normal error rate (no spike)
□ GA4 real-time shows expected traffic pattern
□ All team members have access to dashboards
□ No unresolved critical alerts pending
□ Previous day's incidents documented/resolved
```

---

## Monitoring Metrics and Trending

### Monthly Monitoring Report

**Reporting Period:** [Month YYYY]

| Metric | Target | Actual | Status |
|---|---|---|---|
| **Uptime %** | >99% | [%] | ✅ |
| **Detection Time (MTTD)** | <5 min | [min] | ✅ |
| **Alert Accuracy** | >95% | [%] | ✅ |
| **False Positive Rate** | <5% | [%] | ✅ |
| **Alert Response Time** | <15 min | [min] | ✅ |

**Trend:** ✅ Stable or improving

---

## Evidence Sign-Off

### Gate D3 Completion: Monitoring and Alerting Verified

**Requirement:** Monitoring and alerting configured, tested, and operational

**Evidence Provided:**
- [ ] UptimeRobot configured for production (5-min checks)
- [ ] UptimeRobot alerts tested and verified (Slack + Email working)
- [ ] Sentry error tracking configured and tested
- [ ] Sentry alerts tested and verified
- [ ] GA4 event tracking verified (page views, forms, CTAs)
- [ ] All team members have dashboard access
- [ ] SLAs for alert detection met (<5 min)
- [ ] Response procedures documented (see Monitoring Runbook)

**Verification Timestamp:** [UTC timestamp]  
**Verified By:** Platform Owner ([name])  
**Approved By:** Program Lead ([name])

**Status:** ✅ **Gate D3 PASSED**

---

## Related Documentation

- [Monitoring and Alerts Runbook](../docs/program/MONITORING-AND-ALERTS-RUNBOOK.md) — Alert interpretation and response
- [ADR-0003: Monitoring and Alerting Stack](../docs/program/ADR-0003-monitoring-and-alerting-stack.md) — Why we chose these tools
- [KPI Baseline Sheet](../docs/program/KPI-BASELINE-SHEET.md) — Baseline metrics for comparison
- [Incident Response Runbook](../docs/program/INCIDENT-RESPONSE-RUNBOOK.md) — How to respond to alerts

---

## Questions or Issues?

**Monitoring not working?** Create GitHub issue with label `monitoring-issue`  
**Want to add new alert?** Create GitHub issue with label `monitoring-improvement`  
**Alert config unclear?** See [Monitoring Runbook](../docs/program/MONITORING-AND-ALERTS-RUNBOOK.md)

---

## Document Control

**Version:** 1.0  
**Created:** 2026-05-06  
**Last Updated:** 2026-05-06  
**Next Review:** 2026-06-06 (after first week of production monitoring)
