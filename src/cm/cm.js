goog.module('clulib.cm');

const {removeHoles, asyncForEachRight} = goog.require('clulib.array');
const Completer = goog.require('clulib.async.Completer');
const {closest} = goog.require('clulib.dom');

const GoogComponent = goog.require('goog.ui.Component');
const {assert} = goog.require('goog.asserts');
const {decodeString} = goog.require('goog.crypt.base64');
const {getParentElement, isElement} = goog.require('goog.dom');

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
 * - onDispose
 * - onInit
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
 * - waitFor
 *
 * @constructor
 * @extends {GoogComponent}
 */
function Component () {
  Component.base(this, 'constructor');

  /**
   * The [clulib.cm.ComponentManager] this component belongs to.
   *
   * @type {ComponentManager}
   */
  this.manager = null;

  /**
   * @type {Completer}
   * @const
   * @package
   */
  this.initCompleter = new Completer();

  /**
   * @type {Completer}
   * @const
   * @package
   */
  this.disposeCompleter = new Completer();
}

goog.inherits(
  Component,
  GoogComponent
);

/**
 * Checks if the element this component belongs to has a certain tagname.
 *
 * @param {goog.dom.TagName|string} tagname
 * @returns {boolean}
 */
Component.prototype.isTag = function (tagname) {
  return this.getElement().tagName === tagname.toString();
};

/**
 * Returns the JSON configuration associated with the component.
 *
 * This is the JSON config that has been serialized as base64 and attached
 * to the element of this component as a data attribute named 'data-cmp-cfg'.
 *
 * @returns {*}
 */
Component.prototype.getConfig = function () {
  return this.getModel();
};

/**
 * Waits for some work to be done (e.g. loading third party libraries),
 * before [onInit] is being called on this component.
 *
 * @returns {Promise}
 */
Component.prototype.waitFor = function () {
  return Promise.resolve();
};

/**
 * Gets called after [waitFor] completes and after all child components have been initialized.
 *
 * Accessing the DOM and adding listeners should be done in this method.
 *
 * The order this is called in, is bottom-up.
 */
Component.prototype.onInit = function () {
};

/**
 * Promise that resolves after [onInit] has been called.
 *
 * @returns {Promise}
 */
Component.prototype.onInitComplete = function () {
  return this.initCompleter.getPromise();
};

/**
 * Returns the component of the child element that matches the selector.
 *
 * The element must be part of this component's DOM.
 *
 * @param {string} selector
 * @returns {?Component}
 */
Component.prototype.queryComponent = function (selector) {
  return this.manager.getComponentForElement(this.getElement().querySelector(selector));
};

/**
 * Returns all components of the child elements that match the selector.
 *
 * The elements must be part of this component's DOM.
 *
 * @param {string} selector
 * @returns {Array<Component>}
 */
Component.prototype.queryComponentAll = function (selector) {
  return this.manager.getComponentsForElementArray(Array.from(this.getElement().querySelectorAll(selector)));
};

/**
 * This method should not be overridden, use [onDispose] instead.
 *
 * @override
 * @protected
 */
Component.prototype.disposeInternal = function () {
  this.onDispose();
  this.getElement().removeAttribute(this.manager.getIdAttribute());
  this.disposeCompleter.resolve();
  Component.base(this, 'disposeInternal');
  this.manager.disposeNode(this.getId());
};

/**
 * Gets called when this component, or one of its parents, is being disposed with a call to [dispose].
 *
 * This method should be used to cleanup all data of this component.
 *
 * The order this is called in, is top-down.
 */
Component.prototype.onDispose = function () {
};

/**
 * Promise that resolves after [onDispose] has been called.
 *
 * @returns {Promise}
 */
Component.prototype.onDisposeComplete = function () {
  return this.disposeCompleter.getPromise();
};


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
function ComponentManager () {
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
   * @type {NodeTree}
   * @const
   * @private
   */
  this.nodeTree_ = new NodeTree(this);
}

/**
 * Gets the attribute that serves as key for the component.
 *
 * @returns {string}
 */
ComponentManager.prototype.getTypeAttribute = function () {
  return this.typeAttribute_;
};

/**
 * Gets the attribute that serves as unique id for every instance of a component.
 *
 * @returns {string}
 */
ComponentManager.prototype.getIdAttribute = function () {
  return this.idAttribute_;
};

/**
 * Gets the attribute that holds a base64 encoded JSON configuration for the component.
 *
 * @returns {string}
 */
ComponentManager.prototype.getConfigAttribute = function () {
  return this.configAttribute_;
};

