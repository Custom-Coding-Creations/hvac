# Risk Register

| Risk ID | Category | Description | Trigger Condition | Likelihood | Impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | Scope | Issue numbering and scope drift cause misaligned deliverables. | Governance and implementation artifacts diverge from acceptance criteria. | Medium | High | Maintain single governance index and weekly scope confirmation. | Program Lead | Open |
| R-002 | Data | KPI baselines are estimate-based and may shift after instrumentation. | First 2 weeks of real event data differ by more than 20 percent. | High | Medium | Mark estimates explicitly and update baseline after instrumentation freeze. | Analytics Lead | Open |
| R-003 | UX | Conversion flows underperform due to insufficient intent segmentation. | Form completion rate below 35 percent after launch week. | Medium | High | Maintain short and long form options by intent and monitor drop-off steps. | UX Owner | Open |
| R-004 | Accessibility | Keyboard and screen-reader issues block usable conversion paths. | Any critical journey cannot complete without pointer device. | Medium | High | Mandatory accessibility checklist and pre-launch keyboard walkthrough. | QA Owner | Open |
| R-005 | Frontend Quality | Ad-hoc CSS drift reduces consistency and maintainability. | New components ship without token references or checklist sign-off. | Medium | Medium | Tokenized CSS variables and QA checklist gate. | Frontend Lead | Open |
| R-006 | Technical | JS error budget exceeded under real traffic conditions. | Errors exceed 8 per 1000 sessions for two consecutive days. | Medium | High | Add client-side guardrails and prioritize top error classes in weekly review. | Frontend Lead | Open |
| R-007 | Dependency | Missing Issue 2 and Issue 3 artifacts reduce traceability confidence. | Template implementation cannot map to artifact references. | Medium | High | Bootstrap minimum IA/design artifacts in-repo before continuing implementation. | Program Lead | Mitigated |
