goog.module('clulib.async.Completer');

const {assert} = goog.require('goog.asserts');

/**
 * A class to produce Promise objects and to complete them later with a value or error.
 *
 * This class can be used to create Promise objects and to hand them out, without having
 * to resolve them onspot.
 *
 * @template T
 */
class Completer {
  constructor () {
    /**
     * @type {?(function((T|Promise<T>)=))}
     * @private
     */
    this.resolveFn_ = null;

    /**
     * @type {?(function(*=): void)}
     * @private
     */
    this.rejectFn_ = null;

    /**
     * @type {Promise<T>}
     * @const
     * @private
     */
    this.promise_ = new Promise((rs, rj) => {
      this.resolveFn_ = rs;
      this.rejectFn_ = rj;
    });

    /**
     * @type {boolean}
     * @private
     */
    this.completed_ = false;
  }

  /**
   * Returns the Promise associated with this Completer.
   *
   * @returns {Promise<T>}
   */
  getPromise () {
    return this.promise_;
  }

  /**
   * Resolves this Completer's Promise with the given value.
   *
   * @param {(T|Promise<T>)=} value
   */
  resolve (value = null) {
    assert(this.completed_ === false, 'Completer should not be completed more than once.');
    this.resolveFn_(value);
    this.completed_ = true;
  }

  /**
   * Rejects this Completer's Promise with the given reason.
   *
   * @param {*=} reason
   */
  reject (reason = null) {
    assert(this.completed_ === false, 'Completer should not be completed more than once.');
    this.rejectFn_(reason);
    this.completed_ = true;
  }

  /**
   * Returns true if the Completer has already been completed with value or error.
   *
   * @returns {boolean}
   */
  hasCompleted () {
    return this.completed_;
  }
}

exports = Completer;
