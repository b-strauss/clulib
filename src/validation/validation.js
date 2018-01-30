goog.module('clulib.validation');

const {objectToMap} = goog.require('clulib.collections');

/**
 * Map of postcodes by country.
 *
 * @type {Map<string, RegExp>}
 */
const postcodes = objectToMap({
  // Argentina
  'ar': /^[B-T]{1}\\d{4}[A-Z]{3}$/i,
  // Austria
  'at': /^[0-9]{4}$/i,
  // Australia
  'au': /^[2-9][0-9]{2,3}$/i,
  // Belgium
  'be': /^[1-9][0-9]{3}$/i,
  // Canada
  'ca': /^[a-z][0-9][a-z][ \t-]*[0-9][a-z][0-9]$/i,
  // Switzerland
  'ch': /^[0-9]{4}$/i,
  // China
  'cn': /^[0-9]{6}$/i,
  // Germany
  'de': /^[0-9]{5}$/i,
  // Denmark
  'dk': /^(DK-)?[0-9]{4}$/i,
  // Estonia
  'ee': /^[0-9]{5}$/i,
  // Spain
  'es': /^[0-4][0-9]{4}$/i,
  // Finland
  'fi': /^(FI-)?[0-9]{5}$/i,
  // France
  'fr': /^(0[1-9]|[1-9][0-9])[0-9][0-9][0-9]$/i,
  // Great Britain
  // eslint-disable-next-line max-len
  'gb': /^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/,
  // India
  'in': /^[1-9]{1}[0-9]{2}(\\s|-)?[0-9]{3}$/i,
  // Italy
  'it': /^[0-9]{5}$/i,
  // Iceland
  'is': /^[0-9]{3}$/i,
  // Latvia
  'lv': /^(LV-)?[1-9][0-9]{3}$/i,
  // Mexico
  'mx': /^[0-9]{5}$/i,
  // Netherlands
  'nl': /^[0-9]{4}.?[a-z]{2}$/i,
  // Norway
  'no': /^[0-9]{4}$/i,
  // New Zealand
  'nz': /^[0-9]{4}$/i,
  // Poland
  'pl': /^[0-9]{2}-[0-9]{3}$/i,
  // Portugal
  'pt': /^[0-9]{4}-[0-9]{3}$/i,
  // Romania
  'ro': /^[0-9]{6}$/i,
  // Russian Federation
  'ru': /^[0-9]{6}$/i,
  // Sweden
  'se': /^[0-9]{3}\s?[0-9]{2}$/i,
  // Turkey
  'tr': /^[0-9]{5}$/i,
  // United States
  'us': /^[0-9]{5}((-| )[0-9]{4})?$/i
});

/**
 * Validates for a min age.
 *
 * @param {Date} birthDate The birthdate
 * @param {number} minAge Min. age in years
 * @returns {boolean} True if the date is older than minAge
 */
function validateAge (birthDate, minAge) {
  const now = new Date();
  const deadlineDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());

  return deadlineDate.getTime() >= birthDate.getTime();
}

/**
 * Checks if a date is valid and exists.
 *
 * @param {number} year Full year
 * @param {number} month Month, 1 = january
 * @param {number} day Day
 * @returns {boolean} True if the date is valid
 */
function validateDate (year, month, day) {
  month -= 1;

  const date = new Date(year, month, day);

  return date.getFullYear() === year
    && date.getMonth() === month
    && date.getDate() === day;
}

/**
 * Checks if a File does not exceed a maximum size.
 *
 * @param {Blob} blob File object
 * @param {number} maxSize Max size in Megabytes
 * @returns {boolean} True if the file is not too large
 */
function validateFileSize (blob, maxSize) {
  const bytes = maxSize * 1000000;

  return blob.size <= bytes;
}

/**
 * Checks if a File is of certain mime types.
 *
 * @param {Blob} blob File object
 * @param {Array<string>} mimeTypes allowed mime types
 * @returns {boolean} True if the File has one of the mime types
 */
function validateFileType (blob, mimeTypes) {
  return mimeTypes.reduce((old, currentMimeType) => {
    return blob.type === currentMimeType || old;
  }, false);
}

/**
 * Validates a string for max length, does not count whitespace.
 *
 * @param {string} string
 * @param {number} maxLength
 * @returns {boolean}
 */
function validateMaxStringLength (string, maxLength) {
  string = string.trim();
  return validateMaxNumber(string.length, maxLength);
}

/**
 * Validates a string for min length, does not count whitespace.
 *
 * @param {string} string
 * @param {number} minLength
 * @returns {boolean}
 */
function validateMinStringLength (string, minLength) {
  string = string.trim();
  return validateMinNumber(string.length, minLength);
}

/**
 * Validates a number for max value.
 *
 * @param {number} number
 * @param {number} maxValue
 * @returns {boolean}
 */
function validateMaxNumber (number, maxValue) {
  return number <= maxValue;
}

/**
 * Validates a number for min value.
 *
 * @param {number} number
 * @param {number} minValue
 * @returns {boolean}
 */
function validateMinNumber (number, minValue) {
  return number >= minValue;
}

/**
 * Validates a string with a regular expression.
 *
 * @param {string} string
 * @param {RegExp} regExp
 * @returns {boolean}
 */
function validateRegExp (string, regExp) {
  return regExp.test(string);
}

/**
 * Validates a value that is required (neither null or undefined, or not empty if it's a string).
 *
 * @param {?} value
 * @returns {boolean}
 */
function validateValueRequired (value) {
  if (goog.isString(value))
    return validateMinStringLength(value, 1);
  else
    return value != null;
}

/**
 * Validates if an email adress is valid.
 *
 * @param {string} string
 * @returns {boolean}
 */
function validateEmail (string) {
  // eslint-disable-next-line no-useless-escape,max-len
  return validateRegExp(string, /^[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i);
}

/**
 * Validates a postcode by country array (see {@link postcodes} for values).
 *
 * @param {string} string
 * @param {Array<string>} countries An array of country codes.
 * @returns {boolean}
 */
function validatePostcode (string, countries) {
  return countries.reduce((old, country) => {
    if (!postcodes.has(country))
      throw new Error(`Postcode for country '${country}' is not defined.`);
    const postcodeRegExp = postcodes.get(country);
    return old || validateRegExp(string, postcodeRegExp);
  }, false);
}

exports = {
  validateAge,
  validateDate,
  validateFileSize,
  validateFileType,
  validateMaxStringLength,
  validateMinStringLength,
  validateMaxNumber,
  validateMinNumber,
  validateRegExp,
  validateValueRequired,
  validateEmail,
  validatePostcode
};
