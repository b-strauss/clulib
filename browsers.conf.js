'use strict';

const sauceLabsDesktopLaunchers = {
  'SL_CHROME': {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10',
  },
  'SL_FIREFOX': {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 10',
  },
  'SL_IE_11': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  },
  'SL_EDGE_14': {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: '14'
  },
  'SL_EDGE_15': {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: '15'
  },
  'SL_SAFARI_9': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.11',
    version: '9'
  },
  'SL_SAFARI_10': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'macOS 10.12',
    version: '10'
  }
};

module.exports = {
  customLaunchers: Object.assign({}, sauceLabsDesktopLaunchers)
};