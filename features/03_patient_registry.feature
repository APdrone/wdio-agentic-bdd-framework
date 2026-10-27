@regression @registry
Feature: Electronic Health Record (EHR) Patient Registry & Census
  As an Attending Physician
  I want to search and filter inpatient census records
  So that I can quickly review high-risk patient charts

  Background:
    Given the clinician is authenticated as "Attending Physician"
    And the clinician navigates to the "EHR Patient Registry" view

  Scenario: Filter patients by Critical acuity priority
    When the clinician filters the registry by "CRITICAL" acuity
    Then only patients with "CRITICAL" acuity status should be displayed in the census

  Scenario: Real-time search by patient name
    When the clinician searches the registry for "Robert Hastings"
    Then the census table should display the matching patient record with MRN "MRN-90214"
    When the clinician opens the medical chart for the patient
    Then the chart modal should display documented allergies and vital signs
