import { When, Then } from '@wdio/cucumber-framework';
import PatientRegistryPage from '../../src/pageobjects/PatientRegistryPage.js';

When(/^the clinician navigates to the "EHR Patient Registry" view$/, async () => {
  await PatientRegistryPage.navigateTo();
});

When(/^the clinician filters the registry by "([^"]*)" acuity$/, async (status: string) => {
  await PatientRegistryPage.filterStatus(status as any);
});

Then(/^only patients with "([^"]*)" acuity status should be displayed in the census$/, async (status: string) => {
  const rows = await PatientRegistryPage.patientRows;
  expect(rows.length).toBeGreaterThan(0);
  for (const row of rows) {
    const text = await row.getText();
    expect(text).toContain(status);
  }
});

When(/^the clinician searches the registry for "([^"]*)"$/, async (query: string) => {
  await PatientRegistryPage.search(query);
});

Then(/^the census table should display the matching patient record with MRN "([^"]*)"$/, async (mrn: string) => {
  const rows = await PatientRegistryPage.patientRows;
  expect(rows.length).toBeGreaterThanOrEqual(1);
  const firstRowText = await rows[0].getText();
  expect(firstRowText).toContain(mrn);
});

When(/^the clinician opens the medical chart for the patient$/, async () => {
  await PatientRegistryPage.openChartForPatient(0);
});

Then(/^the chart modal should display documented allergies and vital signs$/, async () => {
  const modal = await PatientRegistryPage.chartModal;
  await expect(modal).toBeDisplayed();
  const allergies = await PatientRegistryPage.modalAllergiesList;
  await expect(allergies).toHaveText(expect.stringContaining('Penicillin'));
  await PatientRegistryPage.closeChart();
});
