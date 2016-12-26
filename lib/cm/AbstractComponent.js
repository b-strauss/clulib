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
  this.getElement().removeAttribute(this.manager.getIdAttribute());
  clulib.cm.AbstractComponent.base(this, 'disposeInternal');
  this.manager.disposeNode(this.getId());
};

clulib.cm.AbstractComponent.prototype.onDispose = function () {
};