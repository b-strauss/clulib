goog.module('clulib.form.value_accessors');

/**
 * @abstract
 */
class ValueAccessor {
  /**
   * @param {Element} element
   */
  constructor (element) {
    /**
     * @type {Element}
     * @private
     */
    this.element_ = element;

    /**
     * @type {function(*):void}
     * @private
     */
    this.onChange_ = () => {
    };

    /**
     * @type {function():void}
     * @private
     */
    this.onTouched_ = () => {
    };
  }

  /**
   * @param {function(*):void} fn
   */
  setOnChange (fn) {
    this.onChange_ = fn;
  }

  /**
   * @param {function():void} fn
   */
  setOnTouched (fn) {
    this.onTouched_ = fn;
  }
}
