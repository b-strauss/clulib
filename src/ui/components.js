goog.module('clulib.ui.components');

const ToggleButton = goog.require('clulib.ui.ToggleButton');

/**
 * @type {Object<string, function(new:clulib.cm.Component)>}
 */
const collection = {
  'clu-toggle-button': ToggleButton
};

exports = {collection};
