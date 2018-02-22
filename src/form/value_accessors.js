goog.module('clulib.form.value_accessors');

const EventType = goog.require('goog.events.EventType');
const {listen, unlistenByKey} = goog.require('goog.events');
const Disposable = goog.require('goog.Disposable');

/**
 * @abstract
 */
class ValueAccessor extends Disposable {
  /**
   * @param {Element} element
   */
  constructor (element) {
    super();

    /**
     * @type {Element}
     * @private
     */
    this.element_ = element;

    /**
     * @type {?function(*):void}
     * @protected
     */
    this.onChange = null;

    /**
     * @type {?function():void}
     * @protected
     */
    this.onTouched = null;
  }

  /**
   * @returns {Element}
   */
  get element () {
    return this.element_;
  }

  /**
   * @param {?function(*):void} fn
   */
  setOnChange (fn) {
    this.onChange = fn;
  }

  /**
   * @param {?function():void} fn
   */
  setOnTouched (fn) {
    this.onTouched = fn;
  }

  /**
   * @param {boolean} isDisabled
   * @abstract
   */
  setDisabledState (isDisabled) {
  }
}

class TextValueAccessor extends ValueAccessor {
  constructor (element) {
    super(element);

    /**
     * @type {goog.events.Key}
     */
    this.inputKey_ = listen(this.element, EventType.INPUT, () => {
      this.onChange((/** @type {HTMLInputElement} */ (element)).value);
    });

    /**
     * @type {goog.events.Key}
     */
    this.blurKey_ = listen(this.element, EventType.BLUR, () => {
      this.onTouched();
    });
  }

  /**
   * @param {boolean} isDisabled
   */
  setDisabledState (isDisabled) {
    (/** @type {HTMLInputElement} */ (element)).disabled = isDisabled;
  }

  /**
   * @protected
   */
  disposeInternal () {
    unlistenByKey(this.inputKey_);
    unlistenByKey(this.blurKey_);

    super.disposeInternal();
  }
}

exports = {ValueAccessor, TextValueAccessor};
