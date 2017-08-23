goog.module('clulib.ui.ToggleButton');

const {Component} = goog.require('clulib.cm');

const {contains, enable} = goog.require('goog.dom.classlist');
const GoogEvent = goog.require('goog.events.Event');
const GoogEventType = goog.require('goog.events.EventType');

/**
 * @enum {string}
 */
const EventType = {
  CHANGE: 'clulib.ui.ToggleButton.EventType.CHANGE'
};

/**
 * This class assumes to be only decorated on 'button' elements.
 *
 * @constructor
 * @extends {Component}
 */
function ToggleButton () {
  ToggleButton.base(this, 'constructor');

  /**
   * @type {boolean}
   * @private
   */
  this.isChecked_ = false;
}

goog.inherits(
  ToggleButton,
  Component
);

/**
 * @type {string}
 * @const
 */
ToggleButton.CHECKED_CLASS = 'checked';

/**
 * @inheritDoc
 */
ToggleButton.prototype.onInit = function () {
  ToggleButton.base(this, 'onInit');

  this.isChecked_ = contains(this.getElement(), ToggleButton.CHECKED_CLASS);
  this.getHandler().listen(this.getElement(), GoogEventType.CLICK, () => {
    this.toggle();
  });
};

/**
 * @returns {boolean}
 */
ToggleButton.prototype.isDisabled = function () {
  let button = /** @type {HTMLButtonElement} */ (this.getElement());

  return button.disabled;
};

/**
 * @returns {boolean}
 */
ToggleButton.prototype.isChecked = function () {
  return this.isChecked_;
};

/**
 * @param {boolean} value
 */
ToggleButton.prototype.setDisabled = function (value) {
  let button = /** @type {HTMLButtonElement} */ (this.getElement());
  button.disabled = value;
};

/**
 * @param {boolean} value
 * @param {boolean=} preventEvent
 */
ToggleButton.prototype.setChecked = function (value, preventEvent = false) {
  if (this.isChecked_ !== value) {
    this.isChecked_ = value;
    enable(this.getElement(), ToggleButton.CHECKED_CLASS, this.isChecked_);
    if (!preventEvent)
      this.dispatchEvent(new GoogEvent(EventType.CHANGE));
  }
};

/**
 * @param {boolean=} preventEvent
 */
ToggleButton.prototype.toggle = function (preventEvent = false) {
  this.setChecked(!this.isChecked_, preventEvent);
};

exports = {ToggleButton, EventType};
