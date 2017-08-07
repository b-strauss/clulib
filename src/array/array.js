goog.provide('clulib.array');

/**
 * Removes all holes from an array.
 *
 * See {@link https://tinyurl.com/2ality-holes-arrays}.
 *
 * @param {Array} array
 * @returns {Array}
 */
clulib.array.removeHoles = function (array) {
  return array.filter(() => true);
};

/**
 * Calls an async function for each element in an array. Subsequent
 * functions are only executed after the Promise returned by the
 * preceding function resolves.
 *
 * The returned Promise resolves after all async functions for every
 * element have resolved.
 *
 * @param {Array<T>} array
 * @param {function(T, number, Array<T>): Promise} action
 * @returns {Promise}
 * @template T
 */
clulib.array.asyncForEach = function (array, action) {
  return array.reduce((promise, element, index, arr) => {
    return promise.then(() => action(element, index, arr));
  }, Promise.resolve());
};

/**
 * Calls an async function for each element in an array, starting from
 * the last element rather than the first. Subsequent functions are only
 * executed after the Promise returned by the preceding function resolves.
 *
 * The returned Promise resolves after all async functions for every
 * element have resolved.
 *
 * @param {Array<T>} array
 * @param {function(T, number, Array<T>): Promise} action
 * @returns {Promise}
 * @template T
 */
clulib.array.asyncForEachRight = function (array, action) {
  return array.reduceRight((promise, element, index, arr) => {
    return promise.then(() => action(element, index, arr));
  }, Promise.resolve());
};
