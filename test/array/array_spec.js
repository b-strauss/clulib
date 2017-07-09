goog.provide('clulib.array.test');

goog.require('clulib.array');

goog.require('goog.array');

clulib.array.test.main = () => {
  describe('clulib.array', () => {
    describe('removeHoles', () => {
      it('should remove holes from an array', () => {
        const a = [0, 1];
        const b = clulib.array.removeHoles([0,,,1]);

        expect(a).toEqual(b);
      });
    });

    describe('asyncForEach', () => {
      it('should execute async functions for every element in an array consecutively', done => {
        const strings = ['first', 'second', 'third'];
        const stringsCopy = goog.array.clone(strings);
        const delays = [500, 200, 50];
        let result = '';

        clulib.array.asyncForEach(strings, (element, index, array) => {
          expect(array).toEqual(strings);
          expect(element).toEqual(array[index]);

          return new Promise(resolve => {
            setTimeout(() => {
              result += element;
              resolve();
            }, delays[index]);
          });
        }).then(() => {
          expect(result).toEqual(strings.join(''));
          expect(strings).toEqual(stringsCopy);
          done();
        });
      });
    });

    describe('asyncForEachRight', () => {
      it('should execute async functions for every element in an array consecutively, in reverse order', done => {
        const strings = ['first', 'second', 'third'];
        const stringsCopy = goog.array.clone(strings);
        const stringsCopyReversed = goog.array.clone(strings);
        stringsCopyReversed.reverse();

        const delays = [500, 200, 50];
        let result = '';

        clulib.array.asyncForEachRight(strings, (element, index, array) => {
          expect(array).toEqual(strings);
          expect(element).toEqual(array[index]);

          return new Promise(resolve => {
            setTimeout(() => {
              result += element;
              resolve();
            }, delays[index]);
          });
        }).then(() => {
          expect(result).toEqual(stringsCopyReversed.join(''));
          expect(strings).toEqual(stringsCopy);
          done();
        });
      });
    });
  });
};