goog.module('test.clulib.math');

const {mapRange} = goog.require('clulib.math');

exports = function () {
  describe('clulib.math', () => {
    describe('mapRange', () => {
      it('should map a value from one range to another range', () => {
        expect(mapRange(1, 0, 10, 0, 100)).toBe(10);
        expect(mapRange(5, 0, 10, 0, 100)).toBe(50);

        expect(mapRange(11, 0, 10, 0, 100)).toBe(110);
        expect(mapRange(15, 0, 10, 0, 100)).toBe(150);

        expect(mapRange(-1, 0, 10, 0, 100)).toBe(-10);
        expect(mapRange(-5, 0, 10, 0, 100)).toBe(-50);

        expect(mapRange(-5, -10, 0, -100, 0)).toBe(-50);
      });
    });
  });
};
