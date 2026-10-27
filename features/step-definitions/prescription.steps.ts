import { When, Then } from '@wdio/cucumber-framework';
import PrescriptionPage from '../../src/pageobjects/PrescriptionPage.js';

When(/^the clinician navigates to the "Clinical Rx Orders" view$/, async () => {
  await PrescriptionPage.navigateTo();
});

When(/^the clinician selects patient on Warfarin therapy$/, async () => {
  const select = await PrescriptionPage.patientSelect;
  await select.waitForDisplayed({ timeout: 5000 });
  
  // Find the patient on Warfarin (Amara Chen)
  const options = await select.$$('option');
  for (const opt of options) {
    const text = await opt.getText();
    if (text.includes('Amara Chen') || text.includes('Warfarin')) {
      const val = await opt.getAttribute('value');
      await select.selectByAttribute('value', val);
      break;
    }
  }
});

When(/^orders "([^"]*)" dosage "([^"]*)"$/, async (med: string, dosage: string) => {
  await PrescriptionPage.selectMedication(med, dosage);
});

Then(/^a critical drug contraindication hazard alert should appear$/, async () => {
  const visible = await PrescriptionPage.isHazardAlertDisplayed();
  expect(visible).toBe(true);
});

Then(/^the confirm override button should be disabled until acknowledged$/, async () => {
  const confirmBtn = await PrescriptionPage.confirmOverrideBtn;
  const isEnabled = await confirmBtn.isEnabled();
  expect(isEnabled).toBe(false);
});

When(/^the clinician acknowledges the clinical contraindication risk$/, async () => {
  await (await PrescriptionPage.overrideCheckbox).click();
});

When(/^confirms the physician override$/, async () => {
  await (await PrescriptionPage.confirmOverrideBtn).click();
});

Then(/^the prescription order receipt should be successfully authorized$/, async () => {
  const receipt = await PrescriptionPage.successReceipt;
  await receipt.waitForDisplayed({ timeout: 5000 });
  const text = await receipt.getText();
  expect(text).toContain('Prescription');
  expect(text).toContain('authorized');
});
