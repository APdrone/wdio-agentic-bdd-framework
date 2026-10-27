@e2e @responsive @clinical-mobility
Feature: Bedside Clinical Rounds & Multi-Device Mobility
  As an Emergency Care Physician or Bedside Triage Nurse
  I want MedPulse EHR to adapt dynamically to tablet and handheld mobile form factors
  So that I can enter vitals and review patient records at the bedside without UI truncation

  Background:
    Given the clinician is authenticated as "Attending Physician"

  @tablet @bedside-rounds
  Scenario: Physician performs bedside triage on a clinical tablet viewport
    When the clinical workstation viewport is resized to tablet dimensions 768 by 1024
    And the clinician navigates to the "Acute Triage Intake" wizard
    And the clinician intakes patient "Eleanor Vance", age 64, gender "Female" with complaint "Acute dyspnea"
    And the clinician records vital signs:
      | systolic | diastolic | heartRate | spo2 |
      | 158      | 98        | 108       | 92   |
    Then the triage acuity risk score should calculate as "CODE YELLOW: URGENT"
    And the active clinical layout should have zero horizontal scroll overflow

  @mobile @handheld-census
  Scenario: Emergency nurse reviews patient census on handheld smartphone
    When the clinical workstation viewport is resized to mobile dimensions 390 by 844
    And the clinician navigates to the "EHR Patient Registry" view
    Then the patient census records should be formatted cleanly for mobile touch interaction
    When the clinical workstation viewport is restored to desktop dimensions 1600 by 1000
    Then the desktop clinical dashboard layout should be restored
