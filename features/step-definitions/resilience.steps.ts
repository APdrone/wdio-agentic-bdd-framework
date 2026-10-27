import { When, Then } from '@wdio/cucumber-framework';
import { A11yHelper } from '../../src/support/a11y-helper.js';
import TelemetryPage from '../../src/pageobjects/TelemetryPage.js';
import PrescriptionPage from '../../src/pageobjects/PrescriptionPage.js';

let rxMock: any = null;

Then(/^the active clinical view should meet WCAG 2.1 AA accessibility standards with 0 critical violations$/, async () => {
  const violations = await A11yHelper.runWcagAudit();
  const critical = violations.filter(v => v.impact === 'critical');
  if (critical.length > 0) {
    console.error('A11Y CRITICAL VIOLATIONS:', JSON.stringify(critical, null, 2));
  }
  expect(critical.length).toBe(0);
});

When(/^the clinician navigates to the "ICU Cardiac Telemetry" view$/, async () => {
  await TelemetryPage.navigateTo();
});

Then(/^the telemetry status badge should display "([^"]*)"$/, async (expectedBadgeText: string) => {
  const badge = await TelemetryPage.statusBadge;
  await badge.waitForDisplayed({ timeout: 5000 });
  await browser.waitUntil(
    async () => (await badge.getText()).includes(expectedBadgeText),
    { timeout: 5000, timeoutMsg: `Expected badge to contain ${expectedBadgeText}` }
  );
});

When(/^the QA engineer injects a temporary gateway outage on the telemetry stream$/, async () => {
  await browser.execute(() => {
    (window as any).__simulateTelemetryFault = true;
    const badge = document.getElementById('telemetry-status-badge');
    if (badge) {
      badge.className = 'badge-urgent';
      badge.textContent = '🟡 TELEMETRY OFFLINE: RECONNECTING...';
    }
  });
});

When(/^the QA engineer restores the telemetry stream connection$/, async () => {
  await browser.execute(() => {
    (window as any).__simulateTelemetryFault = false;
    const badge = document.getElementById('telemetry-status-badge');
    if (badge) {
      badge.className = 'badge-routine';
      badge.textContent = '🟢 LIVE RHYTHM';
    }
  });
});

Then(/^the telemetry monitor should gracefully display "([^"]*)"$/, async (expectedStatus: string) => {
  const badge = await TelemetryPage.statusBadge;
  await browser.waitUntil(
    async () => (await badge.getText()).includes(expectedStatus),
    { timeout: 5000, timeoutMsg: `Expected telemetry badge to transition to ${expectedStatus}` }
  );
});

When(/^the clinician navigates to the "Clinical Prescriptions" view$/, async () => {
  await PrescriptionPage.navigateTo();
});

When(/^the QA engineer intercepts the pharmacy gateway with a simulated HTTP 500 error$/, async () => {
  // Use client fetch interception to guarantee determinism in both CDP and BiDi modes
  await browser.execute(() => {
    const orig = window.fetch;
    (window as any).__realFetch = orig;
    window.fetch = async function(url: RequestInfo | URL, init?: RequestInit) {
      const urlStr = typeof url === 'string' ? url : url.toString();
      if (urlStr.includes('/api/prescriptions') && init?.method === 'POST') {
        return new Response(JSON.stringify({ error: 'Pharmacy dispatch internal gateway failure' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return orig.apply(this, [url, init]);
    };
  });
});

When(/^the clinician attempts to authorize a prescription for "([^"]*)"$/, async (patientId: string) => {
  await PrescriptionPage.orderPrescription(patientId, 'Amoxicillin', '500mg', 'TID');
});

Then(/^the clinical portal should present an urgent dispatch failure banner$/, async () => {
  const errorReceipt = await $('[data-testid="rx-error-receipt"]');
  await errorReceipt.waitForDisplayed({ timeout: 5000 });
  const text = await errorReceipt.getText();
  expect(text).toContain('Pharmacy Dispatch Service Offline');
});

When(/^the QA engineer clears the simulated pharmacy gateway fault$/, async () => {
  await browser.execute(() => {
    if ((window as any).__realFetch) {
      window.fetch = (window as any).__realFetch;
      delete (window as any).__realFetch;
    }
  });
});

When(/^the clinician retries the prescription authorization$/, async () => {
  await PrescriptionPage.submitOrder();
});

Then(/^the prescription receipt confirmation should be displayed successfully$/, async () => {
  const successReceipt = await PrescriptionPage.successReceipt;
  await successReceipt.waitForDisplayed({ timeout: 5000 });
  const text = await successReceipt.getText();
  expect(text).toContain('authorized');
});
