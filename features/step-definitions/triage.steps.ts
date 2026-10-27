import { When, Then } from '@wdio/cucumber-framework';
import TriageWizardPage from '../../src/pageobjects/TriageWizardPage.js';

When(/^the clinician navigates to the "Acute Triage Intake" wizard$/, async () => {
  await TriageWizardPage.navigateTo();
});

When(/^the clinician intakes patient "([^"]*)", age (\d+), gender "([^"]*)" with complaint "([^"]*)"$/, async (name: string, age: number, gender: string, complaint: string) => {
  await TriageWizardPage.enterDemographics(name, Number(age), gender, complaint);
});

When(/^the clinician records vital signs:$/, async (table) => {
  const rows = table.hashes();
  const v = rows[0];
  await TriageWizardPage.enterVitals(Number(v.systolic), Number(v.diastolic), Number(v.heartRate), Number(v.spo2));
});

Then(/^the triage acuity risk score should calculate as "([^"]*)"$/, async (expectedAcuity: string) => {
  const text = await TriageWizardPage.getRiskClassification();
  expect(text).toContain(expectedAcuity);
});

When(/^the clinician submits the triage intake$/, async () => {
  await TriageWizardPage.submitTriage();
});

Then(/^a bed assignment confirmation banner should be displayed$/, async () => {
  const banner = await TriageWizardPage.successBanner;
  await expect(banner).toBeDisplayed();
});
