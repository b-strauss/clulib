'use strict';

const {customLaunchers} = require('./browsers.conf.js');

module.exports = config => {
  config.set({
    frameworks: ['jasmine'],

    files: [
      './bin/test.min.js',
      {
        pattern: 'test-assets/json/*.json',
        watched: false,
        included: false,
        served: true,
        nocache: false
      }
    ],

    customLaunchers,

    preprocessors: {
      './bin/test.min.js': ['sourcemap']
    },

    reporters: ['spec', 'saucelabs'],

    specReporter: {
      suppressErrorSummary: false,
      suppressFailed: false,
      suppressPassed: process.env.TRAVIS,
      suppressSkipped: process.env.TRAVIS,
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
        'max-duration': 5400
      }
    },

    browserDisconnectTimeout: 10 * 1000, // 10s - default 2s
    browserDisconnectTolerance: 1, // default 0
    browserNoActivityTimeout: 4 * 60 * 1000, // 4 min - default 10s
    captureTimeout: 5 * 60 * 1000, // 5 min default 60s
    port: 9876,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: 5
  });

  if (process.env.TRAVIS) {
    config.sauceLabs.build = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    config.transports = ['polling'];
    config.browsers = Object.keys(customLaunchers);
  }
};
