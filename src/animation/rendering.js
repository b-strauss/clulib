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

/**
 * Returns a Promise that resolves after a specified number of browser repaints.
 *
 * @param {number=} frames The frames to wait for
 * @returns {Promise}
 */
function waitForFrames (frames = 1) {
  return new Promise(resolve => {
    let frameCount = 0;

    function onTick () {
      if (++frameCount === frames)
        resolve();
      else
        window.requestAnimationFrame(onTick);
    }

    window.requestAnimationFrame(onTick);
  });
}

/**
 * Throttles a function to be only called on repaint.
 *
 * Arguments are passed down.
 *
 * @param {Function} func
 * @returns {Function}
 */
function throttle (func) {
  let isRunning = false;
  return function (...args) {
    if (isRunning)
      return;
    isRunning = true;
    window.requestAnimationFrame(() => {
      func(...args);
      isRunning = false;
    });
  };
}

exports = {RenderLoop, RenderLoopEvent, RenderLoopEventType, waitForFrames, throttle};
