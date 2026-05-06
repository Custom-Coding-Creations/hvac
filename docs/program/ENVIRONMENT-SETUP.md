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
- [ ] Hosting provider selected and account created.
- [ ] DNS records created.
- [ ] TLS certificates configured.
- [ ] CI deploy credentials configured.
- [ ] Staging smoke test passed.
- [ ] Production smoke test passed.

## Evidence Required For Gate D1
- Environment URLs.
- Provisioning timestamp and owner.
- First successful deployment log.
