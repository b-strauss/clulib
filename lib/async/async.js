goog.provide('clulib.async');

/**
 * @param {Array<T>} array
 * @param {function(T, number, Array<T>): Promise} action
 * @returns {Promise}
 * @template T
 */
clulib.async.forEach = function (array, action) {
  return array.reduce((promise, element, index, arr) => {
    return promise.then(() => action(element, index, arr));
  }, Promise.resolve());
};

/**
 * @param {Array<T>} array
 * @param {function(T, number, Array<T>): Promise} action
 * @returns {Promise}
 * @template T
 */
clulib.async.forEachRight = function (array, action) {
  return clulib.async.forEach(array.reverse(), action);
};