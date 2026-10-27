@smoke @clinical @triage
Feature: Acute Patient Triage & Real-Time Acuity Scoring
  As an Emergency Department Triage Nurse
  I want to intake patient vital signs and chief complaints
  So that the clinical engine automatically calculates the emergency acuity risk score

  Background:
    Given the clinician is authenticated as "Triage Nurse"
    And the clinician navigates to the "Acute Triage Intake" wizard

  @smoke
  Scenario: Critical hypertension and hypoxia triggers Code Red emergency
    When the clinician intakes patient "Samuel Green", age 52, gender "Male" with complaint "Crushing chest pain"
    And the clinician records vital signs:
      | systolic | diastolic | heartRate | spo2 |
      | 195      | 115       | 125       | 88   |
    Then the triage acuity risk score should calculate as "CODE RED: CRITICAL EMERGENCY"
    When the clinician submits the triage intake
    Then a bed assignment confirmation banner should be displayed

  @regression
  Scenario: Normal vital signs triggers Code Green routine classification
    When the clinician intakes patient "Grace Hopper", age 38, gender "Female" with complaint "Mild wrist sprain"
    And the clinician records vital signs:
      | systolic | diastolic | heartRate | spo2 |
      | 118      | 76        | 72        | 99   |
    Then the triage acuity risk score should calculate as "CODE GREEN: ROUTINE"
