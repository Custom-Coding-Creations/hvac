# HVAC Website Program

**Program Name:** HVAC Website Performance & Delivery Program  
**Status:** Active Development  
**Last Updated:** 2026-05-06  

---

## 🎯 Quick Start

### For New Team Members
1. Read the **[Program Charter](docs/program/PROGRAM-CHARTER.md)** to understand objectives, scope, and governance
2. Review the **[KPI Baseline Sheet](docs/program/KPI-BASELINE-SHEET.md)** to understand success metrics
3. Check **[Go/No-Go Criteria](docs/program/GO-NO-GO-CRITERIA.md)** for current launch readiness status
4. Explore **[Frontend Implementation Guide](frontend/IMPLEMENTATION-GUIDE.md)** for technical overview

### For Developers
1. **[Frontend Templates](frontend/templates/)** - Homepage, service, location, emergency page templates
2. **[Design System](design-system/)** - Tokens, components, accessibility standards
3. **[Implementation Guide](frontend/IMPLEMENTATION-GUIDE.md)** - Setup, build, and integration instructions
4. **[Security Guidelines](SECURITY.md)** - Security best practices and requirements

### For Product/Business
1. **[Program Charter](docs/program/PROGRAM-CHARTER.md)** - Business outcomes and success criteria
2. **[KPI Baseline Sheet](docs/program/KPI-BASELINE-SHEET.md)** - Business, conversion, and technical KPIs
3. **[UX Journey Maps](ux/JOURNEY-MAPS-v1.md)** - User journey design for key conversion paths
4. **[IA Sitemap](ux/IA-SITEMAP-v1.md)** - Information architecture and URL structure

---

## 📚 Documentation Structure

### 🏛️ Program Governance (`docs/program/`)
**Central governance and operating model for all website work**

- **[Program Documentation Index](docs/program/README.md)** - Full governance documentation index
- **[Program Charter](docs/program/PROGRAM-CHARTER.md)** - Objectives, scope, roles, decision authority
- **[KPI Baseline Sheet](docs/program/KPI-BASELINE-SHEET.md)** - 19 KPIs with formulas, baselines, targets
- **[Weekly Review Template](docs/program/WEEKLY-REVIEW-TEMPLATE.md)** - Operating review meeting structure
- **[Decision Log](docs/program/DECISION-LOG.md)** - All program decisions with rationale and approvals
- **[Risk Register](docs/program/RISK-REGISTER.md)** - 10 active risks with mitigation strategies
- **[Go/No-Go Criteria](docs/program/GO-NO-GO-CRITERIA.md)** - Launch readiness gates and decision framework

### 🎨 Design System (`design-system/`)
**Visual design language, components, and accessibility standards**

- **[Design System Overview](design-system/README.md)** - Full design system documentation
- **[Design Tokens](design-system/TOKENS.md)** - Color, typography, spacing, motion primitives
- **[Component Specifications](design-system/COMPONENT-SPECS.md)** - 22 components with 77 interaction states
- **[Component Inventory](design-system/COMPONENT-INVENTORY.md)** - Component catalog and reuse matrix
- **[Accessibility Contrast Matrix](design-system/ACCESSIBILITY-CONTRAST-MATRIX.md)** - WCAG 2.1 AA compliance evidence
- **[Responsive Grid Rules](design-system/RESPONSIVE-GRID-RULES.md)** - Breakpoints, container, spacing rhythm
- **[Design QA Checklist](design-system/DESIGN-QA-CHECKLIST.md)** - Quality assurance validation
- **[Mockup Specifications](design-system/MOCKUP-SPECS.md)** - High-fidelity template specifications

### 🗺️ UX and Information Architecture (`ux/`)
**User journeys, conversion strategy, and site structure**

- **[IA Sitemap](ux/IA-SITEMAP-v1.md)** - 19 URLs with hierarchy and intent clustering
- **[Journey Maps](ux/JOURNEY-MAPS-v1.md)** - Emergency, estimate, financing conversion paths
- **[Conversion UX Blueprint](ux/CONVERSION-UX-BLUEPRINT-v1.md)** - Persistent CTA strategy and form architecture
- **[Wireframe Specifications](ux/WIREFRAME-SPECS-v1.md)** - Template wireframes for all 4 core pages

### 💻 Frontend Implementation (`frontend/`)
**Production-ready HTML/CSS/JS templates and shared systems**

