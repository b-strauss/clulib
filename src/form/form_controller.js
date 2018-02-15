goog.module('clulib.form.FormController');

class FormController {
  /**
   * @param {HTMLFormElement} formElement
   * @param {boolean=} usePageReload
   * @param {boolean=} skipJsValidation
   * @param {boolean=} skipServerValidation
   */
  constructor (formElement, usePageReload = false, skipJsValidation = false, skipServerValidation = false) {
    /**
     * @type {HTMLFormElement}
     * @private
     */
    this.formElement_ = formElement;

    /**
     * @type {boolean}
     * @private
     */
    this.usePageReload_ = usePageReload;

    /**
     * @type {boolean}
     * @private
     */
    this.skipJsValidation_ = skipJsValidation;

    /**
     * @type {boolean}
     * @private
     */
    this.skipServerValidation_ = skipServerValidation;

    /**
     * @type {function():Map}
     */
    this.additionalDataProvider = null;
  }

  /**
   * @returns {HTMLFormElement}
   */
  get formElement () {
    return this.formElement_;
  }

  init (preventClearingOnSuccess = false, sendManually = false, step = null) {
  }

  send () {
  }

  clear () {
  }

  destroy (keepState = false) {
  }
}

exports = FormController;
