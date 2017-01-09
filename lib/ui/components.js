goog.provide('clulib.ui.components');

goog.require('clulib.ui.ToggleButton');

goog.require('goog.structs.Map');

/**
 * @type {goog.structs.Map<string, function(new:clulib.cm.Component)>}
 */
clulib.ui.components.collection = new goog.structs.Map({
  'clu-toggle-button': clulib.ui.ToggleButton
});