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
 */
class ToggleButton extends Component {
  constructor () {
    super();

    /**
     * @type {boolean}
     * @private
     */
    this.isChecked_ = false;
  }

  /**
   * @inheritDoc
   */
  onInit () {
    super.onInit();

    this.isChecked_ = contains(this.getElement(), ToggleButton.CHECKED_CLASS);
    this.getHandler().listen(this.getElement(), GoogEventType.CLICK, () => {
      this.toggle();
    });
  }

  /**
   * @returns {boolean}
   */
  isDisabled () {
    let button = /** @type {HTMLButtonElement} */ (this.getElement());

    return button.disabled;
  }

  /**
   * @returns {boolean}
   */
  isChecked () {
    return this.isChecked_;
  }

  /**
   * @param {boolean} value
   */
  setDisabled (value) {
    let button = /** @type {HTMLButtonElement} */ (this.getElement());
    button.disabled = value;
  }

  /**
   * @param {boolean} value
   * @param {boolean=} preventEvent
   */
  setChecked (value, preventEvent = false) {
    if (this.isChecked_ !== value) {
      this.isChecked_ = value;
      enable(this.getElement(), ToggleButton.CHECKED_CLASS, this.isChecked_);
      if (!preventEvent)
        this.dispatchEvent(new GoogEvent(EventType.CHANGE));
    }
  }

  /**
   * @param {boolean=} preventEvent
   */
  toggle (preventEvent = false) {
    this.setChecked(!this.isChecked_, preventEvent);
  }
}

/**
 * @type {string}
 * @const
 */
ToggleButton.CHECKED_CLASS = 'checked';

exports = {ToggleButton, EventType};
