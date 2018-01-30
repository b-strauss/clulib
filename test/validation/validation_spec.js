goog.module('test.clulib.validation');

const ResponseType = goog.require('goog.net.XhrIo.ResponseType');

const validation = goog.require('clulib.validation');
const {basePath} = goog.require('testing.environment');
const http = goog.require('clulib.net.http_request');

/**
 * @returns {Promise<Blob>}
 */
async function getBlob () {
  const request = http.httpRequest(dummyJsonUrl, 'GET', null, ResponseType.BLOB);
  const result = await request.promise;

  return result.response;
}

const dummyJsonUrl = `${basePath}/test-assets/json/dummy.json`;

exports = function () {
  describe('clulib.validation', () => {
    describe('validateAge', () => {
      it('should validate a min birthdate', () => {
        jasmine.clock().install();

        // mock 2020-01-02
        jasmine.clock().mockDate(new Date(2020, 0, 2));
        expect(validation.validateAge(new Date(2002, 0, 3), 18)).toBe(false);
        expect(validation.validateAge(new Date(2002, 0, 2), 18)).toBe(true);
        expect(validation.validateAge(new Date(2002, 0, 1), 18)).toBe(true);

        // check for people born on leap year (29. February)
        // mock 2034-02-28
        jasmine.clock().mockDate(new Date(2034, 1, 28));
        expect(validation.validateAge(new Date(2016, 1, 29), 18)).toBe(false);

        jasmine.clock().mockDate(new Date(2034, 2, 1));
        expect(validation.validateAge(new Date(2016, 1, 29), 18)).toBe(true);

        jasmine.clock().uninstall();
      });
    });

    describe('validateDate', () => {
      it('should validate a date', () => {
        expect(validation.validateDate(2000, 1, 1)).toBe(true);
        // leap year
        expect(validation.validateDate(2016, 2, 29)).toBe(true);

        expect(validation.validateDate(2015, 2, 29)).toBe(false);
        expect(validation.validateDate(2015, 0, 10)).toBe(false);
        expect(validation.validateDate(2015, 20, 20)).toBe(false);
      });
    });

    describe('validateFileSize', () => {
      it('should validate for file size', async () => {
        const blob = await getBlob();

        expect(validation.validateFileSize(blob, 100 / 1000000)).toBe(true);
        expect(validation.validateFileSize(blob, 20 / 1000000)).toBe(false);
      });
    });

    describe('validateFileType', () => {
      it('should validate for file type', async () => {
        const blob = await getBlob();

        expect(validation.validateFileType(blob, ['application/json'])).toBe(true);
        expect(validation.validateFileType(blob, ['application/javascript'])).toBe(false);
      });
    });

    describe('validateMaxStringLength', () => {
      it('should validate a string for max length', () => {
        expect(validation.validateMaxStringLength('ab', 3)).toBe(true);
        expect(validation.validateMaxStringLength('abc', 3)).toBe(true);
        expect(validation.validateMaxStringLength('abcd', 3)).toBe(false);
      });
    });

    describe('validateMinStringLength', () => {
      it('should validate a string for min length', () => {
        expect(validation.validateMinStringLength('ab', 3)).toBe(false);
        expect(validation.validateMinStringLength('abc', 3)).toBe(true);
        expect(validation.validateMinStringLength('abcd', 3)).toBe(true);
      });
    });

    describe('validateMaxNumber', () => {
      it('should validate a number for max value', () => {
        expect(validation.validateMaxNumber(1, 2)).toBe(true);
        expect(validation.validateMaxNumber(2, 2)).toBe(true);
        expect(validation.validateMaxNumber(3, 2)).toBe(false);
      });
    });

    describe('validateMinNumber', () => {
      it('should validate a number for min value', () => {
        expect(validation.validateMinNumber(1, 2)).toBe(false);
        expect(validation.validateMinNumber(2, 2)).toBe(true);
        expect(validation.validateMinNumber(3, 2)).toBe(true);
      });
    });

    describe('validateRegExp', () => {
      it('should validate a regular expression', () => {
        expect(validation.validateRegExp('aa', new RegExp('[a-z]'))).toBe(true);
        expect(validation.validateRegExp('AA', new RegExp('[a-z]'))).toBe(false);

        expect(validation.validateRegExp('AA', new RegExp('[a-z]', 'i'))).toBe(true);

        expect(validation.validateRegExp('AA', /[a-z]/i)).toBe(true);
      });
    });

    describe('validateValueRequired', () => {
      it('should validate for a required value', () => {
        expect(validation.validateValueRequired(null)).toBe(false);
        expect(validation.validateValueRequired(undefined)).toBe(false);
        expect(validation.validateValueRequired('')).toBe(false);
        expect(validation.validateValueRequired('abc')).toBe(true);
        expect(validation.validateValueRequired(10)).toBe(true);
      });
    });

    describe('validateEmail', () => {
      it('should validate for a valid email adress', () => {
        expect(validation.validateEmail('')).toBe(false);
        expect(validation.validateEmail('afda@@adfad.com')).toBe(false);
        expect(validation.validateEmail('email@example.com')).toBe(true);
      });
    });

    describe('validatePostcode', () => {
      it('should validate for a valid postcode', () => {
        expect(validation.validatePostcode('000-00', ['de'])).toBe(false);
        expect(validation.validatePostcode('12345', ['de'])).toBe(true);
        expect(validation.validatePostcode('12345', ['de', 'gb'])).toBe(true);
        expect(validation.validatePostcode('AA00 0AA', ['de', 'gb'])).toBe(true);
      });
    });
  });
};
