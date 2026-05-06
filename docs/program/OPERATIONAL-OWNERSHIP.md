# Operational Ownership and Escalation

**Version:** 1.0  
**Owner:** Program Lead  
**Last Updated:** 2026-05-06  
**Review Frequency:** Quarterly or when roles change  

---

## Purpose

This document defines:
- Who owns each system and is responsible for operation
- Who makes decisions in each domain
- Who to contact when systems fail
- Escalation path for unresolved issues

---

## System Ownership Matrix

### Hosting Infrastructure (Vercel)

| Attribute | Value |
|---|---|
| **Primary Owner** | Platform Owner |
| **Backup Owner** | Frontend Lead |
| **Access Level** | Full (admin rights to Vercel dashboard) |
| **Responsibilities** | Provisioning, environment config, secrets management, deployment monitoring |
| **SLA Response** | 15 min acknowledgment for production issues |
| **Contact Info** | See [On-Call Rotation](#on-call-rotation) |

**System Details:**
- Vercel Organization: [TBD - provision during Phase 1]
- Vercel Projects: hvac-dev, hvac-staging, hvac-production
- Credentials Location: GitHub Secrets (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_IDs)

---

### Error Tracking (Sentry)

| Attribute | Value |
|---|---|
| **Primary Owner** | Platform Owner |
| **Backup Owner** | Frontend Lead |
| **Access Level** | Full (admin rights to Sentry project) |
| **Responsibilities** | Error dashboard management, alert thresholds, DSN generation |
| **SLA Response** | 5 min acknowledgment for error spike alerts |
| **Contact Info** | See [On-Call Rotation](#on-call-rotation) |

**System Details:**
- Sentry Organization: [TBD - provision during Phase 1]
- Sentry Project: hvac-prod (production only)
- DSN Credentials: Stored in Vercel environment variables (SENTRY_DSN_*)

---

### Uptime Monitoring (UptimeRobot)

| Attribute | Value |
|---|---|
| **Primary Owner** | Platform Owner |
| **Backup Owner** | QA Owner (can acknowledge alerts but not make changes) |
| **Access Level** | Full (admin rights to UptimeRobot account) |
| **Responsibilities** | Monitor configuration, alert delivery, status page management |
| **SLA Response** | 5 min acknowledgment for uptime alerts |
| **Contact Info** | See [On-Call Rotation](#on-call-rotation) |

**System Details:**
- UptimeRobot Account: Platform Owner account
- Monitors: Production (main), Staging, Dev (optional)
- Alert Channels: Slack (#production-alerts), Email

---

### CI/CD Pipelines (GitHub Actions)

| Attribute | Value |
|---|---|
| **Primary Owner** | Frontend Lead |
| **Backup Owner** | Platform Owner |
| **Access Level** | Full (admin rights to repository) |
| **Responsibilities** | Workflow maintenance, job debugging, runner configuration |
| **SLA Response** | 30 min acknowledgment for pipeline failures |
| **Contact Info** | See [On-Call Rotation](#on-call-rotation) |

**System Details:**
- Repository: Custom-Coding-Creations/hvac
- Workflows: deploy.yml, rollback.yml, ci.yml
- Branch Protection: Enabled on main (requires CI + 1 review approval)

---

### Production Website (Frontend)

| Attribute | Value |
|---|---|
| **Primary Owner** | Frontend Lead |
| **Backup Owner** | Platform Owner |
| **Access Level** | Full (can deploy, can rollback) |
| **Responsibilities** | Code quality, deployment decisions, rollback authority |
| **SLA Response** | Immediate (on-call engineer) for production issues |
| **Contact Info** | See [On-Call Rotation](#on-call-rotation) |

**System Details:**
- Live URL: https://hvac-app.vercel.app
- Staging URL: https://staging-hvac.vercel.app
- Dev URL: https://dev-hvac.vercel.app
- Code Repository: Custom-Coding-Creations/hvac

---

### Analytics & Conversion Tracking (GA4)

| Attribute | Value |
|---|---|
| **Primary Owner** | Analytics Lead (or Program Lead if no dedicated role) |
| **Backup Owner** | Frontend Lead |
| **Access Level** | Editor (can view reports, configure events) |
| **Responsibilities** | Event instrumentation validation, baseline establishment, anomaly investigation |
| **SLA Response** | 1 hour acknowledgment for metric anomalies |
| **Contact Info** | See [Contact Directory](#contact-directory) |

**System Details:**
- GA4 Property: [TBD - configure during Phase 1]
- Measurement IDs: [TBD per environment]
- Baseline Metrics: Defined in KPI-BASELINE-SHEET.md

---

### Database / Data Backups (If Applicable)

| Attribute | Value |
|---|---|
| **Primary Owner** | Platform Owner |
| **Backup Owner** | TBD (external provider or Platform Owner) |
| **Access Level** | Full |
| **Responsibilities** | Backup scheduling, restore testing, retention policy |
| **SLA Response** | 15 min for restore requests |
| **Contact Info** | See [On-Call Rotation](#on-call-rotation) |

**Note:** Currently not applicable (static HTML/CSS/JS site). If future database added, update this section.

---

## On-Call Rotation

### Current On-Call Schedule

**Primary On-Call Engineer (24/7 coverage):**
- **Name:** [TBD - Platform Owner or assigned delegate]
- **Phone:** [TBD]
- **Slack:** @platform-owner
- **Email:** [TBD]
- **Rotation:** Weekly (Monday-Sunday)

**Backup On-Call Engineer (escalation):**
- **Name:** [TBD - Frontend Lead or assigned delegate]
- **Phone:** [TBD]
- **Slack:** @frontend-lead
- **Email:** [TBD]

**On-Call Rotation Calendar:** [Link to shared calendar, e.g., Outlook, Google Calendar]

### On-Call Handoff Procedure

**Before Handing Off:**
1. Update shared on-call calendar with new engineer name
2. Brief incoming on-call about recent issues or known problems
3. Verify incoming on-call has Slack, GitHub, and monitoring dashboard access
4. Send incident summary to incoming on-call (if any incidents during your shift)

**Incoming On-Call Checklist:**
- [ ] Update Slack status: "On-call until [date/time]"
- [ ] Review recent incidents or alerts
- [ ] Check all monitoring dashboards show "healthy"
- [ ] Verify you can access GitHub, Sentry, UptimeRobot, Vercel
- [ ] Confirm backup on-call contact info

**End of Shift Handoff:**
- [ ] Post summary to #deployments: "On-call summary: 0 incidents, all systems healthy" (or list incidents)
- [ ] Update calendar to release yourself
- [ ] Remove on-call status from Slack
- [ ] Verify backup engineer acknowledged handoff

---

## Escalation Procedure

### Level 1: On-Call Engineer (Self-Service)

**Scope:** Can handle independently
- Routine deployments (after approval gate)
- Common alerts (monitor, document, resolve)
- Troubleshooting standard issues
- Triggering rollbacks
- Hotfix deployments

**When You're Stuck:** → Go to Level 2

### Level 2: Platform Owner

**Contact Info:**
- **Name:** [TBD - assign owner]
- **Phone:** [TBD]
- **Slack:** @platform-owner
- **Email:** [TBD]
- **Response SLA:** 15 minutes

**Scope:** Can handle
- Infrastructure decisions (server changes, network config)
- Deployment issues (workflow failures, deployment timeouts)
- Monitoring setup/changes
- Secrets management and rotation
- Vendor coordination (Vercel, Sentry support)

**When You're Stuck:** → Go to Level 3

### Level 3: Frontend Lead

**Contact Info:**
- **Name:** [TBD - assign owner]
- **Phone:** [TBD]
- **Slack:** @frontend-lead
- **Email:** [TBD]
- **Response SLA:** 15 minutes

**Scope:** Can handle
- Code debugging (why did code break in production?)
- Feature/design decisions during incident
- Deployment review and approval
- Testing strategy coordination

**When You're Stuck:** → Go to Level 4

### Level 4: Program Lead / Program Sponsor

**Contact Info (Program Lead):**
- **Name:** [TBD - assign owner]
- **Phone:** [TBD]
- **Slack:** @program-lead
- **Email:** [TBD]
- **Response SLA:** 30 minutes

**Contact Info (Program Sponsor - for business decisions):**
- **Name:** [TBD - assign owner]
- **Phone:** [TBD]
- **Slack:** @program-sponsor
- **Email:** [TBD]
- **Response SLA:** 1 hour

**Scope:** Can handle
- Business impact decisions (should we go live? should we pause marketing?)
- Stakeholder communication
- Executive escalation

---

## Contact Directory

### Direct Contacts by System

| System | Primary | Backup | Email | Phone |
|---|---|---|---|---|
| **Vercel/Hosting** | Platform Owner | Frontend Lead | [TBD] | [TBD] |
| **Sentry/Errors** | Platform Owner | Frontend Lead | [TBD] | [TBD] |
| **UptimeRobot/Uptime** | Platform Owner | QA Owner | [TBD] | [TBD] |
| **GitHub/CI-CD** | Frontend Lead | Platform Owner | [TBD] | [TBD] |
| **Production Website** | Frontend Lead | Platform Owner | [TBD] | [TBD] |
| **Analytics** | Analytics Lead | Frontend Lead | [TBD] | [TBD] |

### Emergency Contact List (Post at Desk)

```
🚨 EMERGENCY CONTACTS

PRIMARY ON-CALL:
Name: [TBD]
Phone: [TBD]
Slack: @on-call

PLATFORM OWNER:
Name: [TBD]
Phone: [TBD]
Slack: @platform-owner

PROGRAM LEAD:
Name: [TBD]
Phone: [TBD]
Slack: @program-lead

During business hours: Call on-call first
After hours: Call on-call + escalate to Platform Owner if no response in 5 min
```

---

## Decision Authority by Domain

### Deployment Decisions

| Decision | Authority | SLA |
|---|---|---|
| **Approve staging → production deploy** | Frontend Lead OR Platform Owner (either can approve) | 15 min |
| **Approve emergency hotfix deploy** | Platform Owner (primary), Frontend Lead (backup) | 5 min |
| **Trigger rollback** | On-call engineer (solo authority) | Immediate |
| **Approve post-mortem findings** | Frontend Lead + Platform Owner (joint) | 24 hours |

### Infrastructure Decisions

| Decision | Authority | SLA |
|---|---|---|
| **Change deployment environment config** | Platform Owner + Frontend Lead approval | 1 hour |
| **Rotate secrets/credentials** | Platform Owner | 1 hour |
| **Change monitoring thresholds** | Platform Owner + On-Call feedback | 30 min |
| **Add/remove production monitor** | Platform Owner + Frontend Lead approval | 2 hours |

### Security Decisions

| Decision | Authority | SLA |
|---|---|---|
| **Security incident response** | Platform Owner + Program Lead (joint) | Immediate |
| **Credential compromise** | Platform Owner (immediate action) | 5 min |
| **Security policy change** | Program Lead + Platform Owner + Frontend Lead | 1 hour for urgent |

---

## On-Call Checklists

### Start of Shift Checklist

```markdown
## On-Call Shift Start Checklist

Date: [date]
Time: [time] UTC
Shift Duration: 7 days / 24 hours (delete as appropriate)

### Access Verification
- [ ] Can access Slack (#production-alerts, #deployments)
- [ ] Can access GitHub (can view actions, trigger workflows)
- [ ] Can access Sentry (can view errors, configure alerts)
- [ ] Can access UptimeRobot (can view status)
- [ ] Can access Vercel (can view deployments)
- [ ] Can access GA4 (can view real-time metrics)

### System Health Check
- [ ] Sentry: no unresolved issues or current errors
- [ ] UptimeRobot: all monitors showing "UP"
- [ ] Vercel: last deployment "READY" (✅)
- [ ] GA4: real-time users showing traffic (if during business hours)
- [ ] GitHub: no failed CI runs

### Preparation
- [ ] Review incident runbooks (bookmarks ready)
- [ ] Note any ongoing issues from previous shift
- [ ] Verify phone is charged and nearby (if doing after-hours support)
- [ ] Post Slack status: "On-call: [shift dates]"

Ready to start: ✅
Questions/concerns: [list any]
```

### Hourly Check During Shift

```markdown
## Hourly Health Check

Time: [hourly]

- [ ] Spot-check production loads: https://hvac-app.vercel.app/
- [ ] Verify no new Sentry issues (any errors since last check?)
- [ ] Verify no failed UptimeRobot checks
- [ ] Scan #production-alerts for any missed alerts
- [ ] Check Vercel for any deployment issues

Status: ✅ All healthy / ⚠️ Minor issue: [describe] / 🚨 Critical: [describe]
```

### End of Shift Checklist

```markdown
## On-Call Shift End Checklist

Shift End Time: [time] UTC
Incoming On-Call: [name]

### Handoff Summary
- [ ] No unresolved incidents? (or document status)
- [ ] All systems healthy? (Sentry, UptimeRobot, Vercel, GitHub)
- [ ] Incoming on-call briefed? (phone call or detailed Slack message)
- [ ] Known issues communicated? (list any ongoing concerns)
- [ ] Calendar updated to show new on-call?

### Documentation
- [ ] Incident summary posted to #deployments (if applicable)
- [ ] All incidents logged in GitHub (if applicable)
- [ ] No action items left incomplete? (or handed off with notes)

Shift complete: ✅
Questions for incoming: [list any]
```

---

## System Access and Credentials

### Credential Storage Policy

**Primary Location:** GitHub Secrets (deployment credentials)  
**Secondary Location:** Vercel Environment Variables (runtime credentials)  
**Backup Location:** Password manager (team TBD - 1Password, LastPass, Bitwarden, etc.)

**Policy:**
- Never share credentials via Slack, email, or chat
- Always use password manager or GitHub Secrets
- Rotate credentials quarterly
- Revoke credentials immediately if compromised

### Required System Access (On-Call Engineer)

**Must Have:**
- [ ] GitHub organization member (repo access)
- [ ] GitHub personal access token (for automated scripts)
- [ ] Vercel account with production project access
- [ ] Sentry organization member
- [ ] UptimeRobot account (at least viewer access)
- [ ] GA4 account (viewer access)

**Nice to Have:**
- [ ] Slack admin (can manage channels)
- [ ] Incident tracking system admin (create/close issues)

### Access Request Process

**New Team Member or New On-Call Assignment:**
1. Contact Platform Owner (approval)
2. Platform Owner adds to GitHub team
3. Platform Owner adds to Vercel project
4. Platform Owner shares password manager invite
5. Verify access on day 1 of shift

---

## Runbook Links

- [Deployment Runbook](DEPLOYMENT-RUNBOOK.md) — How to deploy
- [Monitoring and Alerts Runbook](MONITORING-AND-ALERTS-RUNBOOK.md) — What alerts mean
- [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md) — How to respond to issues
- [CI/CD Workflow Documentation](CICD-WORKFLOW.md) — General CI/CD strategy

---

## Review and Updates

**Last Reviewed:** 2026-05-06  
**Next Review:** 2026-06-06 (or when roles change)  
**Reviewed By:** Program Lead + Platform Owner

**Update Trigger:** Update this document when:
- Team member changes role or assignment
- New system added (e.g., database, CDN)
- Escalation policy changes
- Contact information changes
- On-call schedule changes

---

## Feedback and Improvements

Found an issue with this document? Have a suggestion? Create an issue with the label `operational-feedback`.
