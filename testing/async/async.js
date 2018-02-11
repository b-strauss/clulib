goog.module('testing.async');

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function waitFor (ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

exports = {
  waitFor
};
