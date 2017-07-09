goog.provide('clulib.async.test');

goog.require('clulib.async');

goog.require('goog.array');

clulib.async.test.main = () => {
  describe('clulib.async', () => {
    describe('forEach', () => {
      it('should execute async functions for every element in an array consecutively', done => {
        const strings = ['first', 'second', 'third'];
        const stringsCopy = goog.array.clone(strings);
        const delays = [500, 200, 50];
        let result = '';

        clulib.async.forEach(strings, (element, index, array) => {
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

    describe('forEachRight', () => {
      it('should execute async functions for every element in an array consecutively, in reverse order', done => {
        const strings = ['first', 'second', 'third'];
        const stringsCopy = goog.array.clone(strings);
        const stringsCopyReversed = goog.array.clone(strings);
        stringsCopyReversed.reverse();

        const delays = [500, 200, 50];
        let result = '';

        clulib.async.forEachRight(strings, (element, index, array) => {
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