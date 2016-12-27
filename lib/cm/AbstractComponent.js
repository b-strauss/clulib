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
 * @param {string} selector
 * @returns {?clulib.cm.AbstractComponent}
 */
clulib.cm.AbstractComponent.prototype.queryComponent = function (selector) {
  return this.manager.getComponentForElement(this.getElement().querySelector(selector));
};

/**
 * @param {string} selector
 * @returns {Array<clulib.cm.AbstractComponent>}
 */
clulib.cm.AbstractComponent.prototype.queryComponentAll = function (selector) {
  return this.manager.getComponentsForElementArray(Array.from(this.getElement().querySelectorAll(selector)));
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