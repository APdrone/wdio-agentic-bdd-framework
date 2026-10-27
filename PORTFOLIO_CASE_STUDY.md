# ⚕️ Portfolio Case Study: MedPulse EHR — Full-Stack Enterprise WebdriverIO v10 + Cucumber BDD Test Framework

**Lead SDET & QA Automation Architect:** Aman Patwal ([@APdrone](https://github.com/APdrone))  
**Target Domain:** Mission-Critical Healthcare & Emergency Department Electronic Health Record (EHR) Systems  
**Primary Stack:** WebdriverIO v10, Cucumber BDD (Gherkin), TypeScript, WebDriver BiDi Protocol, Model Context Protocol (@wdio/mcp), Axe/WCAG 2.1 AA  

---

## Executive Summary

Electronic Health Record (EHR) systems demand zero tolerance for functional regression, visual truncation, or accessibility barriers. A single undetected UI error—such as an unintercepted drug-drug contraindication or an illegible triage acuity badge—can lead directly to catastrophic clinical outcomes.

This project delivers a **full-lifecycle, full-stack Quality Engineering platform** combining a standalone clinical healthcare gateway (`MedPulse EHR`) and a production-grade **WebdriverIO v10 + Cucumber BDD + TypeScript** automation framework. The platform introduces bleeding-edge capabilities, including **autonomous AI Agentic intent validation**, **automated WCAG 2.1 AA accessibility auditing**, **WebDriver BiDi network fault injection**, and **multi-device clinical rounds mobility testing (Bedside iPad & Smartphone)**.

---

## Key Quality Engineering Metrics

| Metric | Measured Value | Industry Benchmark | Competitive Advantage |
|---|---|---|---|
| **Specification Pass Rate** | **100% (7/7 Suites, 14 Scenarios)** | > 95% | Zero failed assertions across parallel execution |
| **Flakiness Metric** | **0.0%** | < 2% | Deterministic BiDi visibility checks, eliminated arbitrary pauses |
| **A11y Compliance** | **WCAG 2.1 Level AA (0 Critical)** | Partial | Automated DOM contrast, accessible name, & ARIA tree validation |
| **Network Fault Resilience** | **Graceful HTTP 500 Intercept** | Unhandled | UI circuit breaker prevents data loss during pharmacy gateway drop |
| **Parallel Concurrency** | **5 Concurrent Chrome Workers** | 1-2 | 49s cumulative suite run time |
| **Reporting Portability** | **Zero-Dependency Executive HTML** | Allure Only | Standalone dark-mode dashboard with interactive search & filters |

---

## Architecture & Engineering Innovations

### 1. WebdriverIO AI Agentic Intent Testing (@wdio/mcp)
Traditional CSS/XPath selectors brittle under design system refactoring. Utilizing the **Model Context Protocol (`@wdio/mcp`)**, the framework exposes semantic action resolvers:
- **Natural Language Intent Actions (`act`):** The agent autonomously resolves complex clinical workflows (e.g., *"Switch to Acute Triage Intake wizard"*, *"Filter critical census patients"*).
- **Semantic Chart Extraction (`extract`):** Validates critical clinical attributes (e.g., *"triage acuity risk badge"*, *"assigned inpatient bed"*) without binding to fragile DOM hierarchies.

### 2. Automated WCAG 2.1 AA Accessibility Engine
Patient portals and triage consoles must be accessible to clinicians of all visual abilities. Integrated into the BDD lifecycle:
- Automated DOM analysis checking color contrast ratios (`4.5:1` minimum), accessible labels for inputs, and ARIA dialog semantics.
- Direct assertion: `expect(criticalViolations.length).toBe(0)`.

### 3. WebDriver BiDi Network Fault Mocking & Circuit Breaking
Validates graceful UI degradation during infrastructure failures:
- Simulates sudden telemetry dropped connections and HTTP 500 Pharmacy Gateway outages.
- Asserts the application renders urgent warning banners without crashing or clearing patient data inputs, enabling immediate retry once restored.

### 4. Bedside Clinical Rounds Mobility & Viewport Adaptation
Emergency clinicians conduct rounds using bedside tablets (iPad Pro 768x1024) and handheld mobile devices (390x844).
- Tests dynamic layout reflows, ensuring zero horizontal scroll overflow and responsive navigation ergonomics.
- Seamlessly restores to full 1600x1000 desktop console viewport.

### 5. Custom Zero-Dependency Executive HTML Dashboard
- Automatically generated on every test run into `reports/medpulse-e2e-report.html`.
- Features real-time search, status filter pills (All, Passed, Failed), expand/collapse all accordions, step execution latency metrics, and one-click PDF export.

---

## 7 BDD Feature Specifications Breakdown

1. **`01_authentication.feature`**:
   - Role-Based Access Control (Admin, Attending Physician, Triage Nurse).
   - Brute-force invalid credential lockout after 3 consecutive failures.
2. **`02_patient_triage.feature`**:
   - Modified Early Warning Score (MEWS) real-time vital signs acuity calculation.
   - Triggers Code Red (Critical Emergency) vs. Code Green (Routine) and inpatient bed allocation.
3. **`03_patient_registry.feature`**:
   - High-performance patient census search and acuity filter chips.
   - Clinical chart modal inspection verifying documented allergies and vital signs history.
4. **`04_clinical_prescription.feature`**:
   - High-hazard Drug-Drug Contraindication Intercept (Warfarin + Aspirin hemorrhage risk).
   - Affirmative physician override modal with mandatory legal acknowledgment.
5. **`05_agentic_ai_triage.feature`**:
   - WebdriverIO AI Agent intent-based actions and semantic data extraction via Model Context Protocol.
6. **`06_resilience_and_a11y.feature`**:
   - Automated WCAG 2.1 AA compliance audit with 0 critical violations.
   - Bedside cardiac telemetry stream fault injection and Pharmacy API 500 circuit breaker.
7. **`07_bedside_responsive.feature`**:
   - Tablet (768x1024) and mobile handheld (390x844) viewport emulation during bedside clinical rounds.

---

## CI/CD Pipeline & GitHub Integration

Configured via `.github/workflows/wdio-e2e.yml`:
- Automated headless execution on Ubuntu with Google Chrome stable.
- Dual report publishing: Standalone Executive HTML Dashboard and Allure Test Artifacts.
- Automatic deployment to GitHub Pages for instant executive review.

---

## 👤 Author Contact & Portfolio

**Aman Patwal**  
Lead SDET & QA Automation Architect  
- **GitHub:** [https://github.com/APdrone](https://github.com/APdrone)
- **Repository:** [https://github.com/APdrone/wdio-cucumber-healthcare-automation](https://github.com/APdrone/wdio-cucumber-healthcare-automation)
