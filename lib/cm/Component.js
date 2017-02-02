goog.provide('clulib.cm.Component');

goog.require('clulib.async.Completer');

goog.require('goog.ui.Component');

/**
 * Component base class used together with the [clulib.cm.ComponentManager],
 * based on [goog.ui.Component].
 *
 * You should never instantiate children of this class yourself. The [clulib.cm.ComponentManager]
 * takes care of instantiation, decoration, and lifecycle management. Look into that class
 * for further information.
 *
 * This class has two basic lifecycle methods, [onInit] and [onDispose]:
 * - [onInit] gets called after the component has been decorated, and all child components (if present)
 *   have been initialized.
 * - [onDispose] gets called when this component, or one of its parents, is being disposed with a
 *   call to [dispose].
 *
 * To remove the component from the element use the [dispose] method. The dispose method
 * cleans up the components data and "undecorates" the component from the element, including
 * all child components. After that, the DOM structure should be in the same state as before decoration.
 *
 * Methods that should never be called on instances of this class:
 * - addChild
 * - addChildAt
 * - createDom
 * - decorate
 * - decorateInternal
 * - disposeInternal
 * - enterDocument
 * - exitDocument
 * - removeChild
 * - removeChildAt
 * - removeChildren
 * - render
 * - renderBefore
 * - setElementInternal
 * - setId
 * - setModel
 * - setParent
 * - setParentEventTarget
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
clulib.cm.Component = function () {
  clulib.cm.Component.base(this, 'constructor');

  /**
   * The [clulib.cm.ComponentManager] this component belongs to.
   *
   * @type {clulib.cm.ComponentManager}
   */
  this.manager = null;

  /**
   * @type {clulib.async.Completer}
   * @package
   */
  this.initCompleter = new clulib.async.Completer();

  /**
   * @type {clulib.async.Completer}
   * @package
   */
  this.disposeCompleter = new clulib.async.Completer();
};

goog.inherits(
    clulib.cm.Component,
    goog.ui.Component
);

/**
 * Checks if the element this component belongs to has a certain tagname.
 *
 * @param {goog.dom.TagName|string} tagname
 */
clulib.cm.Component.prototype.isTag = function (tagname) {
  return this.getElement().tagName == tagname.toString();
};

/**
 * Returns the JSON configuration associated with the component.
 *
 * By default, this is the JSON config that has been serialized as base64 and attached
 * to the element of this component as a data attribute named 'data-cmp-cfg'.
 *
 * @returns {*}
 */
clulib.cm.Component.prototype.getConfig = function () {
  return this.getModel();
};

/**
 * Waits for some work to be done (e.g. loading third party libraries),
 * before [onInit] is being called on this component.
 *
 * @returns {Promise}
 */
clulib.cm.Component.prototype.waitFor = function () {
  return Promise.resolve();
};

/**
 * Gets called after [waitFor] completes and after all child components have been initialized.
 *
 * Accessing the DOM and adding listeners should be done in this method.
 *
 * The order this is called in, is bottom-up.
 */
clulib.cm.Component.prototype.onInit = function () {
};

/**
 * Promise that resolves after [onInit] has been called.
 *
 * @returns {Promise}
 */
clulib.cm.Component.prototype.onInitComplete = function () {
  return this.initCompleter.getPromise();
};

/**
 * Returns the component of the child element that matches the selector.
 *
 * The element must be part of this component's DOM.
 *
 * @param {string} selector
 * @returns {?clulib.cm.Component}
 */
clulib.cm.Component.prototype.queryComponent = function (selector) {
  return this.manager.getComponentForElement(this.getElement().querySelector(selector));
};

/**
 * Returns all components of the child elements that match the selector.
 *
 * The elements must be part of this component's DOM.
 *
 * @param {string} selector
 * @returns {Array<clulib.cm.Component>}
 */
clulib.cm.Component.prototype.queryComponentAll = function (selector) {
  return this.manager.getComponentsForElementArray(Array.from(this.getElement().querySelectorAll(selector)));
};

/**
 * This method should not be overridden, use [onDispose] instead.
 *
 * @override
 * @protected
 */
clulib.cm.Component.prototype.disposeInternal = function () {
  this.onDispose();
  this.getElement().removeAttribute(this.manager.getIdAttribute());
  this.disposeCompleter.resolve();
  clulib.cm.Component.base(this, 'disposeInternal');
  this.manager.disposeNode(this.getId());
};

/**
 * Gets called when this component, or one of its parents, is being disposed with a call to [dispose].
 *
 * This method should be used to cleanup all data of this component.
 *
 * The order this is called in, is top-down.
 */
clulib.cm.Component.prototype.onDispose = function () {
};

/**
 * Promise that resolves after [onDispose] has been called.
 *
 * @returns {Promise}
 */
clulib.cm.Component.prototype.onDisposeComplete = function () {
  return this.disposeCompleter.getPromise();
};