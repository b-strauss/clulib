goog.module('test.clulib.array');

const {clone} = goog.require('goog.array');

const {removeHoles, asyncForEach, asyncForEachRight} = goog.require('clulib.array');

exports = function () {
  describe('clulib.array', () => {
    describe('removeHoles', () => {
      it('should remove holes from an array', () => {
        const a = [0, 1];
        const b = removeHoles([0, , , 1]);

        expect(a).toEqual(b);
      });
    });

    describe('asyncForEach', () => {
      it('should execute async functions for every element in an array consecutively', async () => {
        const strings = ['first', 'second', 'third'];
        const delays = [500, 200, 50];
        let result = '';

        await asyncForEach(strings, (element, index, array) => {
          expect(array).toEqual(strings);
          expect(element).toEqual(array[index]);

          return new Promise(resolve => {
            setTimeout(() => {
              result += element;
              resolve();
            }, delays[index]);
          });
        });

        expect(result).toEqual(strings.join(''));
      });

      it('should preserve the original array', async () => {
        const strings = ['first', 'second', 'third'];
        const stringsCopy = clone(strings);

        await asyncForEach(strings, () => Promise.resolve());

        expect(strings).toEqual(stringsCopy);
      });
    });

    describe('asyncForEachRight', () => {
      it('should execute async functions for every element in an array consecutively, in reverse order', async () => {
        const strings = ['first', 'second', 'third'];
        const stringsCopyReversed = clone(strings);
        stringsCopyReversed.reverse();

        const delays = [500, 200, 50];
        let result = '';

        await asyncForEachRight(strings, (element, index, array) => {
          expect(array).toEqual(strings);
          expect(element).toEqual(array[index]);

          return new Promise(resolve => {
            setTimeout(() => {
              result += element;
              resolve();
            }, delays[index]);
          });
        });

        expect(result).toEqual(stringsCopyReversed.join(''));
      });

      it('should preserve the original array', async () => {
        const strings = ['first', 'second', 'third'];
        const stringsCopy = clone(strings);

        await asyncForEachRight(strings, () => Promise.resolve());

        expect(strings).toEqual(stringsCopy);
      });
    });
  });
};