- **[Implementation Guide](frontend/IMPLEMENTATION-GUIDE.md)** - Setup, build, integration, and deployment
- **[Component Reference](frontend/components/README.md)** - HTML patterns and usage examples
- **Templates:**
  - [Homepage](frontend/templates/homepage.html) - 176 lines, hero + services + financing + reviews + FAQ
  - [Service Template](frontend/templates/service-template.html) - 174 lines, breadcrumbs + symptoms + process + trust
  - [Location Template](frontend/templates/location-template.html) - 139 lines, local coverage + reviews + FAQ
  - [Emergency Landing](frontend/templates/emergency-landing.html) - 123 lines, urgent CTA + short form
- **Shared Systems:**
  - [CSS System](frontend/assets/css/system.css) - 505 lines, tokenized styles
  - [JavaScript System](frontend/assets/js/system.js) - 203+ lines, nav + forms + accordion + analytics

### ✅ Quality Assurance (`qa/`)
**Testing evidence, validation, and traceability**

- **[Before/After Evidence](qa/BEFORE-AFTER-EVIDENCE.md)** - Implementation scope proof
- **[Functional Checks](qa/FUNCTIONAL-CHECKS.md)** - Navigation, forms, CTAs, accordions tested
- **[Accessibility & Responsive QA](qa/ACCESSIBILITY-RESPONSIVE-QA.md)** - WCAG and viewport testing
- **[Traceability Matrix](qa/ISSUE-2-3-TRACEABILITY-MATRIX.md)** - Requirements mapped to evidence

### 🔒 Security (`SECURITY.md`)
**Security guidelines and best practices**

- Input validation requirements
- HTTPS enforcement
- Security headers
- Secrets management
- Error handling

### 📊 Business Development (`docs/`)
**Market research, prospect analysis, and ROI data**

- Website analysis and ROI research
- Prospect tracking and scoring
- Syracuse market opportunity
- Outreach templates

---

## 🚦 Current Program Status

### Overall Health
- **Delivery:** 🟡 At Risk - Infrastructure gaps block production launch
- **Scope:** 🟢 Stable - All deliverables defined and tracked
- **Quality:** 🟢 Pass - Frontend and governance artifacts complete
- **Timeline:** 🟡 Minor Slip - Awaiting infrastructure provisioning

### Launch Readiness Gates
| Gate | Status | Details |
|------|--------|---------|
| **A: Governance** | ✅ PASS | Program charter, KPIs, decision log, risk register, weekly reviews |
| **B: Templates & Conversion** | ✅ PASS | 4 templates, 3-4 conversion paths each, all states verified |
| **C: Technical & Quality** | ⚠️ CONDITIONAL | Accessibility pass, responsive pass, CWV pending staging validation |
| **D: Infrastructure** | ❌ FAIL | **BLOCKER** - Environments, deployment, rollback, monitoring not configured |
| **E: Documentation** | ✅ PASS | All artifacts documented and traceable |

**Production Launch Status:** ⛔ **NO-GO** (Gate D blockers must be resolved)

**Staging Launch Status:** ⚠️ **CONDITIONAL GO** (pending environment provisioning)

### Critical Action Items
1. ⚠️ **Provision staging and production environments** (Platform Owner, P0, 2-3 days)
2. ⚠️ **Configure monitoring and alerting** (Platform Owner, P0, 1-2 days)
3. ⚠️ **Test deployment and rollback procedures** (Platform Owner, P0, 1 day)
4. ⚠️ **Create architecture documentation** (Frontend Lead, P1, 1-2 days)

See **[Risk Register](docs/program/RISK-REGISTER.md)** for R-009 (Deployment/Rollback) and R-010 (Monitoring) details.

---

## 📈 Key Performance Indicators (KPIs)

### Business KPIs (Monthly)
- **Lead Volume:** 36 → 54 (30d) → 90 (90d) leads/month
- **Qualified Lead Rate:** 32% → 36% (30d) → 42% (90d)
- **Booked Jobs:** 12 → 17 (30d) → 29 (90d) jobs/month
- **Revenue Per Visitor:** $13.07 → $18.00 (30d) → $24.00 (90d)
- **CAC Proxy:** $420 → $360 (30d) → $300 (90d)

