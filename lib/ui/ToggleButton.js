goog.provide('clulib.ui.ToggleButton');
goog.provide('clulib.ui.ToggleButton.EventType');

goog.require('clulib.cm.Component');

goog.require('goog.dom.classlist');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');

/**
 * This class assumes to be only decorated on 'button' elements.
 *
 * @constructor
 * @extends {clulib.cm.Component}
 */
clulib.ui.ToggleButton = function () {
  clulib.ui.ToggleButton.base(this, 'constructor');

  /**
   * @type {boolean}
   * @private
   */
  this.isChecked_ = false;
};

goog.inherits(
    clulib.ui.ToggleButton,
    clulib.cm.Component
);

/**
 * @type {string}
 */
clulib.ui.ToggleButton.CHECKED_CLASS = 'checked';

/**
 * @enum {string}
 */
clulib.ui.ToggleButton.EventType = {
  CHANGE: 'change'
};

/**
 * @inheritDoc
 */
clulib.ui.ToggleButton.prototype.onInit = function () {
  clulib.ui.ToggleButton.base(this, 'onInit');

  this.isChecked_ = goog.dom.classlist.contains(this.getElement(), clulib.ui.ToggleButton.CHECKED_CLASS);
  this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK, () => {
    this.toggle();
  });
};

/**
 * @returns {boolean}
 */
clulib.ui.ToggleButton.prototype.isDisabled = function () {
  let button = /** @type {HTMLButtonElement} */ (this.getElement());

  return button.disabled;
};

/**
 * @returns {boolean}
 */
clulib.ui.ToggleButton.prototype.isChecked = function () {
  return this.isChecked_;
};

/**
 * @param {boolean} value
 */
clulib.ui.ToggleButton.prototype.setDisabled = function (value) {
  let button = /** @type {HTMLButtonElement} */ (this.getElement());
  button.disabled = value;
};

/**
 * @param {boolean} value
 * @param {boolean=} opt_preventEvent
 */
clulib.ui.ToggleButton.prototype.setChecked = function (value, opt_preventEvent) {
  let preventEvent = opt_preventEvent || false;

  if (this.isChecked_ != value && !this.isDisabled()) {
    this.isChecked_ = value;
    goog.dom.classlist.enable(this.getElement(), clulib.ui.ToggleButton.CHECKED_CLASS, this.isChecked_);
    if (!preventEvent)
      this.dispatchEvent(new goog.events.Event(clulib.ui.ToggleButton.EventType.CHANGE));
  }
};

/**
 * @param {boolean=} opt_preventEvent
 */
clulib.ui.ToggleButton.prototype.toggle = function (opt_preventEvent) {
  let preventEvent = opt_preventEvent || false;

  this.setChecked(!this.isChecked_, preventEvent);
};