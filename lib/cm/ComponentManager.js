goog.provide('clulib.cm.ComponentManager');

goog.require('clulib.cm.NodeTree');

goog.require('goog.structs.Map');

/**
 * @param {string=} opt_typeAttribute
 * @param {string=} opt_idAttribute
 * @param {string=} opt_configAttribute
 * @constructor
 */
clulib.cm.ComponentManager = function (opt_typeAttribute, opt_idAttribute, opt_configAttribute) {
  /**
   * @type {string}
   * @private
   */
  this.typeAttribute_ = opt_typeAttribute || 'data-cmp';

  /**
   * @type {string}
   * @private
   */
  this.idAttribute_ = opt_idAttribute || 'data-cmp-id';

  /**
   * @type {string}
   * @private
   */
  this.configAttribute_ = opt_configAttribute || 'data-cmp-cfg';

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
 * @param {string} id
 */
clulib.cm.ComponentManager.prototype.disposeNode = function (id) {
  this.nodeTree_.disposeNode(id);
};

/**
 * @param {string} type
 * @param {function(new:clulib.cm.AbstractComponent)} constructor
 */
clulib.cm.ComponentManager.prototype.addComponent = function (type, constructor) {
  this.registry_.set(type, constructor);
};

/**
 * @param {Element=} opt_rootElement
 * @returns {Promise}
 */
clulib.cm.ComponentManager.prototype.decorate = function (opt_rootElement) {
  let rootElement = opt_rootElement || document.body;
  return this.nodeTree_.createTree(rootElement);
};