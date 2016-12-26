goog.provide('clulib.cm.NodeTree');

goog.require('clulib.cm.ComponentNode');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.structs.Map');

/**
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
 * @param {Element=} rootElement
 * @returns {Promise}
 */
clulib.cm.NodeTree.prototype.createTree = function (rootElement) {
  let selector = `[${this.manager_.getTypeAttribute()}]:not([${this.manager_.getIdAttribute()}])`;
  /**
   * @type {Array<Element>}
   */
  let elements = Array.from(rootElement.querySelectorAll(selector));

  if (elements.length == 0)
    return Promise.resolve();

  /**
   * @type {goog.structs.Map<string, clulib.cm.ComponentNode>}
   */
  let unsolved = new goog.structs.Map();

  // instantiate components
  elements.forEach(element => {
    let node = new clulib.cm.ComponentNode(this.manager_, element);
    let type = node.getType();
    let constructor = this.manager_.getRegistry().get(type);
    if (constructor == null)
      throw new Error(`No constructor found for component type '${type}'!`);
    node.instantiate(constructor);
    this.collection_.set(node.getId(), node);
    unsolved.set(node.getId(), node);
  });

  // solve node tree
  unsolved.forEach(node => {
    let parentNode = this.findParentNode_(node);
    if (parentNode != null)
      parentNode.addChild(node);
  });

  // initialize asynchronously in tree order, bottom up
  /**
   * @type {Array<Array<clulib.cm.ComponentNode>>}
   */
  let sparseOrderedNodes = [];
  unsolved.forEach(node => {
    let depth = node.getDepth();
    let group = sparseOrderedNodes[depth] || (sparseOrderedNodes[depth] = []);
    group.push(node);
  });

  /**
   * @type {Array<Array<clulib.cm.ComponentNode>>}
   */
  let denseOrderedNodes = [];
  sparseOrderedNodes.forEach(group => denseOrderedNodes.push(group));

  return goog.array.reduceRight(denseOrderedNodes, (p, g) => {
    let promise = /** @type {Promise} */ (p);
    let group = /** @type {Array<clulib.cm.ComponentNode>} */ (g);
    return promise.then(() => Promise.all(group.map(node => node.initialize())));
  }, Promise.resolve());
};

/**
 * @param {clulib.cm.ComponentNode} node
 * @returns {clulib.cm.ComponentNode}
 * @private
 */
clulib.cm.NodeTree.prototype.findParentNode_ = function (node) {
  let element = node.getElement();
  let parent = goog.dom.getParentElement(element);
  /**
   * @type {Element}
   */
  let foundElement = null;

  if (parent['closest'] != null) {
    foundElement = /** @type {Element} */ (parent['closest'](`[${this.manager_.getIdAttribute()}]`));
  }
  else {
    foundElement = /** @type {Element} */ (goog.dom.getAncestor(parent, element => {
      let el = /** @type {Element} */ (element);
      return el.hasAttribute(this.manager_.getIdAttribute());
    }, true));
  }

  if (foundElement == null)
    return null;

  let foundId = foundElement.getAttribute(this.manager_.getIdAttribute());

  return this.collection_.get(foundId);
};