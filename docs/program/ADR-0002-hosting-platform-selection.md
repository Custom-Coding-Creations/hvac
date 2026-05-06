# ADR-0002: Hosting Platform Selection (Vercel)

**Date:** 2026-05-06  
**Status:** ✅ Accepted  
**Deciders:** Platform Owner, Frontend Lead  
**Stakeholders:** Program Lead, QA Owner

---

## Context

The HVAC program requires a production-ready hosting platform for dev, staging, and production environments. Key requirements:

- **Zero-ops overhead** suitable for small teams
- **Static HTML/CSS/JS** support (portable baseline per ADR-0001)
- **Fast deployments** with GitHub integration
- **Affordable** at scale
- **Automatic rollback** capability for high-risk deployments
- **Environment isolation** (dev/staging/prod with separate URLs)
- **No custom backend required** (form submissions handled externally)

Evaluated platforms: GitHub Pages, Netlify, Vercel, AWS (S3 + CloudFront), Google Cloud (Firebase Hosting, Cloud Run).

---

## Decision

**Use Vercel as primary hosting platform** for all three environments (dev, staging, production).

**Fallback:** GitHub Pages for production-only (if Vercel licensing becomes prohibitive).

---

## Rationale

### Why Vercel?

1. **Zero-ops deployment:** Push to main → automated Vercel deployment. No manual infrastructure management.
2. **Free tier sufficient:** Staging and development unlimited; production scales within free tier limits for this site.
3. **GitHub integration:** Native GitHub Actions support, environment secrets, deployment buttons.
4. **Environment management:** Built-in preview deployments (staging), production alias, rollback via deployment history.
5. **Performance:** Global CDN, automatic image optimization, edge functions (if needed later).
6. **Team-friendly:** Simple UI for non-engineers to view deployments and trigger rollbacks via web interface.

### Trade-offs Accepted

- **Vendor lock-in:** Mitigated by portable HTML/CSS/JS baseline; can migrate to GitHub Pages or AWS with minimal effort.
- **Pricing:** Free tier may require paid plan at scale (acceptable given current project size).
- **Limited customization:** No custom backend (acceptable; form handling external).
- **API rate limits:** Sufficient for small team workflow.

---

## Alternatives Considered

### 1. GitHub Pages
- **Pros:** Simpler, free, direct GitHub integration.
- **Cons:** Limited features (no environment management, staging harder to set up), static only, less polished.
- **Status:** Fallback option; viable but less feature-rich.

### 2. Netlify
- **Pros:** Similar to Vercel, free tier, good developer experience.
- **Cons:** Very similar to Vercel; chosen Vercel for slightly better GitHub integration.
- **Status:** Acceptable alternative; either would work.

### 3. AWS (S3 + CloudFront + Lambda)
- **Pros:** Full control, low cost at scale, enterprise-grade.
- **Cons:** Requires ops expertise (Terraform/CloudFormation), higher barrier for small team, overkill for this project.
- **Status:** Rejected as too complex.

### 4. Google Cloud (Firebase Hosting / Cloud Run)
- **Pros:** Good integration with Google services, free tier available.
- **Cons:** Less streamlined than Vercel for static sites; Firebase Hosting less mature than Vercel/Netlify.
- **Status:** Acceptable alternative; Vercel chosen for better UX.

---

## Consequences

### Positive

1. ✅ **Immediate time-to-production:** Deploy within hours, not days/weeks.
2. ✅ **Automatic staging:** Preview deployments (PRs, branches) automatically available.
3. ✅ **Easy rollback:** One-click rollback via Vercel dashboard + automated rollback in workflows.
4. ✅ **Secrets management:** GitHub Secrets + Vercel environment variables = no hardcoded credentials.
5. ✅ **Monitoring integration:** Vercel deployment events feed to monitoring dashboards (Sentry, UptimeRobot).
6. ✅ **Cost-effective:** Free tier covers current needs; scales predictably.

### Negative

1. ⚠️ **Vendor lock-in:** Site runs on Vercel; migration to another platform requires effort.
   - **Mitigation:** HTML/CSS/JS baseline remains portable; can redeploy to GitHub Pages or AWS.
2. ⚠️ **Feature constraints:** No custom backend; form handling external.
   - **Mitigation:** Acceptable for current program scope (forms → CRM via API).
3. ⚠️ **Pricing changes:** Vercel pricing may increase or features may be restricted.
   - **Mitigation:** Monitor pricing annually; GitHub Pages fallback available.

---

## Implementation

### Vercel Setup (One-time)

1. Create Vercel account (Team plan recommended for small team)
2. Link GitHub repository
3. Configure environment variables per environment:
   - **Development:** Dev-specific API endpoints, analytics token (dev)
   - **Staging:** Staging API endpoints, analytics token (staging)
   - **Production:** Production API endpoints, analytics token (production)
4. Generate Vercel API token and store in GitHub Secrets

### Deployment Pipeline

- **GitHub Actions workflow (`deploy.yml`)** triggers on `main` push
- Deploy to staging automatically
- Manual approval gate before production
- Health checks post-deploy
- Automatic rollback on health check failure

### Environment Mapping

| Environment | Vercel Project | URL | Access |
|---|---|---|---|
| Dev | hvac-dev | https://dev-hvac.vercel.app | Team (internal) |
| Staging | hvac-staging | https://staging-hvac.vercel.app | Team + stakeholders |
| Production | hvac-prod | https://hvac-app.vercel.app | Public |

---

## Verification

- ✅ All three environments provisioned and accessible
- ✅ Vercel tokens stored in GitHub Secrets
- ✅ Deploy workflow pushes to all three environments
- ✅ Rollback tested and verified <5 min completion time
- ✅ TLS certificates active on all domains

---

## Review and Approval

**Proposed:** 2026-05-06  
**Approved:** [Platform Owner signature]  
**Review Date:** 2026-06-06 (quarterly review recommended)

---

## Related Decisions

- **ADR-0001:** Platform Decision Deferred With Portable Static Baseline
- **D-008:** Branch Protection Policy (GitHub)
- **D-009:** Secrets Management Strategy (GitHub Secrets + Vercel Env Vars)
- **D-010:** Rollback Strategy and Approval Gates

---

## References

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [Environment Setup Documentation](../ENVIRONMENT-SETUP.md)
- [CI/CD Workflow Documentation](../CICD-WORKFLOW.md)
