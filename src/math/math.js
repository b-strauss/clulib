goog.module('clulib.math');

const Rect = goog.require('goog.math.Rect');

/**
 * Maps a value from one range to another range.
 *
 * @param {number} x
 * @param {number} inMin
 * @param {number} inMax
 * @param {number} outMin
 * @param {number} outMax
 * @returns {number}
 */
function mapRange (x, inMin, inMax, outMin, outMax) {
  return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

/**
 * Returns true if a rectangle intersects another rectangle.
 *
 * Takes a factor to specify how much of rectangleB needs to intersect rectangleA.
 *
 * @param {goog.math.Rect} rectangleA
 * @param {goog.math.Rect} rectangleB
 * @param {?number|null} factor The factor from 0 (not intersecting) to 1 (completely intersecting)
 * @returns {boolean}
 */
function rectangleIntersects (rectangleA, rectangleB, factor = null) {
  /**
   * @type {goog.math.Rect}
   */
  const intersectionRect = Rect.intersection(rectangleA, rectangleB);

  // If no intersection exists or the area is zero, return false
  if (intersectionRect == null || intersectionRect.getSize().area() === 0)
    return false;

  // If no percentage calculation is needed, return true
  if (factor == null)
    return true;

  const visibleFactor = intersectionRect.getSize().area() / rectangleB.getSize().area();

  return visibleFactor >= factor;
}

exports = {mapRange, rectangleIntersects};
