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
}

export default new PrescriptionPage();