/**
 * Gets the registry of the ComponentManager.
 *
 * The registry is a Map of keys to component constructors.
 *
 * @returns {Map<string, Function>}
 */
ComponentManager.prototype.getRegistry = function () {
  return this.registry_;
};

/**
 * Gets the instance of the component for an element that has been decorated by this ComponentManager.
 *
 * @param {Element} element
 * @returns {?Component}
 */
ComponentManager.prototype.getComponentForElement = function (element) {
  if (element == null || element.hasAttribute(this.idAttribute_) === false)
    return null;

  const id = element.getAttribute(this.idAttribute_);

  return this.nodeTree_.getComponent(id);
};

/**
 * Gets the instances of components for an array of elements that have been decorated by this ComponentManager.
 *
 * @param {Array<Element>} elementArray
 * @returns {Array<Component>}
 */
ComponentManager.prototype.getComponentsForElementArray = function (elementArray) {
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
 * @returns {?Component}
 */
ComponentManager.prototype.queryComponent = function (selector) {
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
 * @returns {Array<Component>}
 */
ComponentManager.prototype.queryComponentAll = function (selector) {
  return this.getComponentsForElementArray(Array.from(document.querySelectorAll(selector)));
};

/**
 * @param {string} id
 * @package
 */
ComponentManager.prototype.disposeNode = function (id) {
  this.nodeTree_.disposeNode(id);
};

/**
 * Registers a component constructor by key with this ComponentManager.
 *
 * The key must match the data-cmp attribute on the elements that wish to be decorated.
 *
 * @param {string} type
 * @param {function(new:Component)} constructor
 */
ComponentManager.prototype.addComponent = function (type, constructor) {
  assert(this.registry_.has(type) === false, `Component with type '${type}' already registered.`);
  this.registry_.set(type, constructor);
};

/**
 * Registers a Map of keys to component constructors with this ComponentManager.
 *
 * @param {!Object<string, function(new:Component)>} obj
 */
ComponentManager.prototype.addComponentMap = function (obj) {
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
ComponentManager.prototype.decorate = function (rootElement = document.body) {
  return this.nodeTree_.createTree(rootElement);
};

/**
 * Disposes all components managed by this ComponentManager.
 */
ComponentManager.prototype.disposeAll = function () {
  this.nodeTree_.disposeAll();
};

/**
 * @param {ComponentManager} manager
 * @param {Element} element
 * @constructor
 * @package
 */
function ComponentNode (manager, element) {
  /**
   * @type {ComponentManager}
   * @const
   * @private
   */
  this.manager_ = manager;

  /**
   * @type {Element}
   * @const
   * @private
   */
  this.element_ = element;

  /**
   * @type {?Component}
   * @private
   */
  this.component_ = null;

  /**
   * @type {?string}
   * @private
   */
  this.id_ = null;

  /**
   * @type {ComponentNode}
   * @private
   */
  this.parent_ = null;

  /**
   * @type {Map<string, ComponentNode>}
   * @const
   * @private
   */
  this.children_ = new Map();

  /**
   * @type {number}
   * @private
   */
  this.depth_ = 0;

  /**
   * @type {string}
   * @const
   * @private
   */
  this.type_ = this.element_.getAttribute(this.manager_.getTypeAttribute());

  /**
   * @type {?string}
   * @const
   * @private
   */
  this.config_ = this.element_.getAttribute(this.manager_.getConfigAttribute());
}

/**
 * @param {ComponentNode} node
 */
ComponentNode.prototype.addChild = function (node) {
  node.parent_ = this;
  this.children_.set(/** @type {!string} */ (node.getId()), node);
  this.component_.addChild(node.component_, false);
  node.setDepth(this.depth_ + 1);
};

/**
 * @param {number} depth
 */
ComponentNode.prototype.setDepth = function (depth) {
  this.depth_ = depth;
  this.children_.forEach(node => node.setDepth(this.depth_ + 1));
};

/**
 * @returns {?Component}
 */
ComponentNode.prototype.getComponent = function () {
  return this.component_;
};

/**
 * @returns {number}
 */
ComponentNode.prototype.getDepth = function () {
  return this.depth_;
};

/**
 * @returns {Element}
 */
ComponentNode.prototype.getElement = function () {
  return this.element_;
};

/**
 * @returns {string}
 */
ComponentNode.prototype.getType = function () {
  return this.type_;
};

/**
 * @returns {?string}
 */
ComponentNode.prototype.getId = function () {
  return this.id_;
};

/**
 * @param {function(new:Component)} constructor
 */
ComponentNode.prototype.instantiate = function (constructor) {
  this.component_ = new constructor();

  this.id_ = this.component_.getId();
  this.element_.setAttribute(this.manager_.getIdAttribute(), /** @type {!string} */ (this.id_));

  this.component_.manager = this.manager_;
  if (this.config_ != null)
    this.component_.setModel(JSON.parse(decodeString(this.config_)));
};

ComponentNode.prototype.decorate = function () {
  this.component_.decorate(this.element_);
};

/**
 * @returns {Promise}
 */
ComponentNode.prototype.initialize = function () {
  return this.component_.waitFor()
    .then(() => {
      this.component_.onInit();
      this.component_.initCompleter.resolve();
    });
};

ComponentNode.prototype.dispose = function () {
  if (this.parent_ != null)
    this.parent_.children_.delete(/** @type {!string} */ (this.getId()));
};


/**
 * @param {ComponentManager} manager
 * @constructor
 * @package
 */
function NodeTree (manager) {
  /**
   * @type {ComponentManager}
   * @const
   * @private
   */
  this.manager_ = manager;

  /**
   * @type {Map<string, ComponentNode>}
   * @const
   * @private
   */
  this.collection_ = new Map();
}

/**
 * @param {string} id
 * @returns {?Component}
 */
NodeTree.prototype.getComponent = function (id) {
  const node = this.collection_.get(id) || null;

  if (node == null)
    return null;
  else
    return node.getComponent();
};

/**
 * @param {Array<string>} ids
 * @returns {Array<Component>}
 */
NodeTree.prototype.getComponentArray = function (ids) {
  return ids.map(id => this.getComponent(id))
    .filter(value => value != null);
};

/**
 * @param {Element=} rootElement
 * @returns {Promise}
 */
NodeTree.prototype.createTree = function (rootElement) {
  const selector = `[${this.manager_.getTypeAttribute()}]:not([${this.manager_.getIdAttribute()}])`;
  /**
   * @type {Array<Element>}
   */
  const elements = Array.from(rootElement.querySelectorAll(selector));

  if (rootElement.hasAttribute(this.manager_.getTypeAttribute())
    && !rootElement.hasAttribute(this.manager_.getIdAttribute()))
    elements.push(rootElement);

  if (elements.length === 0)
    return Promise.resolve();

  /**
   * @type {Map<string, ComponentNode>}
   */
  const unsolved = new Map();

  // Instantiate components
  elements.forEach(element => {
    const node = new ComponentNode(this.manager_, element);
    const type = node.getType();
    const constructor = this.manager_.getRegistry().get(type);
    if (constructor == null)
      throw new Error(`No constructor found for component type '${type}'.`);
    node.instantiate(constructor);
    this.collection_.set(/** @type {!string} */ (node.getId()), node);
    unsolved.set(/** @type {!string} */ (node.getId()), node);
  });

  // Solve node tree
  unsolved.forEach(node => {
    const parentNode = this.findParentNode_(node);
    if (parentNode != null)
      parentNode.addChild(node);
  });

  // Initialize asynchronously in tree order, bottom up.
  /**
   * @type {Array<Array<ComponentNode>>}
   */
  const sparseOrderedNodeGroups = [];
  unsolved.forEach(node => {
    node.decorate();
    const depth = node.getDepth();
    const group = sparseOrderedNodeGroups[depth] || (sparseOrderedNodeGroups[depth] = []);
    group.push(node);
  });

  /**
   * @type {Array<Array<ComponentNode>>}
   */
  const denseOrderedNodeGroups = removeHoles(sparseOrderedNodeGroups);

  return asyncForEachRight(denseOrderedNodeGroups, group => {
    return Promise.all(group.map(node => node.initialize()));
  });
};

/**
 * @param {ComponentNode} node
 * @returns {ComponentNode}
 * @private
 */
NodeTree.prototype.findParentNode_ = function (node) {
  const parent = getParentElement(node.getElement());

  if (!isElement(parent))
    return null;

  /**
   * @type {Element}
   */
  let foundElement = closest(parent, `[${this.manager_.getIdAttribute()}]`);

  if (foundElement == null)
    return null;

  const foundId = foundElement.getAttribute(this.manager_.getIdAttribute());

  return this.collection_.get(foundId);
};

/**
 * @param {string} id
 */
NodeTree.prototype.disposeNode = function (id) {
  const node = this.collection_.get(id);
  node.dispose();
  this.collection_.delete(id);
};

NodeTree.prototype.disposeAll = function () {
  const copy = new Map(this.collection_);
  copy.forEach(node => {
    node.getComponent().dispose();
  });
};


exports = {Component, ComponentManager};
