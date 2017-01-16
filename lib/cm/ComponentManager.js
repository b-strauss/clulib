goog.provide('clulib.cm.ComponentManager');

goog.require('clulib.cm.NodeTree');

goog.require('goog.asserts');
goog.require('goog.structs.Map');

/**
 * TODO: docs
 *
 * @constructor
 */
clulib.cm.ComponentManager = function () {
  /**
   * @type {string}
   * @private
   */
  this.typeAttribute_ = 'data-cmp';

  /**
   * @type {string}
   * @private
   */
  this.idAttribute_ = 'data-cmp-id';

  /**
   * @type {string}
   * @private
   */
  this.configAttribute_ = 'data-cmp-cfg';

  /**
   * @type {goog.structs.Map<string, Function>}
   * @private
   */
  this.registry_ = new goog.structs.Map();

  /**
   * @type {clulib.cm.NodeTree}
   * @private
   */
  this.nodeTree_ = new clulib.cm.NodeTree(this);
};

/**
 * @returns {string}
 */
clulib.cm.ComponentManager.prototype.getTypeAttribute = function () {
  return this.typeAttribute_;
};

/**
 * @returns {string}
 */
clulib.cm.ComponentManager.prototype.getIdAttribute = function () {
  return this.idAttribute_;
};

/**
 * @returns {string}
 */
clulib.cm.ComponentManager.prototype.getConfigAttribute = function () {
  return this.configAttribute_;
};

/**
 * @returns {goog.structs.Map<string, Function>}
 */
clulib.cm.ComponentManager.prototype.getRegistry = function () {
  return this.registry_;
};

/**
 * @param {Element} element
 * @returns {?clulib.cm.Component}
 */
clulib.cm.ComponentManager.prototype.getComponentForElement = function (element) {
  if (element == null || element.hasAttribute(this.idAttribute_) == false)
    return null;

  const id = element.getAttribute(this.idAttribute_);

  return this.nodeTree_.getComponent(id);
};

/**
 * @param {Array<Element>} elementArray
 * @returns {Array<clulib.cm.Component>}
 */
clulib.cm.ComponentManager.prototype.getComponentsForElementArray = function (elementArray) {
  return this.nodeTree_.getComponentArray(
      elementArray.map(element => element.getAttribute(this.idAttribute_))
  );
};

/**
 * @param {string} id
 */
clulib.cm.ComponentManager.prototype.disposeNode = function (id) {
  this.nodeTree_.disposeNode(id);
};

/**
 * @param {string} type
 * @param {function(new:clulib.cm.Component)} constructor
 */
clulib.cm.ComponentManager.prototype.addComponent = function (type, constructor) {
  goog.asserts.assert(this.registry_.containsKey(type) == false, `Component with type '${type}' already registered.`);
  this.registry_.set(type, constructor);
};

/**
 * @param {goog.structs.Map<string, function(new:clulib.cm.Component)>|Object<string, function(new:clulib.cm.Component)>} map
 */
clulib.cm.ComponentManager.prototype.addComponentMap = function (map) {
  map = new goog.structs.Map(map);

  map.forEach((component, type) => {
    this.addComponent(type, component);
  });
};

/**
 * @param {Element=} rootElement
 * @returns {Promise}
 */
clulib.cm.ComponentManager.prototype.decorate = function (rootElement = document.body) {
  return this.nodeTree_.createTree(rootElement);
};

clulib.cm.ComponentManager.prototype.disposeAll = function () {
  this.nodeTree_.disposeAll();
};