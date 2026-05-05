# Go/No-Go Criteria And Escalation Authority

## Authority
- Primary authority: Program Sponsor.
- Technical co-authority: Frontend Lead.
- Quality veto authority: QA Owner.

## Gate A: Governance Readiness (Must Pass)
- KPI baseline sheet complete with formula, owner, baseline, 30-day, 90-day target for all KPI groups.
- Weekly operating review cadence assigned and active.
- Decision log and risk register initialized and in use.

## Gate B: Template And Conversion Readiness (Must Pass)
- Core templates delivered: homepage, service, location, emergency.
- Each core template includes at least two distinct conversion paths.
- Click-to-call behavior verified on mobile and desktop.
- Form states verified: default, focus, error, success, loading.

## Gate C: Technical And Quality Readiness (Must Pass)
- LCP p75 <= 2.5s on target pages.
- CLS p75 <= 0.10 and INP p75 <= 200ms.
- JS error budget <= 3 per 1000 sessions.
- Accessibility pass rate >= 95 percent on defined checklist.
- Responsive QA passed for 360, 768, 1024, 1440 viewports.

## Go/No-Go Rule
- Go if all gates pass and no open High impact risk is unresolved.
- No-Go if any mandatory gate fails or any unresolved High impact risk remains.

## Escalation Protocol
1. Owner logs failing criterion with timestamp in weekly review notes.
2. Program Lead triggers same-day triage.
3. If unresolved in 24 hours, escalate to Program Sponsor.
4. Go/No-Go decision is documented in decision log with rationale and impact.
