goog.module('clulib.form.form_controls');

const {ValidatorFn, AsyncValidatorFn} = goog.require('clulib.form.validators');

class AbstractFormControl {
  /**
   * @param {?ValidatorFn} validator
   * @param {?AsyncValidatorFn} asyncValidator
   */
  constructor (validator = null, asyncValidator = null) {
    /**
     * @type {?ValidatorFn}
     */
    this.validator = validator;

    /**
     * @type {?AsyncValidatorFn}
     */
    this.asyncValidator = asyncValidator;

    /**
     * @type {?(FormControlGroup|FormControlArray)}
     * @private
     */
    this.parent_ = null;
  }

  /**
   * @returns {?(FormControlGroup|FormControlArray)}
   */
  get parent () {
    return this.parent_;
  }
}

class FormControl extends AbstractFormControl {
}

class FormControlGroup extends AbstractFormControl {

}

class FormControlArray extends AbstractFormControl {
}

exports = {AbstractFormControl};
