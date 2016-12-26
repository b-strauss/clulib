goog.provide('clulib.cm.ComponentNode');

goog.require('goog.crypt.base64');

/**
 * @param {clulib.cm.ComponentManager} manager
 * @param {Element} element
 * @constructor
 */
clulib.cm.ComponentNode = function (manager, element) {
  /**
   * @type {clulib.cm.ComponentManager}
   * @private
   */
  this.manager_ = manager;

  /**
   * @type {Element}
   * @private
   */
  this.element_ = element;

  /**
   * @type {?clulib.cm.AbstractComponent}
   * @private
   */
  this.component_ = null;

  /**
   * @type {?string}
   * @private
   */
  this.id_ = null;

  /**
   * @type {Array<clulib.cm.ComponentNode>}
   * @private
   */
  this.children_ = [];

  /**
   * @type {number}
   * @private
   */
  this.depth_ = 0;

  /**
   * @type {string}
   * @private
   */
  this.type_ = this.element_.getAttribute(this.manager_.getTypeAttribute());

  /**
   * @type {?string}
   * @private
   */
  this.config_ = this.element_.getAttribute(this.manager_.getConfigAttribute());
};

/**
 * @param {clulib.cm.ComponentNode} node
 */
clulib.cm.ComponentNode.prototype.addChild = function (node) {
  this.children_.push(node);
  node.setDepth(this.depth_ + 1);
};

/**
 * @param {number} depth
 */
clulib.cm.ComponentNode.prototype.setDepth = function (depth) {
  this.depth_ = depth;
  this.children_.forEach(node => node.setDepth(this.depth_ + 1));
};

/**
 * @returns {number}
 */
clulib.cm.ComponentNode.prototype.getDepth = function () {
  return this.depth_;
};

/**
 * @returns {Element}
 */
clulib.cm.ComponentNode.prototype.getElement = function () {
  return this.element_;
};

/**
 * @returns {string}
 */
clulib.cm.ComponentNode.prototype.getType = function () {
  return this.type_;
};

/**
 * @returns {?string}
 */
clulib.cm.ComponentNode.prototype.getId = function () {
  return this.id_;
};

/**
 * @param {function(new:clulib.cm.AbstractComponent)} constructor
 */
clulib.cm.ComponentNode.prototype.instantiate = function (constructor) {
  this.component_ = new constructor();

  this.id_ = this.component_.getId();
  this.element_.setAttribute(this.manager_.getIdAttribute(), this.id_);

  this.component_.manager = this.manager_;
  this.component_.type = this.type_;
  if (this.config_ != null)
    this.component_.config = JSON.parse(goog.crypt.base64.decodeString(this.config_));
};

/**
 * @returns {Promise<clulib.cm.AbstractComponent>}
 */
clulib.cm.ComponentNode.prototype.initialize = function () {
  this.component_.decorate(this.element_);
  return this.component_.waitFor()
      .then(() => this.component_.onInit());
};