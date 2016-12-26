goog.provide('clulib.cm.AbstractComponent');

goog.require('goog.ui.Component');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
clulib.cm.AbstractComponent = function () {
  clulib.cm.AbstractComponent.base(this, 'constructor');

  /**
   * @type {clulib.cm.ComponentManager}
   */
  this.manager = null;

  /**
   * @type {string}
   */
  this.type = null;

  /**
   * @type {?*}
   */
  this.config = null;
};

goog.inherits(
    clulib.cm.AbstractComponent,
    goog.ui.Component
);

/**
 * @returns {Promise}
 */
clulib.cm.AbstractComponent.prototype.waitFor = function () {
  return Promise.resolve();
};

clulib.cm.AbstractComponent.prototype.onInit = function () {
};

/**
 * @override
 * @protected
 */
clulib.cm.AbstractComponent.prototype.disposeInternal = function () {
  this.onDispose();
  clulib.cm.AbstractComponent.base(this, 'disposeInternal');
  // TODO: call component manager "dispose childs for"
};

clulib.cm.AbstractComponent.prototype.onDispose = function () {
};