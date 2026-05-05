# Decision Log

## Decision Template
| Decision ID | Date | Owner | Decision | Rationale | Impact | Status |
| --- | --- | --- | --- | --- | --- | --- |
| D-000 | YYYY-MM-DD |  |  |  |  | Proposed/Approved/Superseded |

## Initialized Decisions

| Decision ID | Date | Owner | Decision | Rationale | Impact | Status |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 | 2026-05-05 | Program Lead | Use Potter-Perrone as phase-1 entity baseline. | Existing audited data and ROI assumptions are complete enough for immediate KPI baseline. | Enables measurable start without waiting for multi-entity normalization. | Approved |
| D-002 | 2026-05-05 | Frontend Lead | Implement a reusable static frontend baseline (HTML/CSS/JS) for core templates and interactions. | Repo has no runtime stack committed yet; static baseline enables traceable implementation and QA. | Provides production-structured frontend artifacts while architecture stream finalizes runtime choice. | Approved |
| D-003 | 2026-05-05 | Program Sponsor | Require two conversion paths per core template before launch readiness can pass. | Aligns to conversion objective and Issue 2 acceptance language. | Prevents single-path template release that suppresses conversion coverage. | Approved |
| D-004 | 2026-05-05 | QA Owner | Enforce WCAG 2.1 AA checks on contrast, focus, labels, keyboard nav, and error states. | Accessibility failures are conversion and trust failures. | Blocks launch if accessibility gates are unmet. | Approved |
