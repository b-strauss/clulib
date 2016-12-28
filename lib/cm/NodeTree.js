goog.provide('clulib.cm.NodeTree');

goog.require('clulib.cm.ComponentNode');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.structs.Map');

/**
 * You should never use this class directly!
 * Look into [clulib.cm.AbstractComponent] and [clulib.cm.ComponentManager] instead!
 *
 * @param {clulib.cm.ComponentManager} manager
 * @constructor
 */
clulib.cm.NodeTree = function (manager) {
  /**
   * @type {clulib.cm.ComponentManager}
   * @private
   */
  this.manager_ = manager;

  /**
   * @type {goog.structs.Map<string, clulib.cm.ComponentNode>}
   * @private
   */
  this.collection_ = new goog.structs.Map();
};

/**
 * @param {string} id
 * @returns {?clulib.cm.AbstractComponent}
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
 * @returns {Array<clulib.cm.AbstractComponent>}
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

  if (elements.length == 0)
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

  // Initialize asynchronously in tree order, bottom up. We create two arrays here to prevent holes.
  /**
   * @type {Array<Array<clulib.cm.ComponentNode>>}
   */
  const sparseOrderedNodes = [];
  unsolved.forEach(node => {
    const depth = node.getDepth();
    const group = sparseOrderedNodes[depth] || (sparseOrderedNodes[depth] = []);
    group.push(node);
  });

  /**
   * @type {Array<Array<clulib.cm.ComponentNode>>}
   */
  const denseOrderedNodes = [];
  sparseOrderedNodes.forEach(group => denseOrderedNodes.push(group));

  return goog.array.reduceRight(denseOrderedNodes, (p, g) => {
    const promise = /** @type {Promise} */ (p);
    const group = /** @type {Array<clulib.cm.ComponentNode>} */ (g);
    return promise.then(() => Promise.all(group.map(node => node.initialize())));
  }, Promise.resolve());
};

/**
 * @param {clulib.cm.ComponentNode} node
 * @returns {clulib.cm.ComponentNode}
 * @private
 */
clulib.cm.NodeTree.prototype.findParentNode_ = function (node) {
  const element = node.getElement();
  const parent = goog.dom.getParentElement(element);
  /**
   * @type {Element}
   */
  let foundElement = null;

  if (parent['closest'] != null) {
    foundElement = /** @type {Element} */ (parent['closest'](`[${this.manager_.getIdAttribute()}]`));
  }
  else {
    foundElement = /** @type {Element} */ (goog.dom.getAncestor(parent, element => {
      const el = /** @type {Element} */ (element);
      return el.hasAttribute(this.manager_.getIdAttribute());
    }, true));
  }

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