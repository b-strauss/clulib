goog.module('test.clulib.math');

const Rect = goog.require('goog.math.Rect');
const Size = goog.require('goog.math.Size');

const {mapRange, rectangleIntersects} = goog.require('clulib.math');

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

    describe('rectangleIntersects', () => {
      /**
       * @type {goog.math.Size}
       */
      const size = new Size(1024, 768);

      /**
       * @type {goog.math.Rect}
       */
      const rectA = new Rect(0, 0, size.width, size.height);

      it('should detect fully intersecting rectangles', () => {
        /**
         * @type {goog.math.Rect}
         */
        const fullyVisible = new Rect(
          size.width / 4,
          size.height / 4,
          size.width / 2,
          size.height / 2
        );

        expect(rectangleIntersects(rectA, fullyVisible)).toBe(true);
        expect(rectangleIntersects(rectA, fullyVisible, 1)).toBe(true);
      });

      it('should detect partially intersecting rectangles', () => {
        const quarterVisible = new Rect(
          size.width / 2,
          size.height / 2,
          size.width,
          size.height
        );

        expect(rectangleIntersects(rectA, quarterVisible)).toBe(true);
        expect(rectangleIntersects(rectA, quarterVisible, .23)).toBe(true);
        expect(rectangleIntersects(rectA, quarterVisible, .25)).toBe(true);
        expect(rectangleIntersects(rectA, quarterVisible, .26)).toBe(false);
      });

      it('should not detect non intersecting rectangles', () => {
        const notVisible = new Rect(
          0,
          size.height * 2,
          size.width,
          size.height
        );

        expect(rectangleIntersects(rectA, notVisible)).toBe(false);
      });

      it('should not detect non intersecting rectangles on edge', () => {
        const notVisibleOnEdge = new Rect(
          0,
          size.height,
          size.width,
          size.height
        );

        expect(rectangleIntersects(rectA, notVisibleOnEdge)).toBe(false);
      });
    });
  });
};
