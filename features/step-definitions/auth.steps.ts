import { Given, When, Then } from '@wdio/cucumber-framework';
import LoginPage from '../../src/pageobjects/LoginPage.js';

Given(/^the clinician navigates to the MedPulse portal$/, async () => {
  await LoginPage.open('/');
  console.log('>>> [NAVIGATE] Current URL:', await browser.getUrl());
  console.log('>>> [NAVIGATE] Page Title:', await browser.getTitle());
  
  // If previously logged in, log out
  const logoutBtn = await LoginPage.logoutBtn;
  if (await logoutBtn.isDisplayed()) {
    await logoutBtn.click();
  }

  const emailInput = await LoginPage.emailInput;
  await emailInput.waitForDisplayed({ timeout: 10000 });
});

Given(/^the clinician is authenticated as "([^"]*)"$/, async (roleName: string) => {
  await LoginPage.open('/');
  
  const logoutBtn = await LoginPage.logoutBtn;
  if (await logoutBtn.isDisplayed()) {
    await logoutBtn.click();
  }

  const emailInput = await LoginPage.emailInput;
  await emailInput.waitForDisplayed({ timeout: 10000 });

  if (roleName.includes('Nurse')) {
    await LoginPage.selectQuickPersona('nurse');
  } else if (roleName.includes('Physician') || roleName.includes('Doctor')) {
    await LoginPage.selectQuickPersona('doctor');
  } else {
    await LoginPage.selectQuickPersona('pharma');
  }
});

When(/^the clinician logs in with email "([^"]*)" and password "([^"]*)"$/, async (email: string, pass: string) => {
  await LoginPage.login(email, pass);
});

Then(/^the active user name should display "([^"]*)"$/, async (expectedName: string) => {
  const nameEl = await LoginPage.activeUserName;
  await expect(nameEl).toHaveText(expectedName);
});

Then(/^the active role should display "([^"]*)"$/, async (expectedRole: string) => {
  const roleEl = await LoginPage.activeUserRole;
  await expect(roleEl).toHaveText(expectedRole);
});

Then(/^an authentication security error should be displayed$/, async () => {
  const errEl = await LoginPage.errorMessage;
  await expect(errEl).toBeDisplayed();
  await expect(errEl).toHaveText(expect.stringContaining('Invalid clinical credentials'));
});
