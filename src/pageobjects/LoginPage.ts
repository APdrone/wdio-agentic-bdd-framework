import Page from './Page.js';

class LoginPage extends Page {
  public get emailInput() { return browser.$('[data-testid="login-email"]'); }
  public get passwordInput() { return browser.$('[data-testid="login-password"]'); }
  public get submitBtn() { return browser.$('[data-testid="login-submit-btn"]'); }
  public get errorMessage() { return browser.$('[data-testid="login-error"]'); }
  public get activeUserRole() { return browser.$('[data-testid="active-user-role"]'); }
  public get activeUserName() { return browser.$('[data-testid="active-user-name"]'); }
  public get logoutBtn() { return browser.$('[data-testid="logout-btn"]'); }
  public get quickPersonaNurse() { return browser.$('[data-testid="quick-persona-nurse"]'); }
  public get quickPersonaDoctor() { return browser.$('[data-testid="quick-persona-doctor"]'); }
  public get quickPersonaPharma() { return browser.$('[data-testid="quick-persona-pharma"]'); }

  public async login(email: string, pass: string): Promise<void> {
    await this.waitAndSetValue(await this.emailInput, email);
    await this.waitAndSetValue(await this.passwordInput, pass);
    await this.waitAndClick(await this.submitBtn);
  }

  public async selectQuickPersona(role: 'nurse' | 'doctor' | 'pharma'): Promise<void> {
    if (role === 'nurse') await (await this.quickPersonaNurse).click();
    if (role === 'doctor') await (await this.quickPersonaDoctor).click();
    if (role === 'pharma') await (await this.quickPersonaPharma).click();
    await (await this.submitBtn).click();
  }

  public async logout(): Promise<void> {
    await this.waitAndClick(await this.logoutBtn);
  }
}

export default new LoginPage();
