goog.provide('clulib.async.Completer');

goog.require('goog.asserts');

/**
 * TODO: docs
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
 * @returns {Promise<T>}
 */
clulib.async.Completer.prototype.getPromise = function () {
  return this.promise_;
};

/**
 * @param {(T|Promise<T>)=} value
 */
clulib.async.Completer.prototype.resolve = function (value = null) {
  goog.asserts.assert(this.completed_ === false, 'Completer should not be completed more than once.');
  this.resolveFn_(value);
  this.completed_ = true;
};

/**
 * @param {*=} reason
 */
clulib.async.Completer.prototype.reject = function (reason = null) {
  goog.asserts.assert(this.completed_ === false, 'Completer should not be completed more than once.');
  this.rejectFn_(reason);
  this.completed_ = true;
};

/**
 * @returns {boolean}
 */
clulib.async.Completer.prototype.hasCompleted = function () {
  return this.completed_;
};