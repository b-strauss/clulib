goog.module('test.clulib.functions');

const {cacheAsyncValue} = goog.require('clulib.functions');

exports = function () {
  describe('clulib.functions', () => {
    describe('cacheAsyncValue', () => {
      it('should cache its return value', async () => {
        let called = 0;
        const cachedFunction = cacheAsyncValue(() => {
          return new Promise(resolve => {
            called++;
            resolve('result');
          });
        });

        let result = await cachedFunction();

        expect(result).toBe('result');
        expect(called).toBe(1);

        result = await cachedFunction();

        expect(result).toBe('result');
        expect(called).toBe(1);
      });

      it('should cache its error', async () => {
        let called = 0;
        const cachedFunction = cacheAsyncValue(() => {
          return new Promise((_, reject) => {
            called++;
            reject(new Error('CachedError'));
          });
        });

        let error = null;

        try {
          await cachedFunction();
        } catch (e) {
          error = e;
        }

        expect(error.message).toBe('CachedError');
        expect(called).toBe(1);

        try {
          await cachedFunction();
        } catch (e) {
          error = e;
        }

        expect(error.message).toBe('CachedError');
        expect(called).toBe(1);
      });
    });
  });
};
