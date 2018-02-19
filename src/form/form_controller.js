goog.module('clulib.form.FormController');

class FormController {
  /**
   * @param {HTMLFormElement} formElement
   * @param {boolean=} skipJsValidation
   * @param {boolean=} useNativeSubmit
   */
  constructor (formElement, skipJsValidation = false, useNativeSubmit = false) {
    /**
     * @type {HTMLFormElement}
     * @private
     */
    this.formElement_ = formElement;

    /**
     * @type {boolean}
     * @private
     */
    this.skipJsValidation_ = skipJsValidation;

    /**
     * @type {boolean}
     * @private
     */
    this.useNativeSubmit_ = useNativeSubmit;

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

  init (preventClearingOnSuccess = false, submitManually = false, step = null) {
  }

  submit () {
  }

  clear () {
  }

  destroy (keepState = false) {
  }
}

exports = FormController;
