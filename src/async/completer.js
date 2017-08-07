goog.provide('clulib.async.Completer');

goog.require('goog.asserts');

/**
 * A class to produce [Promise] objects and to complete them later with a value or error.
 *
 * This class can be used to create [Promise] objects and to hand them out, without having
 * to resolve them onspot.
 *
 * @constructor
 * @template T
 */
clulib.async.Completer = function () {
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
};

/**
 * Returns the [Promise] associated with this Completer.
 *
 * @returns {Promise<T>}
 */
clulib.async.Completer.prototype.getPromise = function () {
  return this.promise_;
};

/**
 * Resolves this Completer's Promise with the given value.
 *
 * @param {(T|Promise<T>)=} value
 */
clulib.async.Completer.prototype.resolve = function (value = null) {
  goog.asserts.assert(this.completed_ === false, 'Completer should not be completed more than once.');
  this.resolveFn_(value);
  this.completed_ = true;
};

/**
 * Rejects this Completer's Promise with the given reason.
 *
 * @param {*=} reason
 */
clulib.async.Completer.prototype.reject = function (reason = null) {
  goog.asserts.assert(this.completed_ === false, 'Completer should not be completed more than once.');
  this.rejectFn_(reason);
  this.completed_ = true;
};

/**
 * Returns true if the Completer has already been completed with value or error.
 *
 * @returns {boolean}
 */
clulib.async.Completer.prototype.hasCompleted = function () {
  return this.completed_;
};
