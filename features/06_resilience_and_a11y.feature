@regression @a11y @resilience
Feature: Clinical Platform Accessibility (A11y) & Network Fault Resilience
  As a Clinical QA Automation Architect
  I want to verify WCAG 2.1 AA accessibility and network fault tolerance
  So that the emergency portal remains compliant and recovers gracefully during infrastructure jitter

  Background:
    Given the clinician is authenticated as "Triage Nurse"

  @a11y
  Scenario: Automated WCAG 2.1 AA accessibility audit on Acute Triage Intake
    When the clinician navigates to the "Acute Triage Intake" wizard
    Then the active clinical view should meet WCAG 2.1 AA accessibility standards with 0 critical violations

  @resilience @telemetry
  Scenario: Bedside telemetry monitors gracefully handle network drop
    When the clinician navigates to the "ICU Cardiac Telemetry" view
    Then the telemetry status badge should display "LIVE RHYTHM"
    When the QA engineer injects a temporary gateway outage on the telemetry stream
    Then the telemetry monitor should gracefully display "TELEMETRY OFFLINE: RECONNECTING..."
    When the QA engineer restores the telemetry stream connection
    Then the telemetry status badge should display "LIVE RHYTHM"

  @resilience @api-fault @circuit-breaker
  Scenario: Pharmacy dispatch gateway failure triggers graceful circuit-breaker banner
    When the clinician navigates to the "Clinical Prescriptions" view
    And the QA engineer intercepts the pharmacy gateway with a simulated HTTP 500 error
    And the clinician attempts to authorize a prescription for "PAT-101"
    Then the clinical portal should present an urgent dispatch failure banner
    When the QA engineer clears the simulated pharmacy gateway fault
    And the clinician retries the prescription authorization
    Then the prescription receipt confirmation should be displayed successfully
