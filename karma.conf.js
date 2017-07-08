'use strict';

const sauceLabsLaunchers = require('./browsers.conf.js').sauceLabsLaunchers;

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