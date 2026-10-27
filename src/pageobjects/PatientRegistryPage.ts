import Page from './Page.js';

class PatientRegistryPage extends Page {
  public get navTab() { return browser.$('[data-testid="nav-patient-registry"]'); }
  public get searchInput() { return browser.$('[data-testid="patient-search-input"]'); }
  public get filterAllBtn() { return browser.$('[data-testid="filter-all-btn"]'); }
  public get filterCriticalBtn() { return browser.$('[data-testid="filter-critical-btn"]'); }
  public get filterUrgentBtn() { return browser.$('[data-testid="filter-urgent-btn"]'); }
  public get filterRoutineBtn() { return browser.$('[data-testid="filter-routine-btn"]'); }
  public get patientRows() { return browser.$$('[data-testid="patient-row"]'); }
  public get chartModal() { return browser.$('[data-testid="patient-chart-modal"]'); }
  public get modalPatientName() { return browser.$('[data-testid="modal-patient-name"]'); }
  public get modalPatientVitals() { return browser.$('[data-testid="modal-patient-vitals"]'); }
  public get modalAllergiesList() { return browser.$('[data-testid="modal-allergies-list"]'); }
  public get modalCloseBtn() { return browser.$('[data-testid="modal-close-btn"]'); }

  public async navigateTo(): Promise<void> {
    await this.waitAndClick(await this.navTab);
  }

  public async search(query: string): Promise<void> {
    await this.waitAndSetValue(await this.searchInput, query);
    await browser.pause(300); // Allow debounce
  }

  public async filterStatus(status: 'ALL' | 'CRITICAL' | 'URGENT' | 'ROUTINE'): Promise<void> {
    if (status === 'ALL') await this.waitAndClick(await this.filterAllBtn);
    if (status === 'CRITICAL') await this.waitAndClick(await this.filterCriticalBtn);
    if (status === 'URGENT') await this.waitAndClick(await this.filterUrgentBtn);
    if (status === 'ROUTINE') await this.waitAndClick(await this.filterRoutineBtn);
    await browser.pause(300);
  }

  public async getRowCount(): Promise<number> {
    const rows = await this.patientRows;
    return rows.length;
  }

  public async openChartForPatient(index: number = 0): Promise<void> {
    const rows = await this.patientRows;
    if (rows.length > index) {
      const btn = await rows[index].$('[data-testid="view-chart-btn"]');
      await btn.waitForClickable({ timeout: 5000 });
      await btn.click();
      const modal = await this.chartModal;
      await modal.waitForDisplayed({ timeout: 10000 });
    }
  }

  public async closeChart(): Promise<void> {
    await this.waitAndClick(await this.modalCloseBtn);
  }
}

export default new PatientRegistryPage();