### Conversion KPIs (Weekly)
- **Form Completion Rate:** 28% → 40% (30d) → 52% (90d)
- **Click-to-Call CTR:** 1.8% → 3.0% (30d) → 4.5% (90d)
- **Chat-to-Lead Rate:** 10% → 16% (30d) → 22% (90d)

### Technical KPIs (Weekly)
- **Core Web Vitals Pass Rate:** 35% → 70% (30d) → 90% (90d)
- **LCP p75:** 4.2s → ≤3.0s (30d) → ≤2.5s (90d)
- **CLS p75:** 0.19 → ≤0.12 (30d) → ≤0.10 (90d)
- **INP p75:** 280ms → ≤220ms (30d) → ≤200ms (90d)
- **Uptime SLA:** 99.0% → 99.5% (30d) → 99.9% (90d)
- **Accessibility Score:** 74% → 88% (30d) → 95% (90d)
- **JS Error Budget:** 14 → ≤8 (30d) → ≤3 (90d) errors per 1000 sessions

Full definitions, formulas, and measurement methods in **[KPI Baseline Sheet](docs/program/KPI-BASELINE-SHEET.md)**.

---

## 🏗️ Technology Stack

### Frontend (Current - Static Baseline)
- **HTML5** - Semantic markup with ARIA support
- **CSS3** - Custom properties (CSS variables), mobile-first responsive design
- **Vanilla JavaScript** - ES6+, no framework dependencies
- **No Build Required** - Can be served as static files or integrated into any platform

### Frontend (Recommended for Production)
- **Platform:** WordPress + Bricks Builder (or documented alternative - see Risk R-008)
- **Hosting:** TBD (Netlify, Vercel, or WordPress-optimized hosting recommended)
- **Analytics:** Google Analytics 4 (to be instrumented)
- **Monitoring:** UptimeRobot or Pingdom (to be configured)
- **Error Tracking:** Sentry or GA4 exceptions (to be configured)

### CI/CD
- **GitHub Actions** - Lint, test, build validation on all PRs
- **Deployment** - TBD (pending environment provisioning)

See **[Go/No-Go Criteria](docs/program/GO-NO-GO-CRITERIA.md)** Gate D for infrastructure requirements.

---

## 🎓 Acceptance Criteria Status

### Issue 2: UX and IA Blueprint
- ✅ IA sitemap with URL hierarchy and intent clustering
- ✅ Journey maps for emergency, estimate, financing paths
- ✅ Conversion blueprint with persistent CTA strategy
- ✅ Wireframe specs for all templates

### Issue 3: Design System
- ✅ Color token definitions with WCAG validation
- ✅ Typography tokens (fonts, sizes, weights)
- ✅ Spacing and responsive grid rules
- ✅ Component specifications with 77 interaction states
- ✅ Accessibility contrast matrix

### Issue 4: Technical Architecture (This Issue)
#### ✅ Completed
- ✅ Program charter with outcomes, scope, cadence
- ✅ KPI baseline sheet with formulas, owners, baselines, targets, sources, reporting cadence
- ✅ Weekly operating review template
- ✅ Decision log with approved decisions
- ✅ Risk register with mitigation strategies
- ✅ Go/No-Go criteria with decision authority
- ✅ All artifacts cross-linked from README

#### ✅ Documentation Complete
- ✅ Architecture diagram — `docs/program/ARCHITECTURE-DIAGRAM.md` (current-state + target-state)
- ✅ Environment setup docs — `docs/program/ENVIRONMENT-SETUP.md` (matrix, controls, provisioning checklist)
- ✅ CI/CD workflow config — `docs/program/CICD-WORKFLOW.md` + `.github/workflows/ci.yml` (validation active)
- ✅ Security baseline checklist — `docs/program/SECURITY-BASELINE.md` (app controls complete, infra pending)
- ✅ ADR log — `.github/adr/ADR-0001-platform-decision-deferred.md`
- ✅ Pipeline active and required for merges (CI validation enforced on all PRs)

#### ❌ Infrastructure Blockers (Require Platform Provisioning)
- ❌ End-to-end deploy works reproducibly (pending provisioning - R-009)
- ❌ Rollback procedure tested (pending provisioning - R-009)
- ❌ Monitoring and alerting verified (not configured - R-010)
- ❌ Environments stable and provisioned (not yet provisioned - R-009)
- ❌ Team can release safely (requires deploy + rollback + monitoring — R-009, R-010)

