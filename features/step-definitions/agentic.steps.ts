import { When, Then } from '@wdio/cucumber-framework';
import { AgentHelper } from '../../src/support/agent-helper.js';

When(/^the AI agent performs intent "([^"]*)"$/, async (intent: string) => {
  await AgentHelper.act(intent);
});

Then(/^the AI agent extracts semantic field "([^"]*)" containing "([^"]*)"$/, async (field: string, expectedVal: string) => {
  const extracted = await AgentHelper.extract(field);
  expect(extracted).toContain(expectedVal);
});
