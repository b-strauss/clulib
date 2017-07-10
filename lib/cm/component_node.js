goog.provide('clulib.cm.ComponentNode');

goog.require('goog.crypt.base64');
goog.require('goog.structs.Map');

/**
 * Look into [clulib.cm.Component] and [clulib.cm.ComponentManager] instead.
 *
 * @param {clulib.cm.ComponentManager} manager
 * @param {Element} element
 * @constructor
 * @package
 */
clulib.cm.ComponentNode = function (manager, element) {
  /**
   * @type {clulib.cm.ComponentManager}
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
   * @type {?clulib.cm.Component}
   * @private
   */
  this.component_ = null;

  /**
   * @type {?string}
   * @private
   */
  this.id_ = null;

  /**
   * @type {clulib.cm.ComponentNode}
   * @private
   */
  this.parent_ = null;

  /**
   * @type {goog.structs.Map<string, clulib.cm.ComponentNode>}
   * @const
   * @private
   */
  this.children_ = new goog.structs.Map();

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
};

/**
 * @param {clulib.cm.ComponentNode} node
 */
clulib.cm.ComponentNode.prototype.addChild = function (node) {
  node.parent_ = this;
  this.children_.set(node.getId(), node);
  this.component_.addChild(node.component_, false);
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
 * @returns {?clulib.cm.Component}
 */
clulib.cm.ComponentNode.prototype.getComponent = function () {
  return this.component_;
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
 * @param {function(new:clulib.cm.Component)} constructor
 */
clulib.cm.ComponentNode.prototype.instantiate = function (constructor) {
  this.component_ = new constructor();

  this.id_ = this.component_.getId();
  this.element_.setAttribute(this.manager_.getIdAttribute(), /** @type {!string} */ (this.id_));

  this.component_.manager = this.manager_;
  if (this.config_ != null)
    this.component_.setModel(JSON.parse(goog.crypt.base64.decodeString(this.config_)));
};

clulib.cm.ComponentNode.prototype.decorate = function () {
  this.component_.decorate(this.element_);
};

/**
 * @returns {Promise}
 */
clulib.cm.ComponentNode.prototype.initialize = function () {
  return this.component_.waitFor()
      .then(() => {
        this.component_.onInit();
        this.component_.initCompleter.resolve();
      });
};

clulib.cm.ComponentNode.prototype.dispose = function () {
  if (this.parent_ != null)
    this.parent_.children_.remove(this.getId());
};