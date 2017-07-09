goog.provide('clulib.cm.NodeTree');

goog.require('clulib.array');
goog.require('clulib.async');
goog.require('clulib.cm.ComponentNode');
goog.require('clulib.dom');

goog.require('goog.dom');
goog.require('goog.structs.Map');

/**
 * Look into [clulib.cm.Component] and [clulib.cm.ComponentManager] instead.
 *
 * @param {clulib.cm.ComponentManager} manager
 * @constructor
 * @package
 */
clulib.cm.NodeTree = function (manager) {
  /**
   * @type {clulib.cm.ComponentManager}
   * @const
   * @private
   */
  this.manager_ = manager;

  /**
   * @type {goog.structs.Map<string, clulib.cm.ComponentNode>}
   * @const
   * @private
   */
  this.collection_ = new goog.structs.Map();
};

/**
 * @param {string} id
 * @returns {?clulib.cm.Component}
 */
clulib.cm.NodeTree.prototype.getComponent = function (id) {
  const node = this.collection_.get(id, null);

  if (node == null)
    return null;
  else
    return node.getComponent();
};

/**
 * @param {Array<string>} ids
 * @returns {Array<clulib.cm.Component>}
 */
clulib.cm.NodeTree.prototype.getComponentArray = function (ids) {
  return ids.map(id => this.getComponent(id))
      .filter(value => value != null);
};

/**
 * @param {Element=} rootElement
 * @returns {Promise}
 */
clulib.cm.NodeTree.prototype.createTree = function (rootElement) {
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
   * @type {goog.structs.Map<string, clulib.cm.ComponentNode>}
   */
  const unsolved = new goog.structs.Map();

  // Instantiate components
  elements.forEach(element => {
    const node = new clulib.cm.ComponentNode(this.manager_, element);
    const type = node.getType();
    const constructor = this.manager_.getRegistry().get(type);
    if (constructor == null)
      throw new Error(`No constructor found for component type '${type}'.`);
    node.instantiate(constructor);
    this.collection_.set(node.getId(), node);
    unsolved.set(node.getId(), node);
  });

  // Solve node tree
  unsolved.forEach(node => {
    const parentNode = this.findParentNode_(node);
    if (parentNode != null)
      parentNode.addChild(node);
  });

  // Initialize asynchronously in tree order, bottom up.
  /**
   * @type {Array<Array<clulib.cm.ComponentNode>>}
   */
  const sparseOrderedNodeGroups = [];
  unsolved.forEach(node => {
    node.decorate();
    const depth = node.getDepth();
    const group = sparseOrderedNodeGroups[depth] || (sparseOrderedNodeGroups[depth] = []);
    group.push(node);
  });

  /**
   * @type {Array<Array<clulib.cm.ComponentNode>>}
   */
  const denseOrderedNodeGroups = clulib.array.removeHoles(sparseOrderedNodeGroups);

  return clulib.array.asyncForEachRight(denseOrderedNodeGroups, group => {
    return Promise.all(group.map(node => node.initialize()));
  });
};

/**
 * @param {clulib.cm.ComponentNode} node
 * @returns {clulib.cm.ComponentNode}
 * @private
 */
clulib.cm.NodeTree.prototype.findParentNode_ = function (node) {
  const parent = goog.dom.getParentElement(node.getElement());

  if (!goog.dom.isElement(parent))
    return null;

  /**
   * @type {Element}
   */
  let foundElement = clulib.dom.closest(parent, `[${this.manager_.getIdAttribute()}]`);

  if (foundElement == null)
    return null;

  const foundId = foundElement.getAttribute(this.manager_.getIdAttribute());

  return this.collection_.get(foundId);
};

/**
 * @param {string} id
 */
clulib.cm.NodeTree.prototype.disposeNode = function (id) {
  const node = this.collection_.get(id);
  node.dispose();
  this.collection_.remove(id);
};

clulib.cm.NodeTree.prototype.disposeAll = function () {
  const copy = this.collection_.clone();
  copy.forEach(node => {
    node.getComponent().dispose();
  });
};