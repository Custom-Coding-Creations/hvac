# ADR-0001: Platform Decision Deferred With Portable Static Baseline

## Date
2026-05-06

## Status
Accepted

## Context
The team must progress frontend implementation while platform hosting/CMS choice is still being finalized.

## Decision
Use a portable static baseline (HTML/CSS/JS) as the implementation source, and defer final runtime platform decision until infrastructure evaluation is complete.

## Consequences
- Positive: Frontend delivery, QA, and conversion validation proceed immediately.
- Positive: Future migration risk is reduced because templates are platform-agnostic.
- Negative: Deployment automation and production operations remain blocked until platform provisioning is complete.

## Alternatives Considered
- Build directly in WordPress from day one.
- Pause frontend development until platform is selected.

## Follow-up Actions
1. Finalize platform selection with owner approval.
2. Provision staging and production environments.
3. Implement deployment and rollback workflows against chosen platform.
