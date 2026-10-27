import { config as baseConfig } from './wdio.conf.js';

export const config = Object.assign({}, baseConfig, {
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--window-size=1600,1000'
      ]
    }
  }]
});
