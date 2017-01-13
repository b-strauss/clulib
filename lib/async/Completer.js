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
   * @type {function((T|Promise<T>)=)}
   */
  let resolve;

  /**
   * @type {function(*=): void}
   */
  let reject;

  /**
   * @type {Promise<T>}
   * @private
   */
  this.promise_ = new Promise(function (rs, rj) {
    resolve = rs;
    reject = rj;
  });

  /**
   * @type {function((T|Promise<T>)=)}
   * @private
   */
  this.resolveFn_ = resolve;

  /**
   * @type {function(*=): void}
   * @private
   */
  this.rejectFn_ = reject;

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
 * @param {(T|Promise<T>)=} opt_value
 */
clulib.async.Completer.prototype.resolve = function (opt_value) {
  goog.asserts.assert(this.completed_ == false, 'Completer should not be completed more than once.');
  this.resolveFn_(opt_value);
  this.completed_ = true;
};

/**
 * @param {*=} opt_reason
 */
clulib.async.Completer.prototype.reject = function (opt_reason) {
  goog.asserts.assert(this.completed_ == false, 'Completer should not be completed more than once.');
  this.rejectFn_(opt_reason);
  this.completed_ = true;
};

/**
 * @returns {boolean}
 */
clulib.async.Completer.prototype.hasCompleted = function () {
  return this.completed_;
};