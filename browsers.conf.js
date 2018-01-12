'use strict';

const desktop = {
  'SL_CHROME': {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10'
  },
  'SL_FIREFOX': {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 10'
  },
  'SL_IE': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 10'
  },
  'SL_EDGE': {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10'
  },
  'SAFARI': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'macOS 10.12'
  }
};

const mobile = {
  'SL_IOS_10': {
    base: 'SauceLabs',
    browserName: 'Safari',
    appiumVersion: '1.6.4',
    deviceName: 'iPhone 7 Simulator',
    deviceOrientation: 'portrait',
    platformVersion: '10.3',
    platformName: 'iOS'
  },
  'SL_IOS_11': {
    base: 'SauceLabs',
    browserName: 'Safari',
    appiumVersion: '1.7.1',
    deviceName: 'iPhone 8 Simulator',
    deviceOrientation: 'portrait',
    platformVersion: '11.0',
    platformName: 'iOS'
  },
  'SL_ANDROID_4.4': {
    base: 'SauceLabs',
    browserName: 'Browser',
    appiumVersion: '1.6.4',
    deviceName: 'Android Emulator',
    deviceOrientation: 'portrait',
    platformVersion: '4.4',
    platformName: 'Android'
  },
  'SL_ANDROID_5.1': {
    base: 'SauceLabs',
    browserName: 'Browser',
    appiumVersion: '1.6.4',
    deviceName: 'Android Emulator',
    deviceOrientation: 'portrait',
    platformVersion: '5.1',
    platformName: 'Android'
  },
  'SL_ANDROID_6.0': {
    base: 'SauceLabs',
    browserName: 'Chrome',
    appiumVersion: '1.6.4',
    deviceName: 'Android Emulator',
    deviceOrientation: 'portrait',
    platformVersion: '6.0',
    platformName: 'Android'
  },
  'SL_ANDROID_7.1': {
    base: 'SauceLabs',
    browserName: 'Chrome',
    appiumVersion: '1.6.5',
    deviceName: 'Android GoogleAPI Emulator',
    deviceOrientation: 'portrait',
    platformVersion: '7.1',
    platformName: 'Android'
  }
};

module.exports = {
  customLaunchers: Object.assign({}, desktop, mobile)
};
