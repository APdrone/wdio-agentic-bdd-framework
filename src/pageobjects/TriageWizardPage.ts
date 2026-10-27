import Page from './Page.js';

class TriageWizardPage extends Page {
  public get navTab() { return browser.$('[data-testid="nav-triage-wizard"]'); }
  public get patientNameInput() { return browser.$('[data-testid="triage-patient-name"]'); }
  public get patientAgeInput() { return browser.$('[data-testid="triage-patient-age"]'); }
  public get genderSelect() { return browser.$('[data-testid="triage-patient-gender"]'); }
  public get complaintInput() { return browser.$('[data-testid="triage-patient-complaint"]'); }
  public get systolicInput() { return browser.$('[data-testid="triage-systolic"]'); }
  public get diastolicInput() { return browser.$('[data-testid="triage-diastolic"]'); }
  public get heartRateInput() { return browser.$('[data-testid="triage-heartrate"]'); }
  public get spo2Input() { return browser.$('[data-testid="triage-spo2"]'); }
  public get notesInput() { return browser.$('[data-testid="triage-notes"]'); }
  public get riskBadge() { return browser.$('[data-testid="triage-risk-badge"]'); }
  public get submitBtn() { return browser.$('[data-testid="triage-submit-btn"]'); }
  public get successBanner() { return browser.$('[data-testid="triage-success-banner"]'); }

  public async navigateTo(): Promise<void> {
    await this.waitAndClick(await this.navTab);
  }

  public async enterDemographics(name: string, age: number, gender: string, complaint: string): Promise<void> {
    await this.waitAndSetValue(await this.patientNameInput, name);
    await this.waitAndSetValue(await this.patientAgeInput, age);
    await (await this.genderSelect).selectByVisibleText(gender);
    await this.waitAndSetValue(await this.complaintInput, complaint);
  }

  public async enterVitals(sys: number, dia: number, hr: number, spo2: number): Promise<void> {
    await this.waitAndSetValue(await this.systolicInput, sys);
    await this.waitAndSetValue(await this.diastolicInput, dia);
    await this.waitAndSetValue(await this.heartRateInput, hr);
    await this.waitAndSetValue(await this.spo2Input, spo2);
  }

  public async getRiskClassification(): Promise<string> {
    const badge = await this.riskBadge;
    await badge.waitForDisplayed({ timeout: 5000 });
    return await badge.getText();
  }

  public async submitTriage(): Promise<void> {
    await this.waitAndClick(await this.submitBtn);
  }
}

export default new TriageWizardPage();
