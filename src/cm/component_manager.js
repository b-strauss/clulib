goog.provide('clulib.cm.ComponentManager');

goog.require('clulib.cm.NodeTree');

goog.require('goog.asserts');

/**
 * A class to automatically decorate HTML elements with [clulib.cm.Component]s, based on HTML data-attributes.
 * It is intended to be used on projects that generate most of their HTML on the server side.
 *
 * Calling [decorate] searches the DOM tree inside the target element (the body by default) for all elements
 * that have data-cmp attributes and decorates them by key with instances of [clulib.cm.Component]s that have been
 * registered with the ComponentManager. The ComponentManager takes care of instantiation, decoration, and lifecycle
 * management. See [clulib.cm.Component] for more details on how a component works.
 *
 * @final
 * @constructor
 */
clulib.cm.ComponentManager = function () {
  /**
   * @type {string}
   * @const
   * @private
   */
  this.typeAttribute_ = 'data-cmp';
  
  /**
   * @type {string}
   * @const
   * @private
   */
  this.idAttribute_ = 'data-cmp-id';
  
  /**
   * @type {string}
   * @const
   * @private
   */
  this.configAttribute_ = 'data-cmp-cfg';
  
  /**
   * @type {Map<string, Function>}
   * @const
   * @private
   */
  this.registry_ = new Map();
  
  /**
   * @type {clulib.cm.NodeTree}
   * @const
   * @private
   */
  this.nodeTree_ = new clulib.cm.NodeTree(this);
};

/**
 * Gets the attribute that serves as key for the component.
 *
 * @returns {string}
 */
clulib.cm.ComponentManager.prototype.getTypeAttribute = function () {
  return this.typeAttribute_;
};

/**
 * Gets the attribute that serves as unique id for every instance of a component.
 *
 * @returns {string}
 */
clulib.cm.ComponentManager.prototype.getIdAttribute = function () {
  return this.idAttribute_;
};

/**
 * Gets the attribute that holds a base64 encoded JSON configuration for the component.
 *
 * @returns {string}
 */
clulib.cm.ComponentManager.prototype.getConfigAttribute = function () {
  return this.configAttribute_;
};

/**
 * Gets the registry of the ComponentManager.
 *
 * The registry is a Map of keys to component constructors.
 *
 * @returns {Map<string, Function>}
 */
clulib.cm.ComponentManager.prototype.getRegistry = function () {
  return this.registry_;
};

/**
 * Gets the instance of the component for an element that has been decorated by this ComponentManager.
 *
 * @param {Element} element
 * @returns {?clulib.cm.Component}
 */
clulib.cm.ComponentManager.prototype.getComponentForElement = function (element) {
  if (element == null || element.hasAttribute(this.idAttribute_) === false)
    return null;
  
  const id = element.getAttribute(this.idAttribute_);
  
  return this.nodeTree_.getComponent(id);
};

/**
 * Gets the instances of components for an array of elements that have been decorated by this ComponentManager.
 *
 * @param {Array<Element>} elementArray
 * @returns {Array<clulib.cm.Component>}
 */
clulib.cm.ComponentManager.prototype.getComponentsForElementArray = function (elementArray) {
  return this.nodeTree_.getComponentArray(
    elementArray.map(element => element.getAttribute(this.idAttribute_))
  );
};

/**
 * Returns the component of an element that matches the selector, and has been decorated by this ComponentManager.
 * The element can sit anywhere in the document.
 *
 * Elements optained with this method are not guaranteed to be initialized.
 * Use [onInitComplete] on them.
 *
 * @param {string} selector
 * @returns {?clulib.cm.Component}
 */
clulib.cm.ComponentManager.prototype.queryComponent = function (selector) {
  return this.getComponentForElement(document.querySelector(selector));
};

/**
 * Returns the components of the elements that match the selector, and have been decorated by this ComponentManager.
 * The elements can sit anywhere in the document.
 *
 * Elements optained with this method are not guaranteed to be initialized.
 * Use [onInitComplete] on them.
 *
 * @param {string} selector
 * @returns {Array<clulib.cm.Component>}
 */
clulib.cm.ComponentManager.prototype.queryComponentAll = function (selector) {
  return this.getComponentsForElementArray(Array.from(document.querySelectorAll(selector)));
};

/**
 * @param {string} id
 * @package
 */
clulib.cm.ComponentManager.prototype.disposeNode = function (id) {
  this.nodeTree_.disposeNode(id);
};

/**
 * Registers a component constructor by key with this ComponentManager.
 *
 * The key must match the data-cmp attribute on the elements that wish to be decorated.
 *
 * @param {string} type
 * @param {function(new:clulib.cm.Component)} constructor
 */
clulib.cm.ComponentManager.prototype.addComponent = function (type, constructor) {
  goog.asserts.assert(this.registry_.has(type) === false, `Component with type '${type}' already registered.`);
  this.registry_.set(type, constructor);
};

/**
 * Registers a Map of keys to component constructors with this ComponentManager.
 *
 * @param {!Object<string, function(new:clulib.cm.Component)>} obj
 */
clulib.cm.ComponentManager.prototype.addComponentMap = function (obj) {
  Object.keys(obj).forEach(key => {
    this.addComponent(key, obj[key]);
  });
};

/**
 * Decorates all elements inside the provided rootElement with their associated components.
 *
 * This kicks off the lifecycle management.
 *
 * @param {Element=} rootElement
 * @returns {Promise}
 */
clulib.cm.ComponentManager.prototype.decorate = function (rootElement = document.body) {
  return this.nodeTree_.createTree(rootElement);
};

/**
 * Disposes all components managed by this ComponentManager.
 */
clulib.cm.ComponentManager.prototype.disposeAll = function () {
  this.nodeTree_.disposeAll();
};
