# ADR-0003: Monitoring and Alerting Stack Selection

**Date:** 2026-05-06  
**Status:** ✅ Accepted  
**Deciders:** Platform Owner, Frontend Lead  
**Stakeholders:** Program Lead, On-Call Engineer

---

## Context

Production system requires continuous monitoring to ensure uptime and detect errors. Key requirements:

- **Uptime monitoring** (HTTP 200, page response time)
- **Error tracking** (client-side JS errors, failed conversions)
- **Alert delivery** (Slack, email, SMS for critical issues)
- **Free or low-cost** (startup budget)
- **Minimal infrastructure** (no server setup required)
- **Team-friendly** (easy to understand alerts, minimal false positives)
- **Integration with deployment pipeline** (auto-rollback on error spike)

Evaluated solutions: Datadog, New Relic, CloudWatch, Grafana + Prometheus, UptimeRobot + Sentry, custom solution.

---

## Decision

**Use two-tier monitoring stack:**

1. **Uptime Monitoring: UptimeRobot** (free tier)
   - Monitors HTTP 200 status on production URL every 5 minutes
   - Alerts via Slack and email on down/degraded response time
   - Maintains uptime statistics and SLA dashboard

2. **Error Tracking: Sentry** (free tier)
   - Captures client-side JavaScript errors
   - Groups errors by type and trend
   - Alerts on error spike (>10/min) and new error types
   - Integrates with Slack for critical alerts

---

## Rationale

### Why UptimeRobot + Sentry?

1. **Free tier sufficient:** UptimeRobot free tier includes 50 monitors; Sentry free tier covers 5,000 events/month (plenty for small site).
2. **Industry standard:** Both tools widely used and trusted; documented best practices available.
3. **Easy setup:** No infrastructure required; integrates directly with GitHub Actions and Slack.
4. **Alert fatigue control:** Configurable thresholds reduce false positives; better than overly complex setups.
5. **Team-friendly:** Non-engineers can understand alerts; dashboards are intuitive.
6. **Integration ready:** Both tools have Slack webhooks, GitHub Actions integrations, and rollback hooks.

### Trade-offs Accepted

- **Limited custom metrics:** Cannot track custom business metrics (e.g., "average form completion time"). Can add later if needed.
- **Vendor-specific dashboards:** Not unified single dashboard (have to check two tools). Acceptable trade-off for simplicity.
- **Pricing changes:** Both vendors may change free tier limits. Mitigation: evaluate alternatives annually.

---

## Alternatives Considered

### 1. Datadog (All-in-One)
- **Pros:** Unified dashboard, extensive integrations, very powerful.
- **Cons:** Expensive ($15-30+/month), overkill for current project size, steeper learning curve.
- **Status:** Rejected as too costly; consider for enterprise scale.

### 2. New Relic (All-in-One)
- **Pros:** Similar to Datadog, free tier available, good for Full Stack Observability.
- **Cons:** Complex pricing model, free tier limited, similar overkill concern.
- **Status:** Rejected; UptimeRobot + Sentry better value for project size.

### 3. CloudWatch (AWS)
- **Pros:** Integrated with AWS if using AWS hosting; powerful log analysis.
- **Cons:** We're using Vercel (not AWS), so integration awkward. Pricing complex. Overkill for static site.
- **Status:** Rejected (AWS not our hosting platform).

### 4. Grafana + Prometheus (Self-Hosted)
- **Pros:** Full control, open-source, free.
- **Cons:** Requires infrastructure, operational overhead, steep learning curve for small team.
- **Status:** Rejected; too much ops overhead for small team.

### 5. Custom Solution (Cron Job + Webhook)
- **Pros:** Full control, minimal cost.
- **Cons:** Requires ongoing maintenance, no alerting aggregation, reinventing the wheel.
- **Status:** Rejected; managed solutions better value.

---

## Consequences

### Positive

1. ✅ **Minimal operational burden:** No servers to run, no infrastructure to maintain.
2. ✅ **Immediate alert delivery:** Slack notifications within seconds of issue detection.
3. ✅ **Free for current scale:** Both tools free tier covers project needs indefinitely (or until growth).
4. ✅ **Industry best practice:** Both tools widely proven and documented.
5. ✅ **Easy team onboarding:** Developers already familiar with both tools; less learning curve.
6. ✅ **Integration with CI/CD:** Both tools hook into GitHub Actions (automatic rollback on Sentry spike).

### Negative

1. ⚠️ **Vendor dependency:** Locked into UptimeRobot + Sentry; migration to other tools requires config changes.
   - **Mitigation:** Both tools use standard webhook formats; can redirect to new tools with minimal effort.
2. ⚠️ **Limited custom metrics:** Cannot track business-specific metrics without custom implementation.
   - **Mitigation:** Custom metrics can be added later to Sentry via tags/custom context.
