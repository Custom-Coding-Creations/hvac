# Security Baseline Checklist

**Version:** 1.0  
**Owner:** Frontend Lead + Platform Owner  
**Last Updated:** 2026-05-06

## Application Controls (Implemented)
- [x] Form input validation for required, email, phone, ZIP fields.
- [x] No hardcoded secrets in frontend runtime code.
- [x] Accessibility-safe error and success messaging.

## Infrastructure Controls (Pending Provisioning)
- [ ] HTTPS redirect and HSTS enabled.
- [ ] Security headers set (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy).
- [ ] WAF/rate limiting policy enabled.
- [ ] Log retention and audit policy configured.

## Monitoring Controls (Pending)
- [ ] Uptime check configured and alert route tested.
- [ ] JavaScript error tracking configured and alert route tested.
- [ ] Incident response contact chain documented.

## Gate D4 Evidence Requirements
- Header validation output for staging and production.
- Alert test screenshots or logs.
- Owner sign-off date for each control category.
