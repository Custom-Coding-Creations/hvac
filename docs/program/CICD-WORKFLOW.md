# CI/CD Workflow Documentation

**Version:** 1.0  
**Owner:** Frontend Lead + Platform Owner  
**Last Updated:** 2026-05-06

## Current State
- Pull request validation runs lint, stylelint, typecheck, tests, and build checks.
- Deployment automation to staging/production is pending environment provisioning.

## Target Workflow
1. Merge to main triggers deployment workflow.
2. Deploy to staging.
3. Run smoke checks.
4. Manual approval gate.
5. Deploy to production.
6. Post-deploy health checks.

## Rollback Workflow
1. Identify failing release.
2. Revert deployment to previous known-good revision.
3. Verify key pages and conversion events.
4. Publish incident note and root cause follow-up.

## Required Evidence For Gate D2
- [ ] One successful staging rollback drill.
- [ ] Measured rollback completion time.
- [ ] Runbook owner and on-call escalation contact.

## Required Evidence For Gate D1
- [ ] One successful staging deployment from main.
- [ ] One successful production deployment from main.
- [ ] Repeatable procedure validated by second operator.
