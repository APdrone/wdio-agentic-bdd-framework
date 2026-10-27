@ai-agent @agentic
Feature: WebdriverIO AI Agentic Intent-Based Triage & Verification
  As an AI Testing Agent
  I want to verify complex clinical workflows using intent-based actions and semantic extraction
  So that end-to-end tests remain resilient to DOM structure changes

  Background:
    Given the clinician is authenticated as "Triage Nurse"

  Scenario: AI Agent verifies emergency triage acuity via intent
    When the AI agent performs intent "Switch to Acute Triage Intake wizard"
    And the clinician records vital signs:
      | systolic | diastolic | heartRate | spo2 |
      | 188      | 112       | 122       | 89   |
    Then the AI agent extracts semantic field "triage acuity risk badge" containing "CODE RED"
    When the AI agent performs intent "Filter critical census patients"
    Then the AI agent extracts semantic field "assigned inpatient bed" containing "ICU"
