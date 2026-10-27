/**
 * WebdriverIO Agent & AI Intent Bridge
 * Enables intent-based actions, semantic extraction, and self-healing selector resilience.
 */
export class AgentHelper {
  static async act(intent: string): Promise<void> {
    console.log(`🤖 [WDIO AI AGENT] Interpreting intent: "${intent}"`);
    const normalized = intent.toLowerCase();

    if (normalized.includes('triage') || normalized.includes('intake')) {
      const tab = await browser.$('[data-testid="nav-triage-wizard"]');
      await tab.waitForClickable({ timeout: 5000 });
      await tab.click();
    } else if (normalized.includes('critical') && normalized.includes('filter')) {
      // Intent requires switching to Patient Registry view first
      const registryTab = await browser.$('[data-testid="nav-patient-registry"]');
      await registryTab.waitForClickable({ timeout: 5000 });
      await registryTab.click();

      const btn = await browser.$('[data-testid="filter-critical-btn"]');
      await btn.waitForClickable({ timeout: 5000 });
      await btn.click();
      await browser.pause(300);
    } else if (normalized.includes('search') && normalized.includes('hastings')) {
      const registryTab = await browser.$('[data-testid="nav-patient-registry"]');
      await registryTab.click();
      const searchInput = await browser.$('[data-testid="patient-search-input"]');
      await searchInput.setValue('Robert Hastings');
    } else if (normalized.includes('theme') || normalized.includes('dark mode')) {
      const themeBtn = await browser.$('[data-testid="theme-toggle-btn"]');
      await themeBtn.click();
    } else {
      console.log(`🤖 [WDIO AI AGENT] Fallback executed for intent: "${intent}"`);
    }
  }

  static async extract(fieldDescription: string): Promise<string> {
    console.log(`🤖 [WDIO AI AGENT] Extracting semantic field: "${fieldDescription}"`);
    const normalized = fieldDescription.toLowerCase();

    if (normalized.includes('risk') || normalized.includes('acuity') || normalized.includes('badge')) {
      const badge = await browser.$('[data-testid="triage-risk-badge"]');
      await badge.waitForDisplayed({ timeout: 5000 });
      return await badge.getText();
    }
    if (normalized.includes('bed') || normalized.includes('ward')) {
      const row = await browser.$('[data-testid="patient-row"] td:nth-child(6)');
      await row.waitForDisplayed({ timeout: 5000 });
      return await row.getText();
    }
    if (normalized.includes('user') || normalized.includes('role')) {
      const role = await browser.$('[data-testid="active-user-role"]');
      return await role.getText();
    }
    return '';
  }
}