### Issue 5: Frontend Implementation
- ✅ Core templates (homepage, service, location, emergency)
- ✅ Shared CSS and JavaScript systems
- ✅ Component patterns and documentation
- ✅ Accessibility compliance (WCAG 2.1 AA)
- ✅ Responsive design (360px to 1440px)
- ✅ Conversion architecture (2+ paths per template)

See **[ACCEPTANCE-CRITERIA.md](ACCEPTANCE-CRITERIA.md)** for full details.

---

## 🚀 Getting Started

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE
- Git for version control
- (Optional) Local web server for testing

### Quick Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Custom-Coding-Creations/hvac.git
   cd hvac
   ```

2. View templates:
   ```bash
   # Start a local server from repository root
   python -m http.server 8000
   # Then open http://localhost:8000/frontend/templates/homepage.html
   ```

3. For local development with live reload:
   ```bash
   # Option 1: Python simple server
   cd frontend
   python -m http.server 8000
   
   # Option 2: Node.js http-server
   npx http-server frontend -p 8000
   
   # Then open http://localhost:8000/templates/homepage.html
   ```

### Running Tests
```bash
cd frontend
npm install
npm test
```

See **[Implementation Guide](frontend/IMPLEMENTATION-GUIDE.md)** for detailed setup instructions.

---

## 📞 Contact and Support

### Team Contacts
- **Program Lead:** [TBD]
- **Program Sponsor:** [TBD]
- **Frontend Lead:** [TBD]
- **Analytics Lead:** [TBD]
- **QA Owner:** [TBD]
- **Platform Owner:** [TBD]

### Getting Help
- **Governance questions:** See [Program Charter](docs/program/PROGRAM-CHARTER.md) or contact Program Lead
- **Technical questions:** See [Implementation Guide](frontend/IMPLEMENTATION-GUIDE.md) or contact Frontend Lead
- **Design questions:** See [Design System](design-system/README.md)
- **UX questions:** See [UX Artifacts](ux/)
- **KPI/metrics questions:** See [KPI Baseline Sheet](docs/program/KPI-BASELINE-SHEET.md) or contact Analytics Lead

### Escalation
Follow escalation protocol in **[Program Charter](docs/program/PROGRAM-CHARTER.md)** Section "Escalation Protocol".

---

## 📝 Contributing

### Making Changes
1. Create a feature branch from `main`
2. Make your changes following our standards:
   - Use design tokens from `design-system/TOKENS.md`
   - Follow component patterns from `frontend/components/README.md`
   - Maintain WCAG 2.1 AA accessibility compliance
   - Test across all viewports (360, 768, 1024, 1440px)
3. Run tests and validation
4. Submit pull request with clear description
5. Address review feedback
6. Merge after approval

### Decision Making
Major decisions require:
1. Documentation in **[Decision Log](docs/program/DECISION-LOG.md)**
2. Approval per decision matrix in **[Program Charter](docs/program/PROGRAM-CHARTER.md)**
3. Communication to affected team members

### Risk Management
If you identify a risk:
1. Document using template in **[Risk Register](docs/program/RISK-REGISTER.md)**
2. Bring to next weekly operating review
3. Program Lead assigns risk ID and owner

---

## 📄 License

[License information to be added]

---

## 🔄 Recent Updates

### 2026-05-06
- ✅ Created comprehensive program governance package in `docs/program/`
- ✅ Enhanced KPI Baseline Sheet with formulas, sources, and measurement methods
- ✅ Added detailed Risk Register with R-009 (deployment) and R-010 (monitoring)
- ✅ Created Go/No-Go Criteria with 5 gates and launch readiness assessment
- ✅ Established decision authority framework and escalation protocol
- ✅ Cross-linked all artifacts in this README and docs/program/README

### 2026-05-05
- ✅ Completed Issue 5: Frontend implementation (templates + shared systems)
- ✅ Completed Issue 3: Design system documentation
- ✅ Completed Issue 2: UX and IA blueprint artifacts
- ✅ Initial governance package (charter, KPIs, decision log, risk register)

---

**Last Updated:** 2026-05-06  
**Version:** 2.0  
**Status:** Active Development - Infrastructure provisioning in progress  

For detailed program documentation, see **[docs/program/README.md](docs/program/README.md)**.
