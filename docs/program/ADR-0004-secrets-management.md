# ADR-0004: Secrets Management Strategy

**Date:** 2026-05-06  
**Status:** ✅ Accepted  
**Deciders:** Platform Owner, Frontend Lead, Security Lead  
**Stakeholders:** All developers, DevOps team

---

## Context

The HVAC program requires secure handling of sensitive data:
- Vercel API tokens (for deployment)
- Sentry DSN (for error tracking)
- Analytics API keys
- CRM API credentials (for form submissions)
- Environment-specific configuration

Requirements:
- **No hardcoded secrets in code** (critical security requirement)
- **Separate secrets per environment** (dev/staging/prod isolation)
- **Automatic rotation support** (audit and renewal capability)
- **Least-privilege access** (only deployed application needs credentials)
- **Easy team management** (developers don't handle prod secrets directly)
- **Audit trail** (log access to secrets)

Evaluated solutions: AWS Secrets Manager, HashiCorp Vault, GitHub Secrets, Vercel environment variables, `.env` files (rejected), hardcoded (rejected).

---

## Decision

**Use GitHub Secrets (primary) + Vercel Environment Variables (secondary):**

1. **GitHub Secrets:** Store deployment credentials and CI/CD tokens
   - Stored at repository level
   - Accessible only to GitHub Actions workflows
   - Never exposed in logs or artifacts
   - Audit trail via GitHub Security tab

2. **Vercel Environment Variables:** Store runtime secrets (API keys, DSNs)
   - Stored in Vercel dashboard per deployment
   - Injected at deployment time
   - Not visible in source code
   - Separate values per environment (dev/staging/prod)

3. **No `.env` files in repository:** Never commit environment-specific secrets

---

## Rationale

### Why GitHub Secrets + Vercel Env Vars?

1. **Native to platform:** GitHub Actions is our CI/CD system; GitHub Secrets is built-in.
2. **Zero additional infrastructure:** No new tools to manage; no new services to configure.
3. **Automatic audit trail:** GitHub logs all secret access and usage in Security tab.
4. **Environment isolation:** Separate secrets per branch, environment, and workflow.
5. **Developer-friendly:** Easy UI in GitHub for managing secrets; no manual token passing.
6. **Vercel integration:** Vercel respects GitHub Secrets; can inject at build/deploy time.
7. **Low operational burden:** Team doesn't need to manage Vault or KMS infrastructure.

### Trade-offs Accepted

- **No automatic rotation:** Secrets don't auto-rotate. Mitigation: manual quarterly review and rotation.
- **GitHub lock-in:** Secrets stored in GitHub; can't easily migrate to other CI/CD. Mitigation: document secrets list; can recreate in new system.
- **No granular expiration:** Secrets don't expire automatically. Mitigation: set calendar reminders for quarterly rotation.

---

## Alternatives Considered

### 1. AWS Secrets Manager
- **Pros:** Enterprise-grade, automatic rotation, audit trail, encryption at rest.
- **Cons:** Requires AWS account setup, requires IAM configuration, overkill for project size, adds cost.
- **Status:** Rejected; too complex for small team, especially since using Vercel (not AWS) for hosting.

### 2. HashiCorp Vault
- **Pros:** Industry standard, automatic rotation, multi-cloud support, very secure.
- **Cons:** Self-hosted (operational burden) or SaaS (cost), steep learning curve, overkill.
- **Status:** Rejected; too complex, too costly.

### 3. `.env` Files (Rejected)
- **Pros:** Simple, widely used.
- **Cons:** **CRITICAL SECURITY ISSUE:** `.env` files accidentally committed = secrets exposed to world. Not acceptable.
- **Status:** Explicitly rejected; never use for production secrets.

### 4. Hardcoded Secrets (Rejected)
- **Pros:** Simple.
- **Cons:** **CRITICAL SECURITY ISSUE:** Secrets visible in code = immediate compromise.
- **Status:** Explicitly rejected; never use.

---

## Secrets Inventory and Management

### Required Secrets

| Secret | Type | Environment | Stored In | Rotation |
|---|---|---|---|---|
| `VERCEL_TOKEN` | Deployment credential | All | GitHub Secrets | Quarterly |
| `VERCEL_ORG_ID` | Account identifier | All | GitHub Secrets | Never (static) |
| `VERCEL_PROJECT_ID_STAGING` | Project ID | Staging | GitHub Secrets | Never (static) |
| `VERCEL_PROJECT_ID_PRODUCTION` | Project ID | Production | GitHub Secrets | Never (static) |
| `SENTRY_DSN_DEV` | Error tracking endpoint | Dev | Vercel Env Vars | Quarterly |
| `SENTRY_DSN_STAGING` | Error tracking endpoint | Staging | Vercel Env Vars | Quarterly |
| `SENTRY_DSN_PRODUCTION` | Error tracking endpoint | Production | Vercel Env Vars | Quarterly |
| `ANALYTICS_KEY_DEV` | Analytics API key | Dev | Vercel Env Vars | Quarterly |
| `ANALYTICS_KEY_STAGING` | Analytics API key | Staging | Vercel Env Vars | Quarterly |
| `ANALYTICS_KEY_PRODUCTION` | Analytics API key | Production | Vercel Env Vars | Quarterly |
| `CRM_API_KEY_PRODUCTION` | CRM form submission API | Production | Vercel Env Vars | Quarterly |

### Secrets Storage Location Decision Tree

```
Does secret need to be available
during GitHub Actions workflow?
├─ Yes → GitHub Secrets
└─ No → Vercel Environment Variables
```

**Examples:**
- Vercel Token: Needed in workflow → GitHub Secrets
- Sentry DSN: Needed at runtime → Vercel Env Vars
- Analytics Key: Needed at runtime → Vercel Env Vars

---

## Implementation

### GitHub Secrets Setup

1. Go to repository Settings → Secrets and variables → Actions
2. Create repository secrets (NOT environment secrets, use "New repository secret"):
   - `VERCEL_TOKEN` - Generate in Vercel dashboard (Settings → Tokens)
   - `VERCEL_ORG_ID` - Copy from Vercel project settings
   - `VERCEL_PROJECT_ID_STAGING` - Copy from Vercel staging project
   - `VERCEL_PROJECT_ID_PRODUCTION` - Copy from Vercel production project
3. DO NOT commit any `.secrets.json` or similar files

### Vercel Environment Variables Setup

1. Log into Vercel dashboard
2. For each project (staging, production):
   - Go to Settings → Environment Variables
   - Add each variable per environment:
     ```
     SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
     ANALYTICS_KEY=abc123...
     CRM_API_KEY=xyz789...
     ```
   - Mark Production variables as "System environment variables" (encrypted at rest)
3. Verify in Deployment logs that env vars are NOT exposed (✅ masked)

### Secrets in Code (Strict Policy)

**NEVER:**
- ❌ `const API_KEY = 'sk-1234...'` (hardcoded)
- ❌ Store secrets in `.env`, `config.js`, or any file
- ❌ Pass secrets through command-line arguments
- ❌ Log secrets to console or files

**ALWAYS:**
- ✅ Read secrets from `process.env` at runtime
- ✅ Define expected env vars at top of file with documentation
- ✅ Validate required env vars exist at startup (fail fast)
- ✅ Use secrets scanning tools in CI to detect and block accidental commits

### Rotation Schedule

| Secret Type | Rotation Frequency | Procedure |
|---|---|---|
| Vercel Token | Quarterly (or immediately if leaked) | Generate new in Vercel → update GitHub Secrets → test deploy |
| Sentry DSN | Quarterly | Rotate in Sentry → update Vercel Env Vars → redeploy |
| API Keys | Quarterly | Rotate in respective service → update Vercel Env Vars → redeploy |

**Rotation Reminders:**
- Add calendar event for "Secrets Rotation" every quarter (2026-08-06, 2026-11-06, etc.)
- Platform Owner reviews and executes rotation

---

## Security Policies

### Access Control

- **GitHub Secrets:** Only GitHub Actions workflows (no human access)
- **Vercel Env Vars:** Only Vercel deployment process (no human access)
- **Read Actual Secrets:** Platform Owner and SRE only (on-demand, logged)

### Secret Exposure Response (If Compromised)

**Immediate (within 1 hour):**
1. Rotate exposed secret in source system (Vercel, Sentry, etc.)
2. Update GitHub Secrets or Vercel Env Vars
3. Trigger new deployment to activate rotated secret
4. Delete old secret from source system
5. Document incident in security log

**Follow-up (within 24 hours):**
1. Review logs to see if compromised secret was used
2. Post incident review to determine exposure vector
3. Implement controls to prevent re-exposure
4. Communicate findings to team

### CI/CD Secret Scanning

GitHub Actions workflow includes automatic secret scanning step:
```yaml
- name: Check for hardcoded secrets
  run: |
    grep -r "api_key\s*=" frontend/ && exit 1
    grep -r "password\s*=" frontend/ && exit 1
    grep -r "token\s*=" frontend/ && exit 1
```

This catches common secret patterns in code before they're committed.

---

## Verification

- ✅ GitHub Secrets configured for all deployment credentials
- ✅ Vercel Env Vars configured for all runtime secrets
- ✅ No `.env` files in repository (add to `.gitignore` if accidentally created)
- ✅ Secret scanning passes in CI (no hardcoded secrets detected)
- ✅ Test deployment succeeds with secrets injected from GitHub Secrets
- ✅ Runtime test confirms Sentry/Analytics keys working from Vercel Env Vars
- ✅ Audit log checked: no human access to production secrets

---

## Review and Approval

**Proposed:** 2026-05-06  
**Approved:** [Platform Owner + Security Lead signature]  
**Review Date:** 2026-06-06 (first rotation audit)

---

## Related Decisions

- **ADR-0002:** Hosting Platform Selection (Vercel)
- **ADR-0003:** Monitoring and Alerting Stack (Sentry DSN storage)
- **D-008:** Branch Protection Policy
- **D-009:** Secrets Management Policy Enforcement

---

## References

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [CI/CD Workflow Documentation](../CICD-WORKFLOW.md)
