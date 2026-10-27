import { config as baseConfig } from './wdio.conf.js';

export const config = Object.assign({}, baseConfig, {
  cucumberOpts: Object.assign({}, baseConfig.cucumberOpts, {
    tagExpression: '@ai-agent'
  })
});
