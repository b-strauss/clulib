goog.provide('clulib.cm.AbstractComponent');

goog.require('goog.ui.Component');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
clulib.cm.AbstractComponent = function () {
  clulib.cm.AbstractComponent.base(this, 'constructor');

  /**
   * The ComponentManager this component belongs to.
   *
   * @type {clulib.cm.ComponentManager}
   */
  this.manager = null;

  /**
   * The JSON configuration that has been attached to this component.
   *
   * Per default, this is the JSON config that has been serialized as base64 and attached
   * to the element of this component as data attribute (data-cmp-cfg).
   *
   * @type {?*}
   */
  this.config = null;
};

goog.inherits(
    clulib.cm.AbstractComponent,
    goog.ui.Component
);

/**
 * Waits for some work to be done (e.g. loading third party libraries),
 * before [onInit] is being called on this component.
 *
 * @returns {Promise}
 */
clulib.cm.AbstractComponent.prototype.waitFor = function () {
  return Promise.resolve();
};

/**
 * Gets called after [waitFor] completes and after all child components [onInit] functions have been called.
 */
clulib.cm.AbstractComponent.prototype.onInit = function () {
};

/**
 * Gets the component of the child element that matches the selector.
 * The element must be a direct or indirect child of this components element.
 *
 * @param {string} selector
 * @returns {?clulib.cm.AbstractComponent}
 */
clulib.cm.AbstractComponent.prototype.queryComponent = function (selector) {
  return this.manager.getComponentForElement(this.getElement().querySelector(selector));
};

/**
 * Gets all components of the child elements that match the selector.
 * The elements must be direct or indirect children of this components element.
 *
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

/**
 * Gets called when this component, or one of its parents, is being disposed with a call to [dispose].
 */
clulib.cm.AbstractComponent.prototype.onDispose = function () {
};