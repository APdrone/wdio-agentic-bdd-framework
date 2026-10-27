import Page from './Page.js';

class TelemetryPage extends Page {
  public get navTab() { return browser.$('[data-testid="nav-telemetry"]'); }
  public get heartRateValue() { return browser.$('[data-testid="telemetry-hr-val"]'); }
  public get spo2Value() { return browser.$('[data-testid="telemetry-spo2-val"]'); }
  public get statusBadge() { return browser.$('[data-testid="telemetry-status-badge"]'); }

  public async navigateTo(): Promise<void> {
    await this.waitAndClick(await this.navTab);
  }
}

export default new TelemetryPage();
