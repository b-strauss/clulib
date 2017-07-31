goog.module('test.clulib.array');

const cluArray = goog.require('clulib.array');
const googArray = goog.require('goog.array');

exports = function () {
  describe('clulib.array', () => {
    describe('removeHoles', () => {
      it('should remove holes from an array', () => {
        const a = [0, 1];
        const b = cluArray.removeHoles([0, , , 1]);
        
        expect(a).toEqual(b);
      });
    });
    
    describe('asyncForEach', () => {
      it('should execute async functions for every element in an array consecutively', done => {
        const strings = ['first', 'second', 'third'];
        const delays = [500, 200, 50];
        let result = '';
        
        cluArray.asyncForEach(strings, (element, index, array) => {
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
      
      it('should preserve the original array', done => {
        const strings = ['first', 'second', 'third'];
        const stringsCopy = googArray.clone(strings);
        
        cluArray.asyncForEach(strings, () => Promise.resolve())
          .then(() => {
            expect(strings).toEqual(stringsCopy);
            done();
          });
      });
    });
    
    describe('asyncForEachRight', () => {
      it('should execute async functions for every element in an array consecutively, in reverse order', done => {
        const strings = ['first', 'second', 'third'];
        const stringsCopyReversed = googArray.clone(strings);
        stringsCopyReversed.reverse();
        
        const delays = [500, 200, 50];
        let result = '';
        
        cluArray.asyncForEachRight(strings, (element, index, array) => {
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
          done();
        });
      });
      
      it('should preserve the original array', done => {
        const strings = ['first', 'second', 'third'];
        const stringsCopy = googArray.clone(strings);
        
        cluArray.asyncForEachRight(strings, () => Promise.resolve())
          .then(() => {
            expect(strings).toEqual(stringsCopy);
            done();
          });
      });
    });
  });
};
