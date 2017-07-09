'use strict';

const desktop = {
  // 'SL_CHROME': {
  //   base: 'SauceLabs',
  //   browserName: 'chrome',
  //   platform: 'Windows 10',
  // },
  // 'SL_FIREFOX': {
  //   base: 'SauceLabs',
  //   browserName: 'firefox',
  //   platform: 'Windows 10',
  // },
  // 'SL_IE_11': {
  //   base: 'SauceLabs',
  //   browserName: 'internet explorer',
  //   platform: 'Windows 8.1',
  //   version: '11'
  // },
  // 'SL_EDGE_14': {
  //   base: 'SauceLabs',
  //   browserName: 'MicrosoftEdge',
  //   platform: 'Windows 10',
  //   version: '14'
  // },
  // 'SL_EDGE_15': {
  //   base: 'SauceLabs',
  //   browserName: 'MicrosoftEdge',
  //   platform: 'Windows 10',
  //   version: '15'
  // },
  // 'SL_SAFARI_9': {
  //   base: 'SauceLabs',
  //   browserName: 'safari',
  //   platform: 'OS X 10.11',
  //   version: '9'
  // },
  // 'SL_SAFARI_10': {
  //   base: 'SauceLabs',
  //   browserName: 'safari',
  //   platform: 'macOS 10.12',
  //   version: '10'
  // }
};

const mobile = {
  'SL_IOS_9': {
    base: 'SauceLabs',
    browserName: 'Safari',
    appiumVersion: '1.6.4',
    deviceName: 'iPhone 6 Plus Simulator',
    deviceOrientation: 'portrait',
    platformVersion: '9.3',
    platformName: 'iOS'
  },
  'SL_IOS_10': {
    base: 'SauceLabs',
    browserName: 'Safari',
    appiumVersion: '1.6.4',
    deviceName: 'iPhone 7 Plus Simulator',
    deviceOrientation: 'portrait',
    platformVersion: '10.3',
    platformName: 'iOS'
  },
  // 'SL_ANDROID_4.4': {
  //   base: 'SauceLabs',
  //   browserName: 'android',
  //   platform: 'Linux',
  //   version: '4.4'
  // },
  // 'SL_ANDROID_5.0': {
  //   base: 'SauceLabs',
  //   browserName: 'android',
  //   platform: 'Linux',
  //   version: '5.0'
  // },
  // 'SL_ANDROID_5.1': {
  //   base: 'SauceLabs',
  //   browserName: 'android',
  //   platform: 'Linux',
  //   version: '5.1'
  // },
  // 'SL_ANDROID_6.0': {
  //   base: 'SauceLabs',
  //   browserName: 'android',
  //   platform: 'Linux',
  //   version: '6.0'
  // },
  // 'SL_ANDROID_7.0': {
  //   base: 'SauceLabs',
  //   browserName: 'android',
  //   platform: 'Linux',
  //   version: '7.0'
  // },
  // 'SL_ANDROID_7.1': {
  //   base: 'SauceLabs',
  //   browserName: 'android',
  //   platform: 'Linux',
  //   version: '7.1'
  // }
};

module.exports = {
  customLaunchers: Object.assign({}, desktop, mobile)
};