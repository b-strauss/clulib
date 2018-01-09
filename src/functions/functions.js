goog.module('clulib.functions');

/**
 * Creates an async function that runs the provided parameter 'func'
 * async function only once.
 *
 * When called for the first time, the given async function is called
 * and its returned result or error is cached. Subsequent calls will
 * return the cached result or error.
 *
 * @param {function():Promise<T>} func
 * @returns {function():Promise<T>}
 * @template T
 */
function cacheAsyncValue (func) {
  let done = false;
  let isError = false;

  /**
   * @type {T}
   */
  let result = null;
  let error = null;

  return async function () {
    if (!done) {
      try {
        result = await func();
      } catch (e) {
        error = e;
        isError = true;
      } finally {
        done = true;
      }
    }

    if (isError)
      throw error;
    else
      return result;
  };
}

exports = {cacheAsyncValue};
