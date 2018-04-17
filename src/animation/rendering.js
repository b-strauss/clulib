goog.module('clulib.animation.rendering');

const Event = goog.require('goog.events.Event');
const EventTarget = goog.require('goog.events.EventTarget');

/**
 * A render loop which runs on requestAnimationFrame.
 *
 * Dispatches RenderLoopEvents
 */
class RenderLoop extends EventTarget {
  constructor () {
    super();

    /**
     * @type {boolean}
     * @private
     */
    this.isRunning_ = false;

    /**
     * @type {?number}
     * @private
     */
    this.id_ = null;
  }

  /**
   * @returns {boolean}
   */
  get isRunning () {
    return this.isRunning_;
  }

  start () {
    if (this.isRunning_)
      return;
    this.id_ = window.requestAnimationFrame(this.tick_.bind(this));
    this.isRunning_ = true;
    this.dispatchEvent(new RenderLoopEvent(RenderLoopEventType.START, this));
  }

  /**
   * @param {number} highResolutionTimestamp
   * @private
   */
  tick_ (highResolutionTimestamp) {
    this.dispatchEvent(new RenderLoopEvent(RenderLoopEventType.TICK, this, highResolutionTimestamp));
  }

  stop () {
    if (!this.isRunning_)
      return;
    window.cancelAnimationFrame(/** @type {number} */ (this.id_));
    this.isRunning_ = false;
    this.dispatchEvent(new RenderLoopEvent(RenderLoopEventType.END, this));
  }
}

/**
 * The event for RenderLoop. Holds the elapsed time.
 */
class RenderLoopEvent extends Event {
  /**
   * @param {RenderLoopEventType} type
   * @param {RenderLoop} target
   * @param {number=} elapsedTime
   */
  constructor (type, target, elapsedTime) {
    super(type, target);

    /**
     * @type {?number}
     * @private
     */
    this.elapsedTime_ = /** @type {?number} */ (elapsedTime);
  }

  /**
   * The elapsed time since the last tick in milliseconds.
   *
   * @returns {?number}
   */
  get elapsedTime () {
    return this.elapsedTime_;
  }
}

/**
 * @enum {string}
 */
const RenderLoopEventType = {
  START: 'start',
  TICK: 'tick',
  END: 'end'
};

exports = {RenderLoop, RenderLoopEvent, RenderLoopEventType};
