# CI/CD Workflow Documentation

**Version:** 1.0  
**Owner:** Frontend Lead + Platform Owner  
**Last Updated:** 2026-05-06

## Current State ✅ IMPLEMENTED

**CI Pipeline (.github/workflows/ci.yml):**
- Pull request validation runs lint, stylelint, typecheck, tests, security checks
- HTML/CSS/JS structure validation
- No debug artifacts, no hardcoded secrets
- Build gate verifies templates and JS syntax

**Deployment Pipeline (.github/workflows/deploy.yml):**
- Automatic on merge to main
- Deploy to staging (immediate)
- Manual approval gate (Frontend Lead or Platform Owner required)
- Deploy to production (after approval)
- Post-deploy health checks with auto-rollback

**Rollback Pipeline (.github/workflows/rollback.yml):**
- Manual dispatch from GitHub UI
- Redeploy previous successful commit
- Health checks verify rollback success
- <5 minute rollback SLA

## Implemented Workflow ✅
1. ✅ Merge to main triggers deploy.yml workflow
2. ✅ CI validation runs (lint, test, build, security checks)
3. ✅ Deploy to staging (Vercel)
4. ✅ Run smoke tests (pages load, CTAs work)
5. ✅ Manual approval gate (Frontend Lead or Platform Owner)
6. ✅ Deploy to production (Vercel)
7. ✅ Post-deploy health checks (HTTP 200, page structure valid)
8. ✅ Auto-rollback on health check failure

See [Deployment Runbook](DEPLOYMENT-RUNBOOK.md) and [ADR-0002: Hosting Platform](ADR-0002-hosting-platform-selection.md)

## Rollback Workflow ✅ IMPLEMENTED
1. ✅ Automatic: Health checks fail post-deploy → auto-rollback to previous commit
2. ✅ Manual: On-call engineer triggers rollback.yml workflow anytime
3. ✅ Rollback deploys previous successful commit to production
4. ✅ Verify key pages load and conversions resuming (check Sentry error rate)
5. ✅ Publish incident note and schedule post-mortem

**Rollback SLA: <5 minutes** from decision to production (verified in drills)

See [ADR-0005: Rollback Strategy](ADR-0005-rollback-strategy.md) and [Incident Response Runbook](INCIDENT-RESPONSE-RUNBOOK.md)

## Evidence For Gate D1 ✅ COMPLETE
- [x] First successful staging deployment from main (logged in qa/DEPLOYMENT-EVIDENCE.md)
- [x] First successful production deployment from main (logged in qa/DEPLOYMENT-EVIDENCE.md)
- [x] Repeatable procedure validated by second operator (pair deployment recorded)
- [x] Deployment workflow automated (no manual steps post-approval)
- [x] Health checks passed post-deploy
- [x] CI pipeline required for all merges to main
- [x] Code review approval required (branch protection enabled)

**Status: ✅ Gate D1 PASSED**

## Evidence For Gate D2 ✅ COMPLETE
- [x] Rollback drill completed on staging (see qa/ROLLBACK-DRILL-EVIDENCE.md)
- [x] Rollback completion time measured: <5 minutes ✅
- [x] Runbook owner assigned: Platform Owner
- [x] On-call escalation defined (see OPERATIONAL-OWNERSHIP.md)
- [x] Rollback procedure tested and verified working
- [x] Health checks validated post-rollback
- [x] Team trained on rollback procedures

**Status: ✅ Gate D2 PASSED**
