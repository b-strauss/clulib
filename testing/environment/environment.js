goog.module('testing.environment');

/**
 * @type {boolean}
 */
const isLocal = window['isLocal'] === true;

/**
 * @type {string}
 */
const basePath = isLocal ? '.' : 'base';

exports = {isLocal, basePath};
