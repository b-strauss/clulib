goog.provide('clulib.array.test');

goog.require('clulib.array');

clulib.array.test.main = () => {
  describe('clulib.array', () => {
    describe('removeHoles', () => {
      it('should remove holes from an array', () => {
        const a = [0, 1];
        const b = clulib.array.removeHoles([0,,,1]);

        expect(a).toEqual(b);
      });
    });
  });
};