goog.module('clulib.form.validators');

const {AbstractFormControl} = goog.require('clulib.form.form_controls');

/**
 * @typedef {IObject<string, *>}
 */
// eslint-disable-next-line init-declarations
let ValidationErrors;

/**
 * @typedef {function(AbstractFormControl):?ValidationErrors}
 */
// eslint-disable-next-line init-declarations
let ValidatorFn;

/**
 * @typedef {function(AbstractFormControl):Promise<?ValidationErrors>}
 */
// eslint-disable-next-line init-declarations
let AsyncValidatorFn;

exports = {ValidationErrors, ValidatorFn, AsyncValidatorFn};
