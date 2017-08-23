goog.module('clulib.dom');

const {getAncestor, isElement} = goog.require('goog.dom');

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

exports = {matches, closest};
