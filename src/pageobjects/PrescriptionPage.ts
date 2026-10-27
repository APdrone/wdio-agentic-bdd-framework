import Page from './Page.js';

class PrescriptionPage extends Page {
  public get navTab() { return browser.$('[data-testid="nav-prescriptions"]'); }
  public get patientSelect() { return browser.$('[data-testid="rx-patient-select"]'); }
  public get medicationSelect() { return browser.$('[data-testid="rx-medication-select"]'); }
  public get dosageInput() { return browser.$('[data-testid="rx-dosage-input"]'); }
  public get frequencySelect() { return browser.$('[data-testid="rx-frequency-select"]'); }
  public get submitBtn() { return browser.$('[data-testid="rx-submit-btn"]'); }
  public get interactionModal() { return browser.$('[data-testid="drug-interaction-modal"]'); }
  public get hazardAlertText() { return browser.$('[data-testid="hazard-alert-text"]'); }
  public get overrideCheckbox() { return browser.$('[data-testid="override-checkbox"]'); }
  public get confirmOverrideBtn() { return browser.$('[data-testid="confirm-override-btn"]'); }
  public get cancelOverrideBtn() { return browser.$('[data-testid="cancel-override-btn"]'); }
  public get successReceipt() { return browser.$('[data-testid="rx-success-receipt"]'); }

  public async navigateTo(): Promise<void> {
    await this.waitAndClick(await this.navTab);
  }

  public async selectMedication(med: string, dosage: string): Promise<void> {
    await (await this.medicationSelect).selectByAttribute('value', med);
    await this.waitAndSetValue(await this.dosageInput, dosage);
    await this.waitAndClick(await this.submitBtn);
  }

  public async isHazardAlertDisplayed(): Promise<boolean> {
    try {
      const modal = await this.interactionModal;
      await modal.waitForDisplayed({ timeout: 4000 });
      return await modal.isDisplayed();
    } catch {
      return false;
    }
  }

  public async acknowledgeAndOverride(): Promise<void> {
    await (await this.overrideCheckbox).click();
    await (await this.confirmOverrideBtn).waitForClickable({ timeout: 3000 });
    await (await this.confirmOverrideBtn).click();
  }

  public async orderPrescription(patientId: string, med: string, dosage: string, frequency: string = 'BID'): Promise<void> {
    const sel = await this.patientSelect;
    await sel.waitForDisplayed({ timeout: 5000 });
    await browser.waitUntil(async () => (await sel.$$('option')).length > 1, { timeout: 5000 });
    const options = await sel.$$('option');
    for (const opt of options) {
      const val = await opt.getAttribute('value');
      if (val && val.includes(patientId)) {
        await sel.selectByAttribute('value', val);
        break;
      }
    }

    const medSel = await this.medicationSelect;
    const medOpts = await medSel.$$('option');
    for (const opt of medOpts) {
      const val = await opt.getAttribute('value');
      if (val && (val === med || val.includes(med))) {
        await medSel.selectByAttribute('value', val);
        break;
      }
    }

    await this.waitAndSetValue(await this.dosageInput, dosage);

    const freqSel = await this.frequencySelect;
    const freqOpts = await freqSel.$$('option');
    for (const opt of freqOpts) {
      const val = await opt.getAttribute('value');
      if (val && (val === frequency || val.includes(frequency))) {
        await freqSel.selectByAttribute('value', val);
        break;
      }
    }

    await this.waitAndClick(await this.submitBtn);
  }

  public async submitOrder(): Promise<void> {
    await this.waitAndClick(await this.submitBtn);
  }
}

export default new PrescriptionPage();