3. ⚠️ **Two dashboards:** Have to check two separate tools to get full picture.
   - **Mitigation:** Sentry + UptimeRobot dashboard links pinned in Slack; team quickly learns routine.

---

## Implementation

### UptimeRobot Setup (30 minutes)

1. Create UptimeRobot account (free)
2. Create monitors:
   - Production homepage: `https://hvac-app.vercel.app/` (every 5 min, alert on down)
   - Staging homepage: `https://staging-hvac.vercel.app/` (every 30 min, alert on down)
   - Dev (optional): `https://dev-hvac.vercel.app/` (hourly check, no alert)
3. Configure Slack webhook for alerts: `#production-alerts` channel
4. Configure email alerts to on-call engineer
5. Test alert delivery (simulate down, verify Slack + email received)

### Sentry Setup (1 hour)

1. Create Sentry account (free tier)
2. Create Sentry project for HVAC program
3. Generate Sentry DSN (Data Source Name)
4. Add Sentry SDK to `frontend/assets/js/system.js`:
   ```javascript
   // Sentry DSN is injected by Vercel as a build-time env var via vercel.json or
   // a small inline <script> that sets window.SENTRY_DSN before this file loads.
   if (window.ENV === 'production' && window.SENTRY_DSN) {
     import('https://cdn.sentry-cdn.com/sentry.js').then(() => {
       Sentry.init({
         dsn: window.SENTRY_DSN,
         environment: window.ENV,
         tracesSampleRate: 0.1,
       });
     });
   }
   ```
   > **Note:** `process.env` is a Node.js concept and is not available in browser JavaScript.
   > Inject the DSN at the HTML template level via a `<script>window.SENTRY_DSN = '...'</script>`
   > block populated by Vercel environment variables at deploy time.
5. Store Sentry DSN in GitHub Secrets (per environment)
6. Configure Sentry alerts:
   - Alert on error spike (>10 errors/min)
   - Alert on new error type
   - Send to Slack: `#production-alerts`
7. Test error capture (throw test error, verify captured in Sentry)

### Alert Escalation

| Alert Type | SLA | Escalation |
|---|---|---|
| **Uptime: Production Down** | 5 min acknowledgment | On-Call → Platform Owner → Program Lead |
| **Error Spike: >50 errors/min** | 15 min acknowledgment | On-Call → Platform Owner |
| **Error Spike: >10 errors/min** | 30 min acknowledgment | On-Call team |
| **New Error Type (Production)** | 2 hour investigation | On-Call (investigate, may not need immediate response) |

---

## Monitoring Runbook

### UptimeRobot Alerts

**Alert: "Production site is down"**
1. Open UptimeRobot dashboard
2. Verify alert time and status
3. Check Vercel deployment dashboard for recent changes
4. Check Sentry for error spike
5. If recent deploy: check deploy logs, consider rollback
6. If infrastructure issue: notify Platform Owner, consider switching to staging temporarily
7. Once resolved: post incident summary to #incidents channel

### Sentry Alerts

**Alert: "Error spike detected (>10 errors/min)"**
1. Open Sentry dashboard
2. Identify error type and affected feature
3. Check error stack trace and user session context
4. Check if recent deploy caused issue
5. If yes: rollback via rollback.yml workflow
6. If no: investigate root cause, consider hotfix deployment
7. Post incident summary to #incidents channel

---

## Verification

- ✅ UptimeRobot monitors configured for all three environments
- ✅ Sentry project created with DSN
- ✅ Sentry SDK integrated in `system.js`
- ✅ Alert test passed (manual error in Sentry, Slack notification received)
- ✅ Alert test passed (manual downtime in UptimeRobot, Slack notification received)
- ✅ On-call engineer trained on alert response procedures
- ✅ SLA targets documented and agreed

---

## Review and Approval

**Proposed:** 2026-05-06  
**Approved:** [Platform Owner signature]  
**Review Date:** 2026-06-06 (quarterly review recommended)  
**Cost Review Date:** 2026-08-06 (check free tier usage vs. paid limits)

---

## Related Decisions

- **ADR-0002:** Hosting Platform Selection (Vercel)
- **D-009:** Secrets Management Strategy (Sentry DSN in GitHub Secrets)
- **D-010:** Rollback Strategy (auto-rollback on Sentry spike)
- **D-011:** On-Call and Escalation Procedures

---

## References

- [UptimeRobot Documentation](https://uptimerobot.com/help/)
- [Sentry Documentation](https://docs.sentry.io/)
- [Monitoring and Alerts Runbook](../MONITORING-AND-ALERTS-RUNBOOK.md)
- [Incident Response Runbook](../INCIDENT-RESPONSE-RUNBOOK.md)
