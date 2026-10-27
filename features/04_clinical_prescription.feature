@regression @pharmacy
Feature: Clinical Pharmacy Ordering & Drug-Drug Contraindication Interceptor
  As a licensed Physician
  I want the system to check drug-drug interactions before dispensing
  So that fatal adverse drug interactions are prevented

  Background:
    Given the clinician is authenticated as "Attending Physician"
    And the clinician navigates to the "Clinical Rx Orders" view

  Scenario: Prescribing Aspirin to a patient on Warfarin triggers critical contraindication alert
    When the clinician selects patient on Warfarin therapy
    And orders "Aspirin" dosage "81mg"
    Then a critical drug contraindication hazard alert should appear
    And the confirm override button should be disabled until acknowledged
    When the clinician acknowledges the clinical contraindication risk
    And confirms the physician override
    Then the prescription order receipt should be successfully authorized
