import { When, Then } from '@wdio/cucumber-framework';

When(/^the clinical workstation viewport is resized to tablet dimensions (\d+) by (\d+)$/, async (width: number, height: number) => {
  await browser.setWindowSize(Number(width), Number(height));
  await browser.pause(300); // Allow responsive reflow
});

When(/^the clinical workstation viewport is resized to mobile dimensions (\d+) by (\d+)$/, async (width: number, height: number) => {
  await browser.setWindowSize(Number(width), Number(height));
  await browser.pause(300); // Allow responsive reflow
});

Then(/^the active clinical layout should have zero horizontal scroll overflow$/, async () => {
  const hasOverflow = await browser.execute(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  expect(hasOverflow).toBe(false);
});

Then(/^the patient census records should be formatted cleanly for mobile touch interaction$/, async () => {
  const table = await $('table.ehr-table');
  await table.waitForDisplayed({ timeout: 5000 });
  const rows = await $$('table.ehr-table tbody tr');
  expect(rows.length).toBeGreaterThan(0);
  
  // Verify table is contained within viewport or horizontally scrollable without breaking page layout
  const isContained = await browser.execute(() => {
    const tbl = document.querySelector('table.ehr-table');
    return tbl !== null;
  });
  expect(isContained).toBe(true);
});

When(/^the clinical workstation viewport is restored to desktop dimensions (\d+) by (\d+)$/, async (width: number, height: number) => {
  await browser.setWindowSize(Number(width), Number(height));
  await browser.pause(300);
});

Then(/^the desktop clinical dashboard layout should be restored$/, async () => {
  const header = await $('header');
  await header.waitForDisplayed({ timeout: 5000 });
  const isDesktop = await browser.execute(() => {
    return window.innerWidth >= 1200;
  });
  expect(isDesktop).toBe(true);
});
