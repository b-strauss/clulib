goog.provide('clulib.async');

goog.require('clulib.array');

/**
 * @param {Array<T>} array
 * @param {function(T, number, Array<T>): Promise} action
 * @returns {Promise}
 * @template T
 * @deprecated Use [clulib.array.asyncForEach] instead
 */
clulib.async.forEach = clulib.array.asyncForEach;

/**
 * @param {Array<T>} array
 * @param {function(T, number, Array<T>): Promise} action
 * @returns {Promise}
 * @template T
 * @deprecated Use [clulib.array.asyncForEachRight] instead
 */
clulib.async.forEachRight = clulib.array.asyncForEachRight;