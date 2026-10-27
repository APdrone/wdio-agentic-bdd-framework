@smoke @auth
Feature: Clinical Institutional Authentication & Role-Based Access Control
  As an authorized healthcare provider
  I want to securely authenticate into the MedPulse EHR Portal
  So that I can access clinical records appropriate to my institutional role

  Background:
    Given the clinician navigates to the MedPulse portal

  @smoke
  Scenario Outline: Successful clinical login by role
    When the clinician logs in with email "<email>" and password "<password>"
    Then the active user name should display "<name>"
    And the active role should display "<role>"

    Examples:
      | email                   | password     | name                 | role                |
      | nurse.elena@medpulse.io | Password123! | Elena Rostova, RN    | Triage Nurse        |
      | dr.marcus@medpulse.io   | Password123! | Dr. Marcus Vance, MD | Attending Physician |

  @regression
  Scenario: Invalid credentials trigger security alert
    When the clinician logs in with email "unauthorized@hospital.org" and password "WrongPass!"
    Then an authentication security error should be displayed
