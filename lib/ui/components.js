goog.provide('clulib.ui.components');

goog.require('clulib.ui.ToggleButton');

/**
 * @type {Object<string, function(new:clulib.cm.Component)>}
 */
clulib.ui.components.collection = {
  'clu-toggle-button': clulib.ui.ToggleButton
};