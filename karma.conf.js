'use strict';

const browsers = require('./browsers.conf.js');

module.exports = function (config) {
  config.set({

    frameworks: ['jasmine'],

    files: ['./bin/test.js'],

    customLaunchers: browsers.sauceLabsLaunchers,

    preprocessors: {
      './bin/test.js': ['sourcemap']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    sauceLabs: {
      testName: 'clulib',
      retryLimit: 3,
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      options: {
        'selenium-version': '2.53.0',
        'command-timeout': 600,
        'idle-timeout': 600,
        'max-duration': 5400,
      }
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity
  });
};