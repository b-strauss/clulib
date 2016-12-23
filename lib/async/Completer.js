goog.provide('clulib.async.Completer');

/**
 * @constructor
 * @template T
 */
clulib.async.Completer = function () {
  /**
   * @type {function((T|Promise<T>|Thenable)=)}
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
   * @type {function((T|Promise<T>|Thenable)=)}
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
 * @private
 */
clulib.async.Completer.prototype.check_ = function () {
  if (this.completed_)
    throw new Error('Completer already has completed!');
};

/**
 * @returns {Promise<T>}
 */
clulib.async.Completer.prototype.getPromise = function () {
  return this.promise_;
};

/**
 * @param {(T|Promise<T>|Thenable)=} opt_value
 */
clulib.async.Completer.prototype.resolve = function (opt_value) {
  this.check_();
  this.resolveFn_(opt_value);
  this.completed_ = true;
};

/**
 * @param {*=} opt_reason
 */
clulib.async.Completer.prototype.reject = function (opt_reason) {
  this.check_();
  this.rejectFn_(opt_reason);
  this.completed_ = true;
};

/**
 * @returns {boolean}
 */
clulib.async.Completer.prototype.hasCompleted = function () {
  return this.completed_;
};