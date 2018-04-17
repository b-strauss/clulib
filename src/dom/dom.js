goog.module('clulib.dom');

const {getAncestor, isElement, getViewportSize} = goog.require('goog.dom');
const Rect = goog.require('goog.math.Rect');

const {rectangleIntersects} = goog.require('clulib.math');

/**
 * Returns true if the element would be selected by the specified
 * selector string, false otherwise.
 *
 * @param {Element} element
 * @param {string} selector
 * @returns {boolean}
 */
function matches (element, selector) {
  /**
   * @type {function(this:Element, string):boolean}
   */
  let matches = element['matches'] ||
    element['matchesSelector'] ||
    element['webkitMatchesSelector'] ||
    element['mozMatchesSelector'] ||
    element['msMatchesSelector'];

  return matches.call(element, selector);
}

/**
 * Returns the closest ancestor of the specified element (or the specified element itself)
 * which matches the selector. Returns null, if there is no such ancestor.
 *
 * @param {Element} element
 * @param {string} selector
 * @returns {?Element}
 */
function closest (element, selector) {
  if (element['closest'] != null) {
    return /** @type {?Element} */ (element['closest'](selector));
  } else {
    return /** @type {?Element} */ (getAncestor(element, node => {
      if (isElement(node))
        return matches(/** @type {Element} */ (node), selector);
      else
        return false;
    }, true));
  }
}

/**
 * Returns true if an element is visible inside the viewport.
 *
 * Takes a factor to specify how much of the element needs to be visible.
 *
 * @param {Element} element
 * @param {?number|null} factor The factor from 0 (not visible) to 1 (completely visible)
 * @returns {boolean}
 */
function isElementVisible (element, factor = null) {
  /**
   * @type {goog.math.Size}
   */
  const viewportSize = getViewportSize();

  /**
   * @type {goog.math.Rect}
   */
  const viewportRect = new Rect(0, 0, viewportSize.width, viewportSize.height);

  const boundingRect = element.getBoundingClientRect();

  /**
   * @type {goog.math.Rect}
   */
  const elementRect = new Rect(boundingRect.left, boundingRect.top, boundingRect.width, boundingRect.height);

  return rectangleIntersects(viewportRect, elementRect, factor);
}

exports = {matches, closest, isElementVisible};
