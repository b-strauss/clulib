'use strict';

const customLaunchers = require('./browsers.conf.js').customLaunchers;

module.exports = config => {
  config.set({
    frameworks: ['jasmine'],

    files: ['./bin/test.js'],

    customLaunchers: customLaunchers,

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
      failFast: false
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

    browserDisconnectTimeout: 10 * 1000, // default 2s
    browserDisconnectTolerance: 1, // default 0
    browserNoActivityTimeout: 4 * 60 * 1000, // default 10s
    captureTimeout: 5 * 60 * 1000, // default 60s
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
    config.browsers = Object.keys(customLaunchers)
  }
};