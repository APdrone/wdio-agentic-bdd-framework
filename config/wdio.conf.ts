import type { Options } from '@wdio/types';
import { registerCustomCommands } from '../src/support/custom-commands.js';

const isHeadless = process.env.HEADLESS === 'true';

export const config: Options.Testrunner = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: './tsconfig.json'
    }
  },
  specs: [
    '../features/**/*.feature'
  ],
  exclude: [],
  maxInstances: 1,
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: isHeadless
        ? ['--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1600,1000']
        : ['--window-size=1600,1000']
    }
  }],
  logLevel: 'warn',
  bail: 0,
  baseUrl: 'http://localhost:4000',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'cucumber',
  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      useCucumberStepReporter: true
    }]
  ],
  cucumberOpts: {
    require: ['./features/step-definitions/**/*.ts'],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    name: [],
    snippets: true,
    source: true,
    strict: false,
    tagExpression: '',
    timeout: 60000,
    ignoreUndefinedDefinitions: false
  },
  before: async function () {
    registerCustomCommands();
  },
  afterStep: async function (step, scenario, result) {
    if (!result.passed) {
      await browser.takeScreenshot();
    }
  }
};
