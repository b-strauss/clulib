'use strict';

const sauceLabsLaunchers = {
  'SL_CHROME': {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10',
  }
};

module.exports = {
  sauceLabsLaunchers: sauceLabsLaunchers
};