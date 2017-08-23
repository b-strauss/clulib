goog.module('test.clulib.async.Completer');

const Completer = goog.require('clulib.async.Completer');
const AssertionError = goog.require('goog.asserts.AssertionError');

exports = function () {
  describe('clulib.async.Completer', () => {
    it('should resolve its promise', async () => {
      const com = new Completer();
      const result = 'result';

      com.resolve(result);

      const r = await com.getPromise();

      expect(r).toBe(result);
    });

    it('should reject its promise', async () => {
      const com = new Completer();
      const error = 'error';

      com.reject(error);

      try {
        await com.getPromise();
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    it('should know if its promise has completed', () => {
      const com = new Completer();

      expect(com.hasCompleted()).toBe(false);

      com.resolve();

      expect(com.hasCompleted()).toBe(true);
    });

    if (goog.DEBUG) {
      it('DEBUG - should throw an assertion error, if it\'s resolved more than once', () => {
        const com = new Completer();

        com.resolve();

        expect(() => {
          com.resolve();
        }).toThrowError(AssertionError, 'Assertion failed: Completer should not be completed more than once.');
      });

      it('DEBUG - should throw an assertion error, if it\'s rejected more than once', async () => {
        const com = new Completer();

        com.reject();

        try {
          await com.getPromise();
        } catch (error) {
          // intentionally empty
        }

        expect(() => {
          com.reject();
        }).toThrowError(AssertionError, 'Assertion failed: Completer should not be completed more than once.');
      });
    }
  });
};
