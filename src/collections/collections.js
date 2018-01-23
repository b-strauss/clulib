goog.module('clulib.collections');

/**
 * Converts an object to a Map.
 *
 * @param {!Object<?, ?>} object
 * @returns {Map}
 */
function objectToMap (object) {
  const map = new Map();
  for (const [key, value] of Object.entries(object)) {
    map.set(key, value);
  }
  return map;
}

/**
 * Converts a Map to an object.
 *
 * @param {!Map} map
 * @returns {Object}
 */
function mapToObject (map) {
  const object = {};
  map.forEach((value, key) => {
    object[key] = value;
  });
  return object;
}

exports = {objectToMap, mapToObject};
