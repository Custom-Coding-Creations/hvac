# Governance Directory Deprecation Notice

**Status:** DEPRECATED  
**Superseded By:** `docs/program/`  
**Effective Date:** 2026-05-06  

---

## Notice

The files in this directory (`governance/`) are legacy artifacts from the initial governance bootstrap and have been **superseded** by the canonical governance package located in `docs/program/`.

Do not update or reference these files for ongoing work.

---

## Migration Map

| This File (Legacy) | Canonical Replacement |
|---|---|
| `PROGRAM-CHARTER-v1.md` | `docs/program/PROGRAM-CHARTER.md` |
| `KPI-BASELINE-SHEET-v1.md` | `docs/program/KPI-BASELINE-SHEET.md` |
| `GO-NO-GO-CRITERIA.md` | `docs/program/GO-NO-GO-CRITERIA.md` |
| `RISK-REGISTER.md` | `docs/program/RISK-REGISTER.md` |
| `DECISION-LOG.md` | `docs/program/DECISION-LOG.md` |
| `WEEKLY-OPERATING-REVIEW-TEMPLATE.md` | `docs/program/WEEKLY-REVIEW-TEMPLATE.md` |

---

## CI/CD Impact

The GitHub Actions `check-documentation` job enforces the **canonical** `docs/program/` paths. The legacy files in this directory are **not checked** by CI and **not required** for any launch gate.
