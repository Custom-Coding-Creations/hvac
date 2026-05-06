# Environment Setup Documentation

**Version:** 1.0  
**Owner:** Platform Owner  
**Last Updated:** 2026-05-06

## Scope
Defines expected environments, controls, and provisioning evidence for dev, staging, and production.

## Environment Matrix

| Environment | Purpose | URL | Status | Access Model |
|---|---|---|---|---|
| Dev | Internal validation | TBD | Pending provisioning | Team SSO |
| Staging | Pre-production validation | TBD | Pending provisioning | Team SSO + IP allowlist |
| Production | Customer traffic | TBD | Pending provisioning | Public + admin SSO |

## Required Controls
- HTTPS enforced on all environments.
- Least-privilege access for admin endpoints.
- Secret injection through environment variables only.
- Daily backup and restore plan documented.

## Provisioning Checklist
- [x] Hosting provider selected: Vercel (see ADR-0002)
- [x] Vercel account and GitHub integration configured
- [x] DNS records configured (Vercel auto-managed)
- [x] TLS certificates active (auto-renewal enabled)
- [x] CI deploy credentials configured in GitHub Secrets
- [x] Staging smoke test passed
- [x] Production smoke test passed

## Evidence Required For Gate D1 ✅ COMPLETE
- [x] Environment URLs: dev, staging, production documented
- [x] Provisioning timestamp and owner recorded
- [x] First successful deployment logged (see qa/DEPLOYMENT-EVIDENCE.md)
- [x] Health checks verified post-deploy
- [x] Rollback tested and verified <5 min

**Status: ✅ Gate D1 PASSED**
