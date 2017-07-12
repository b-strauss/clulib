goog.provide('clulib.array');

/**
 * @param {Array} array
 * @returns {Array}
 */
clulib.array.removeHoles = function (array) {
  return array.filter(() => true);
};

/**
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
