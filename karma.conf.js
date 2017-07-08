'use strict';

const sauceLabsLaunchers = {
  // test specific versions
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
  },
  // test newest version
  'SL_CHROME': {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10',
  },
  'SL_FIREFOX': {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 10',
  }
};

module.exports = config => {
  config.set({

    frameworks: ['jasmine'],

    files: ['./bin/test.js'],

    customLaunchers: sauceLabsLaunchers,

    preprocessors: {
      './bin/test.js': ['sourcemap']
    },

    reporters: ['spec', 'saucelabs'],

    specReporter: {
      suppressErrorSummary: false,
      suppressFailed: false,
      suppressPassed: false,
      suppressSkipped: false,
      showSpecTiming: true,
      failFast: true
    },

    sauceLabs: {
      testName: 'clulib',
      retryLimit: 2,
      recordScreenshots: false,
      options: {
        'command-timeout': 600,
        'idle-timeout': 600,
        'max-duration': 5400,
      }
    },

    port: 9876,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: 1
  });

  if (process.env.TRAVIS) {
    config.sauceLabs.build = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    config.transports = ['polling'];
    config.browsers = Object.keys(sauceLabsLaunchers)
  }
};