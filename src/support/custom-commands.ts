export function registerCustomCommands() {
  browser.addCommand('getByTestId', async function (testId: string) {
    return this.$(`[data-testid="${testId}"]`);
  });

  browser.addCommand('getByTestId', async function (testId: string) {
    return this.$(`[data-testid="${testId}"]`);
  }, true);
}
