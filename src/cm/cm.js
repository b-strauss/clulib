goog.module('clulib.cm');

const {removeHoles, asyncForEachRight} = goog.require('clulib.array');
const Completer = goog.require('clulib.async.Completer');
const {closest, matches} = goog.require('clulib.dom');

const GoogComponent = goog.require('goog.ui.Component');
const {assert} = goog.require('goog.asserts');
const {getParentElement, isElement} = goog.require('goog.dom');

/**
 * @typedef {{
 *   type: string,
 *   selector: (string|undefined)
 * }}
 */
// eslint-disable-next-line init-declarations
let ComponentMetadata;

/**
 * @typedef {function(new:Component)|{metadata:ComponentMetadata}}
 */
// eslint-disable-next-line init-declarations
let ComponentType;

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
 */
class Component extends GoogComponent {
  constructor () {
    super();

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

  /**
   * Checks if the element this component belongs to has a certain tagname.
   *
   * @param {goog.dom.TagName|string} tagname
   * @returns {boolean}
   */
  isTag (tagname) {
    return this.getElement().tagName === tagname.toString();
  }

  /**
   * Returns the JSON configuration associated with the component.
   *
   * This is the JSON config that has been serialized as base64 and attached
   * to the element of this component as a data attribute named 'data-cmp-cfg'.
   *
   * @returns {*}
   */
  getConfig () {
    return this.getModel();
  }

  /**
   * Waits for some work to be done (e.g. loading third party libraries),
   * before [onInit] is being called on this component.
   *
   * @returns {Promise}
   */
  waitFor () {
    return Promise.resolve();
  }

  /**
   * Gets called after [waitFor] completes and after all child components have been initialized.
   *
   * Accessing the DOM and adding listeners should be done in this method.
   *
   * The order this is called in, is bottom-up.
   */
  onInit () {
  }

  /**
   * Promise that resolves after [onInit] has been called.
   *
   * @returns {Promise}
   */
  onInitComplete () {
    return this.initCompleter.getPromise();
  }

  /**
   * Returns the component of the child element that matches the selector.
   *
   * The element must be part of this component's DOM.
   *
   * @param {string} selector
   * @returns {?Component}
   */
  queryComponent (selector) {
    return this.manager.getComponentForElement(this.getElement().querySelector(selector));
  }

  /**
   * Returns all components of the child elements that match the selector.
   *
   * The elements must be part of this component's DOM.
   *
   * @param {string} selector
   * @returns {Array<Component>}
   */
  queryComponentAll (selector) {
    return this.manager.getComponentsForElementArray(Array.from(this.getElement().querySelectorAll(selector)));
  }

  /**
   * This method should not be overridden, use [onDispose] instead.
   *
   * @override
   * @protected
   */
  disposeInternal () {
    this.onDispose();
    this.getElement().removeAttribute(this.manager.getIdAttribute());
    this.disposeCompleter.resolve();
    super.disposeInternal();
    this.manager.disposeNode(this.getId());
  }

  /**
   * Gets called when this component, or one of its parents, is being disposed with a call to [dispose].
   *
   * This method should be used to cleanup all data of this component.
   *
   * The order this is called in, is top-down.
   */
  onDispose () {
  }

  /**
   * Promise that resolves after [onDispose] has been called.
   *
   * @returns {Promise}
   */
  onDisposeComplete () {
    return this.disposeCompleter.getPromise();
  }

  /**
   * @returns {?ComponentMetadata}
   */
  static get metadata () {
    return null;
  }
}


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
 */
class ComponentManager {
  constructor () {
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
     * @type {Map<string, ComponentType>}
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
  getTypeAttribute () {
    return this.typeAttribute_;
  }

  /**
   * Gets the attribute that serves as unique id for every instance of a component.
   *
   * @returns {string}
   */
  getIdAttribute () {
    return this.idAttribute_;
  }

  /**
   * Gets the attribute that holds a base64 encoded JSON configuration for the component.
   *
   * @returns {string}
   */
  getConfigAttribute () {
    return this.configAttribute_;
  }

  /**
   * Gets the registry of the ComponentManager.
   *
   * The registry is a Map of keys to component constructors.
   *
   * @returns {Map<string, ComponentType>}
   */
  getRegistry () {
    return this.registry_;
  }

  /**
   * Gets the instance of the component for an element that has been decorated by this ComponentManager.
   *
   * @param {Element} element
   * @returns {?Component}
   */
  getComponentForElement (element) {
    if (element == null || element.hasAttribute(this.idAttribute_) === false)
      return null;

    const id = element.getAttribute(this.idAttribute_);

    return this.nodeTree_.getComponent(id);
  }

  /**
   * Gets the instances of components for an array of elements that have been decorated by this ComponentManager.
   *
   * @param {Array<Element>} elementArray
   * @returns {Array<Component>}
   */
  getComponentsForElementArray (elementArray) {
    return this.nodeTree_.getComponentArray(
      elementArray.map(element => element.getAttribute(this.idAttribute_))
    );
  }

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
  queryComponent (selector) {
    return this.getComponentForElement(document.querySelector(selector));
  }

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
  queryComponentAll (selector) {
    return this.getComponentsForElementArray(Array.from(document.querySelectorAll(selector)));
  }

  /**
   * @param {string} id
   * @package
   */
  disposeNode (id) {
    this.nodeTree_.disposeNode(id);
  }

  /**
   * Registers a component constructor by key with this ComponentManager.
   *
   * The key must match the data-cmp attribute on the elements that wish to be decorated.
   *
   * @param {string} type
   * @param {ComponentType} constructor
   */
  addComponent (type, constructor) {
    assert(this.registry_.has(type) === false, `Component with type '${type}' already registered.`);
    this.registry_.set(type, constructor);
  }

  /**
   * @param {ComponentType} clazz
   */
  addClass (clazz) {
    const metadata = /** @type {ComponentMetadata} */ (clazz.metadata);
    if (metadata == null)
      throw new Error('Component class must have a static metadata getter.');
    this.addComponent(metadata.type, clazz);
  }

  /**
   * Registers a Map of keys to component constructors with this ComponentManager.
   *
   * @param {!Object<string, ComponentType>} obj
   */
  addComponentMap (obj) {
    Object.keys(obj).forEach(key => {
      this.addComponent(key, obj[key]);
    });
  }

  /**
   * Decorates all elements inside the provided rootElement with their associated components.
   *
   * This kicks off the lifecycle management.
   *
   * @param {Element=} rootElement
   * @returns {Promise}
   */
  decorate (rootElement = document.body) {
    return this.nodeTree_.createTree(rootElement);
  }

  /**
   * Disposes all components managed by this ComponentManager.
   */
  disposeAll () {
    this.nodeTree_.disposeAll();
  }
}


class ComponentNode {
  /**
   * @param {ComponentManager} manager
   * @param {Element} element
   */
  constructor (manager, element) {
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
     * @type {?ComponentMetadata}
     * @private
     */
    this.metadata_ = null;

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
  addChild (node) {
    node.parent_ = this;
    this.children_.set(/** @type {!string} */ (node.getId()), node);
    this.component_.addChild(node.component_, false);
    node.setDepth(this.depth_ + 1);
  }

  /**
   * @param {number} depth
   */
  setDepth (depth) {
    this.depth_ = depth;
    this.children_.forEach(node => node.setDepth(this.depth_ + 1));
  }

  /**
   * @returns {?Component}
   */
  getComponent () {
    return this.component_;
  }

  /**
   * @returns {number}
   */
  getDepth () {
    return this.depth_;
  }

  /**
   * @returns {Element}
   */
  getElement () {
    return this.element_;
  }

  /**
   * @returns {string}
   */
  getType () {
    return this.type_;
  }

  /**
   * @returns {?string}
   */
  getId () {
    return this.id_;
  }

  /**
   * @param {ComponentType} constructor
   */
  instantiate (constructor) {
    this.metadata_ = constructor.metadata != null ? constructor.metadata : null;

    this.component_ = new /** @type {function(new:Component)} */ (constructor)();

    this.id_ = this.component_.getId();
    this.element_.setAttribute(this.manager_.getIdAttribute(), /** @type {!string} */ (this.id_));

    this.component_.manager = this.manager_;
    if (this.config_ != null)
      this.component_.setModel(JSON.parse(atob(this.config_)));
  }

  decorate () {
    if (this.metadata_ != null && this.metadata_.selector != null) {
      const selector = this.metadata_.selector;
      if (!matches(this.element_, selector))
        throw new Error(
          `Component type '${this.type_}' can only be decorated on elements that match selector '${selector}'.`
        );
    }

    this.component_.decorate(this.element_);
  }

  /**
   * @returns {Promise}
   */
  async initialize () {
    await this.component_.waitFor();

    this.component_.onInit();
    this.component_.initCompleter.resolve();

    return null;
  }

  dispose () {
    if (this.parent_ != null)
      this.parent_.children_.delete(/** @type {!string} */ (this.getId()));
  }
}


class NodeTree {
  /**
   * @param {ComponentManager} manager
   */
  constructor (manager) {
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
  getComponent (id) {
    const node = this.collection_.get(id) || null;

    if (node == null)
      return null;
    else
      return node.getComponent();
  }

  /**
   * @param {Array<string>} ids
   * @returns {Array<Component>}
   */
  getComponentArray (ids) {
    return ids.map(id => this.getComponent(id))
      .filter(value => value != null);
  }

  /**
   * @param {Element=} rootElement
   * @returns {Promise}
   */
  createTree (rootElement) {
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
        throw new Error(`No class found for component type '${type}'.`);
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
  }

  /**
   * @param {ComponentNode} node
   * @returns {ComponentNode}
   * @private
   */
  findParentNode_ (node) {
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
  }

  /**
   * @param {string} id
   */
  disposeNode (id) {
    const node = this.collection_.get(id);
    node.dispose();
    this.collection_.delete(id);
  }

  disposeAll () {
    const copy = new Map(this.collection_);
    copy.forEach(node => {
      node.getComponent().dispose();
    });
  }
}

exports = {Component, ComponentManager, ComponentMetadata, ComponentType};
