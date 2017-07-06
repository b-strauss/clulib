goog.provide('clulib.async.test');

goog.require('clulib.async');

clulib.async.test.main = () => {
  describe('clulib.async', () => {
    describe('forEach', () => {
      it('should execute promises for every element in an array consecutively', done => {
        const strings = ['first', 'second', 'third'];
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
          done();
        });
      });
    });
  });
};