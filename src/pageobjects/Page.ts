export default class Page {
  public async open(path: string = '/'): Promise<void> {
    await browser.url(path);
  }

  public async waitAndClick(element: WebdriverIO.Element): Promise<void> {
    await element.waitForDisplayed({ timeout: 10000 });
    await element.waitForClickable({ timeout: 10000 });
    await element.click();
  }

  public async waitAndSetValue(element: WebdriverIO.Element, value: string | number): Promise<void> {
    await element.waitForDisplayed({ timeout: 10000 });
    await element.setValue(value);
  }
}
